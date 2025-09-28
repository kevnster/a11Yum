// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 480,
    height: 480,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary.green,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary.green,
  },
  selectionOverlay: {
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  selectedText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary.green,
  },
  typedText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary.green,
  },
  mouseCursor: {
    position: 'absolute',
    top: 15, // Adjust vertical position to be more centered
    left: 21, // Position dead center between the "11" characters
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouseText: {
    fontSize: 42, // Same size as the text
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: Colors.primary.orange,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: Colors.primary.orange,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedButtonText: {
    color: Colors.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
