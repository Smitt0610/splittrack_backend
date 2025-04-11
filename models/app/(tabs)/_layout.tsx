import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'groups') iconName = 'people';
          else if (route.name === 'profile') iconName = 'person';
          else if (route.name === 'index') iconName = 'home';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          headerShown: false, // ✅ Hide header only for Groups screen
          title: 'Groups',
        }}
      />
      <Tabs.Screen
  name="profile"
  options={{
    headerShown: false, // ✅ Hide header for Profile screen
    title: 'Profile',   // Tab label below icon
  }}
/>

    </Tabs>
  );
}
