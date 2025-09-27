// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: Colors.text.primary },
  message: { fontSize: 15, textAlign: 'center', marginBottom: 16, color: Colors.text.secondary },
  buttons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btn: { flex: 1, paddingVertical: 10, marginHorizontal: 6, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: Colors.button.primary },
  secondary: { backgroundColor: Colors.button.secondary },
  btnText: { color: Colors.button.primaryText, fontWeight: '600' },
  button: { backgroundColor: Colors.button.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: Colors.button.primaryText, fontWeight: '700' },
  linkText: { color: Colors.primary.orange, fontWeight: '700' },

  /* input / validation styles */
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.neutral.mediumGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: { color: Colors.semantic.error, marginBottom: 6, textAlign: 'center' },
});

export default styles;
export default styles;
