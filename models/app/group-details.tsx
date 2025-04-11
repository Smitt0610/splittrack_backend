import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = 'https://splittrack-backend-0ax9.onrender.com';

type GroupExpense = {
  _id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
};

export default function GroupDetailScreen() {
  const { groupId, groupName } = useLocalSearchParams();
  const [expenses, setExpenses] = useState<GroupExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/group-expenses?groupId=${groupId}`);
        const data = await res.json();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching group expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>📋 {groupName} Expenses</Text>
      </View>

      {/* Expense List */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : expenses.length === 0 ? (
        <Text style={styles.empty}>No expenses yet.</Text>
      ) : (
        expenses.map((item) => (
          <View key={item._id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.details}>Paid by: {item.paidBy}</Text>
              <Text style={styles.details}>Split: {item.splitBetween.join(', ')}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          </View>
        ))
      )}

      {/* Add Expense Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push({
            pathname: './add-group-expense',
            params: {
              groupId: groupId as string,
              groupName: groupName as string,
            },
          })
        }
      >
        <Ionicons name="add-circle-outline" size={20} color="#2563eb" />
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f8ff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    marginTop: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',

  },
  empty: {
    fontStyle: 'italic',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  description: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
    color: '#0f172a',
  },
  details: {
    fontSize: 12,
    color: '#64748b',
  },
  date: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
    alignSelf: 'center',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 24,
    borderRadius: 10,
    backgroundColor: '#fff',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
});
