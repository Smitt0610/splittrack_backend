import { useLocalSearchParams } from 'expo-router';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

const BACKEND_URL = 'https://splittrack-backend-0ax9.onrender.com';

type Group = {
  name: string;
  members: { email: string; nickname: string }[];
};

type GroupExpense = {
  _id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
};

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams(); // group ID
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<GroupExpense[]>([]);

  const fetchGroup = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/group/${id}`);
      const data = await res.json();
      console.log("📥 Group Data:", data);
      setGroup(data);
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  const fetchGroupExpenses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/group-expenses?groupId=${id}`);
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching group expenses:', error);
    }
  };

  useEffect(() => {
    console.log("📦 Group ID:", id);
    fetchGroup();
    fetchGroupExpenses();
  }, []);

  return (
    <View style={styles.container}>
      {group && (
        <>
          <Text style={styles.title}>👨‍👩‍👧‍👦 {group.name}</Text>
          <Text style={styles.subtitle}>
            Members: {group.members.map((m) => m.nickname).join(', ')}
          </Text>
        </>
      )}

      <Text style={styles.sectionTitle}>💸 Group Expenses</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseDesc}>{item.description}</Text>
            <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
            <Text style={styles.expenseMeta}>
              Paid by: {item.paidBy} | Split: {item.splitBetween.length} people
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: 'gray' }}>No group expenses yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  expenseItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  expenseDesc: { fontWeight: 'bold', fontSize: 16 },
  expenseAmount: { fontSize: 14, color: 'green' },
  expenseMeta: { fontSize: 12, color: 'gray' },
});
