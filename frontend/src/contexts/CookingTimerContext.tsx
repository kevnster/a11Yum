import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface CookingTimer {
  id: string;
  stepId: string;
  stepTitle: string;
  recipeTitle: string;
  duration: number; // in seconds
  timeRemaining: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface CookingTimerContextType {
  timers: CookingTimer[];
  
  // Timer management
  startTimer: (stepId: string, stepTitle: string, recipeTitle: string, duration: number) => string;
  pauseTimer: (timerId: string) => void;
  resumeTimer: (timerId: string) => void;
  stopTimer: (timerId: string) => void;
  resetTimer: (timerId: string) => void;
  
  // Timer queries
  getTimer: (timerId: string) => CookingTimer | undefined;
  getActiveTimers: () => CookingTimer[];
  getTimerForStep: (stepId: string) => CookingTimer | undefined;
  
  // Utility
  clearCompletedTimers: () => void;
  getTotalActiveTime: () => number;
}

const TIMERS_STORAGE_KEY = '@a11yum_cooking_timers';

const CookingTimerContext = createContext<CookingTimerContextType | undefined>(undefined);

export const useCookingTimer = (): CookingTimerContextType => {
  const context = useContext(CookingTimerContext);
  if (!context) {
    throw new Error('useCookingTimer must be used within a CookingTimerProvider');
  }
  return context;
};

interface CookingTimerProviderProps {
  children: ReactNode;
}

// Simple UUID generator
const generateUUID = (): string => {
  return 'timer-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const CookingTimerProvider: React.FC<CookingTimerProviderProps> = ({ children }) => {
  const [timers, setTimers] = useState<CookingTimer[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>('active');
  const backgroundTimeRef = useRef<Date | null>(null);

  // Load timers from storage on mount
  useEffect(() => {
    loadTimers();
    
    // Handle app state changes for background/foreground
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current === 'background' && nextAppState === 'active') {
        // App came to foreground, update timers based on background time
        handleReturnFromBackground();
      } else if (nextAppState === 'background') {
        // App went to background, save current time
        backgroundTimeRef.current = new Date();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Save timers whenever they change
  useEffect(() => {
    saveTimers();
  }, [timers]);

  // Main timer interval
  useEffect(() => {
    if (timers.some(timer => timer.isActive && !timer.isPaused)) {
      intervalRef.current = setInterval(updateActiveTimers, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timers]);

  const loadTimers = async () => {
    try {
      const stored = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
      if (stored) {
        const parsedTimers = JSON.parse(stored);
        const timersWithDates = parsedTimers.map((timer: any) => ({
          ...timer,
          createdAt: new Date(timer.createdAt),
          completedAt: timer.completedAt ? new Date(timer.completedAt) : undefined
        }));
        setTimers(timersWithDates);
      }
    } catch (error) {
      console.error('Error loading cooking timers:', error);
    }
  };

  const saveTimers = async () => {
    try {
      await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    } catch (error) {
      console.error('Error saving cooking timers:', error);
    }
  };

  const handleReturnFromBackground = () => {
    if (!backgroundTimeRef.current) return;

    const backgroundDuration = Math.floor((Date.now() - backgroundTimeRef.current.getTime()) / 1000);
    
    setTimers(prevTimers => prevTimers.map(timer => {
      if (timer.isActive && !timer.isPaused) {
        const newTimeRemaining = Math.max(0, timer.timeRemaining - backgroundDuration);
        
        if (newTimeRemaining === 0 && timer.timeRemaining > 0) {
          // Timer completed while in background
          handleTimerComplete(timer);
          return {
            ...timer,
            timeRemaining: 0,
            isActive: false,
            completedAt: new Date()
          };
        }
        
        return {
          ...timer,
          timeRemaining: newTimeRemaining
        };
      }
      return timer;
    }));

    backgroundTimeRef.current = null;
  };

  const updateActiveTimers = () => {
    setTimers(prevTimers => prevTimers.map(timer => {
      if (timer.isActive && !timer.isPaused && timer.timeRemaining > 0) {
        const newTimeRemaining = timer.timeRemaining - 1;
        
        if (newTimeRemaining === 0) {
          // Timer completed
          handleTimerComplete(timer);
          return {
            ...timer,
            timeRemaining: 0,
            isActive: false,
            completedAt: new Date()
          };
        }
        
        return {
          ...timer,
          timeRemaining: newTimeRemaining
        };
      }
      return timer;
    }));
  };

  const handleTimerComplete = (timer: CookingTimer) => {
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Show alert
    Alert.alert(
      '🍳 Timer Complete!',
      `"${timer.stepTitle}" timer has finished!\n\nRecipe: ${timer.recipeTitle}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Additional haptic feedback on dismiss
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      ],
      { cancelable: false }
    );
  };

  const startTimer = (stepId: string, stepTitle: string, recipeTitle: string, duration: number): string => {
    // Stop any existing timer for this step
    const existingTimer = getTimerForStep(stepId);
    if (existingTimer) {
      stopTimer(existingTimer.id);
    }

    const newTimer: CookingTimer = {
      id: generateUUID(),
      stepId,
      stepTitle,
      recipeTitle,
      duration,
      timeRemaining: duration,
      isActive: true,
      isPaused: false,
      createdAt: new Date()
    };

    setTimers(prevTimers => [...prevTimers, newTimer]);
    
    // Haptic feedback for starting timer
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    return newTimer.id;
  };

  const pauseTimer = (timerId: string) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.id === timerId ? { ...timer, isPaused: true } : timer
    ));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resumeTimer = (timerId: string) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.id === timerId ? { ...timer, isPaused: false } : timer
    ));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const stopTimer = (timerId: string) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.id === timerId ? { ...timer, isActive: false, isPaused: false } : timer
    ));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetTimer = (timerId: string) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.id === timerId 
        ? { ...timer, timeRemaining: timer.duration, isActive: false, isPaused: false, completedAt: undefined }
        : timer
    ));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const getTimer = (timerId: string): CookingTimer | undefined => {
    return timers.find(timer => timer.id === timerId);
  };

  const getActiveTimers = (): CookingTimer[] => {
    return timers.filter(timer => timer.isActive);
  };

  const getTimerForStep = (stepId: string): CookingTimer | undefined => {
    return timers.find(timer => timer.stepId === stepId && timer.isActive);
  };

  const clearCompletedTimers = () => {
    setTimers(prevTimers => prevTimers.filter(timer => timer.isActive || timer.timeRemaining > 0));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getTotalActiveTime = (): number => {
    return timers
      .filter(timer => timer.isActive && !timer.isPaused)
      .reduce((total, timer) => total + timer.timeRemaining, 0);
  };

  const value: CookingTimerContextType = {
    timers,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    getTimer,
    getActiveTimers,
    getTimerForStep,
    clearCompletedTimers,
    getTotalActiveTime
  };

  return (
    <CookingTimerContext.Provider value={value}>
      {children}
    </CookingTimerContext.Provider>
  );
};