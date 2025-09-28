import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { useCookingTimer } from '../contexts/CookingTimerContext';
import * as Haptics from 'expo-haptics';

interface StepTimerProps {
  stepId: string;
  stepText: string;
  stepTitle: string;
  recipeTitle: string;
  stepNumber?: number;
}

interface TimeMatch {
  duration: number; // in seconds
  text: string;
  originalText: string;
}

const StepTimer: React.FC<StepTimerProps> = ({
  stepId,
  stepText,
  stepTitle,
  recipeTitle,
  stepNumber
}) => {
  const { colors } = useThemeStyles();
  const { 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    resetTimer, 
    getTimerForStep 
  } = useCookingTimer();
  
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<TimeMatch | null>(null);

  const currentTimer = getTimerForStep(stepId);

  // Utility functions
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Extract time mentions from step text
  const timeMatches = useMemo(() => {
    const matches: TimeMatch[] = [];
    
    // Common time patterns
    const patterns = [
      // "15 minutes", "5 mins", "1 hour", "30 seconds"
      /(\d+(?:\.\d+)?)\s*(minutes?|mins?|min|hours?|hrs?|hr|seconds?|secs?|sec)/gi,
      // "2-3 minutes", "1.5 hours"
      /(\d+(?:\.\d+)?(?:\s*[-–—]\s*\d+(?:\.\d+)?)?)\s*(minutes?|mins?|min|hours?|hrs?|hr|seconds?|secs?|sec)/gi,
      // Special cooking terms
      /until\s+(?:golden|tender|done|cooked)/gi,
      /(?:simmer|boil|bake|cook)\s+(?:for\s+)?(\d+(?:\.\d+)?)\s*(minutes?|mins?|min|hours?|hrs?|hr)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(stepText)) !== null) {
        const timeStr = match[1];
        const unit = match[2]?.toLowerCase() || '';
        
        let seconds = 0;
        
        if (timeStr) {
          // Handle range (e.g., "2-3 minutes" -> use max value)
          const timeValue = timeStr.includes('-') || timeStr.includes('–') || timeStr.includes('—')
            ? Math.max(...timeStr.split(/[-–—]/).map(n => parseFloat(n.trim())))
            : parseFloat(timeStr);
          
          if (unit.startsWith('hour') || unit.startsWith('hr')) {
            seconds = Math.round(timeValue * 3600);
          } else if (unit.startsWith('min')) {
            seconds = Math.round(timeValue * 60);
          } else if (unit.startsWith('sec')) {
            seconds = Math.round(timeValue);
          }
        }
        
        if (seconds > 0) {
          matches.push({
            duration: seconds,
            text: `${formatTime(seconds)}`,
            originalText: match[0]
          });
        }
      }
    });

    // Remove duplicates based on duration
    const uniqueMatches = matches.filter((match, index, self) => 
      index === self.findIndex(m => m.duration === match.duration)
    );

    return uniqueMatches;
  }, [stepText]);



  const handleStartTimer = (timeMatch: TimeMatch) => {
    const title = stepTitle || `Step ${stepNumber || ''}`;
    startTimer(stepId, title, recipeTitle, timeMatch.duration);
    setShowTimeSelector(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleTimerAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!currentTimer) {
      if (timeMatches.length === 1) {
        // Single time match - start immediately
        handleStartTimer(timeMatches[0]);
      } else if (timeMatches.length > 1) {
        // Multiple time matches - show selector
        setShowTimeSelector(true);
      }
    } else if (currentTimer.isActive && !currentTimer.isPaused) {
      pauseTimer(currentTimer.id);
    } else if (currentTimer.isActive && currentTimer.isPaused) {
      resumeTimer(currentTimer.id);
    } else {
      // Timer is stopped, show options to restart
      setShowTimeSelector(true);
    }
  };

  const handleStop = () => {
    if (currentTimer) {
      stopTimer(currentTimer.id);
    }
  };

  const handleReset = () => {
    if (currentTimer) {
      resetTimer(currentTimer.id);
    }
  };

  // Don't render if no time mentions found
  if (timeMatches.length === 0) {
    return null;
  }

  // Get timer state
  const isActive = currentTimer?.isActive || false;
  const isPaused = currentTimer?.isPaused || false;
  const timeRemaining = currentTimer?.timeRemaining || 0;
  const isCompleted = currentTimer && !isActive && timeRemaining === 0;

  return (
    <>
      <View style={styles.container}>
        {/* Main timer button */}
        <TouchableOpacity
          style={[
            styles.timerButton,
            { 
              backgroundColor: isActive 
                ? (isPaused ? colors.secondary : colors.primary)
                : isCompleted 
                  ? colors.success 
                  : `${colors.primary}20`,
              borderColor: isActive ? colors.primary : colors.border
            }
          ]}
          onPress={handleTimerAction}
          accessibilityLabel={
            isActive 
              ? isPaused 
                ? `Resume timer, ${formatTimeRemaining(timeRemaining)} remaining`
                : `Pause timer, ${formatTimeRemaining(timeRemaining)} remaining`
              : isCompleted
                ? 'Timer completed, tap to restart'
                : `Start timer for ${timeMatches.map(t => t.text).join(' or ')}`
          }
        >
          {isActive ? (
            <View style={styles.activeTimerContent}>
              <Text style={[styles.timerIcon, { color: colors.background }]}>
                {isPaused ? '▶️' : '⏸️'}
              </Text>
              <Text style={[styles.timerTime, { color: colors.background }]}>
                {formatTimeRemaining(timeRemaining)}
              </Text>
            </View>
          ) : isCompleted ? (
            <View style={styles.completedTimerContent}>
              <Text style={[styles.timerIcon, { color: colors.background }]}>✅</Text>
              <Text style={[styles.timerLabel, { color: colors.background }]}>Done</Text>
            </View>
          ) : (
            <View style={styles.inactiveTimerContent}>
              <Text style={[styles.timerIcon, { color: colors.primary }]}>⏲️</Text>
              <Text style={[styles.timerLabel, { color: colors.primary }]}>Timer</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Timer controls when active */}
        {isActive && (
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.error }]}
              onPress={handleStop}
              accessibilityLabel="Stop timer"
            >
              <Text style={[styles.controlButtonText, { color: colors.background }]}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.secondary }]}
              onPress={handleReset}
              accessibilityLabel="Reset timer"
            >
              <Text style={[styles.controlButtonText, { color: colors.text }]}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Time selector modal */}
      <Modal
        visible={showTimeSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Timer Duration
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Step {stepNumber}: {stepTitle}
            </Text>
            
            <View style={styles.timeOptions}>
              {timeMatches.map((timeMatch, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.timeOption, { borderColor: colors.border }]}
                  onPress={() => handleStartTimer(timeMatch)}
                >
                  <Text style={[styles.timeOptionText, { color: colors.text }]}>
                    {timeMatch.text}
                  </Text>
                  <Text style={[styles.timeOptionOriginal, { color: colors.textSecondary }]}>
                    "{timeMatch.originalText}"
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.secondary }]}
              onPress={() => setShowTimeSelector(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  timerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inactiveTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  timerTime: {
    fontSize: 14,
    fontFamily: 'Geist-Medium',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 12,
    fontFamily: 'Geist-Medium',
  },
  timerControls: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
  },
  controlButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  controlButtonText: {
    fontSize: 10,
    fontFamily: 'Geist-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Geist-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Geist',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeOptions: {
    marginBottom: 20,
  },
  timeOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  timeOptionText: {
    fontSize: 16,
    fontFamily: 'Geist-Medium',
    marginBottom: 4,
  },
  timeOptionOriginal: {
    fontSize: 12,
    fontFamily: 'Geist',
    fontStyle: 'italic',
  },
  cancelButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Geist-Medium',
  },
});

export default StepTimer;