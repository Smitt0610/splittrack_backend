import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Group Detail</Text>
      <Text style={styles.text}>Group ID: {groupId}</Text>
      {/* Later: Fetch group data and show expenses */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});
