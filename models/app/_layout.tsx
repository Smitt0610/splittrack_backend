// app/_layout.tsx
import { Stack, useRouter, Slot } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '././auth-context';
import { View, ActivityIndicator } from 'react-native';

function AppContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin'); // Go to sign in if not logged in
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
