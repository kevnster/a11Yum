// styles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  message: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  buttons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btn: { flex: 1, paddingVertical: 10, marginHorizontal: 6, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#4CAF50' },
  secondary: { backgroundColor: '#ddd' },
  btnText: { color: '#fff', fontWeight: '600' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  linkText: { color: '#4CAF50', fontWeight: '700' },

  /* input / validation styles */
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: { color: '#c0392b', marginBottom: 6, textAlign: 'center' },
});


export default styles;
