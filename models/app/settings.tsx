import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import { useRouter } from 'expo-router';
  
  export default function SettingsScreen() {
    const router = useRouter();
  
    const handleResetPassword = () => {
      Alert.alert('Reset Password', 'Password reset link sent to your email.');
    };
  
    return (
      <View style={styles.container}>
        {/* 🔙 Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
  
        <Text style={styles.title}>⚙️ Settings</Text>
  
        {/* Option: Reset Password */}
        <TouchableOpacity style={styles.buttonRow} onPress={handleResetPassword}>
          <Ionicons name="lock-closed-outline" size={20} color="#334155" />
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
  
        {/* Option: Privacy Policy */}
        <TouchableOpacity style={styles.buttonRow}>
          <Ionicons name="document-text-outline" size={20} color="#334155" />
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingTop: 60,
      backgroundColor: '#f0f8ff',
      flex: 1,
    },
    backButton: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 24,
      color: '#1e293b',
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      gap: 12,
    },
    buttonText: {
      fontSize: 16,
      color: '#334155',
    },
  });
  