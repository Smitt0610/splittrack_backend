export const options = {
  headerShown: false,
};

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { auth } from '../../_utils/firebase';

const BACKEND_URL = 'https://splittrack-backend-0ax9.onrender.com';

type Expense = {
  _id: string;
  description: string;
  amount: number;
  date: string;
};

type BalanceBreakdown = {
  [nickname: string]: number;
};

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalOwe, setTotalOwe] = useState<number>(0);
  const [totalOwed, setTotalOwed] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<BalanceBreakdown>({});

  const user = auth.currentUser;

  const fetchData = async () => {
    if (!user) return;
    const uid = user.email;

    try {
      const expRes = await fetch(`${BACKEND_URL}/expenses?uid=${uid}`);
      const expData = await expRes.json();
      setExpenses(expData);

      const balRes = await fetch(`${BACKEND_URL}/total-balance?uid=${uid}`);
      const balData = await balRes.json();
      setTotalOwe(balData.totalOwe);
      setTotalOwed(balData.totalOwed);
      setBreakdown(balData.breakdown);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💰 SplitTrack</Text>

      <AnimatedCard>
        <Text style={styles.cardLabel}>You owe</Text>
        <Text style={[styles.amount, styles.negative]}>${totalOwe.toFixed(2)}</Text>
      </AnimatedCard>

      <AnimatedCard>
        <Text style={styles.cardLabel}>You are owed</Text>
        <Text style={[styles.amount, styles.positive]}>${totalOwed.toFixed(2)}</Text>
      </AnimatedCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Breakdown</Text>
        {Object.keys(breakdown).length === 0 ? (
          <Text style={styles.grayText}>No outstanding balances.</Text>
        ) : (
          Object.entries(breakdown).map(([name, amount], i) => (
            <AnimatedFadeIn key={name} delay={i * 100}>
              <View
                style={[
                  styles.breakdownItem,
                  {
                    borderLeftColor: amount > 0 ? '#22c55e' : '#ef4444',
                  },
                ]}
              >
                <Text style={{ color: amount > 0 ? '#15803d' : '#b91c1c' }}>
                  {amount > 0
                    ? `${name} owes you $${amount.toFixed(2)}`
                    : `You owe ${name} $${Math.abs(amount).toFixed(2)}`}
                </Text>
              </View>
            </AnimatedFadeIn>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕘 Recent Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={styles.grayText}>No expenses yet.</Text>
        ) : (
          expenses.map((item, i) => (
            <AnimatedFadeIn key={item._id} delay={i * 100}>
              <View style={styles.expenseItem}>
                <Text style={styles.expenseDesc}>{item.description}</Text>
                <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
              </View>
            </AnimatedFadeIn>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const scale = new Animated.Value(1);
  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

function AnimatedFadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const fadeAnim = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#f5f8fc',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  positive: {
    color: '#15803d',
  },
  negative: {
    color: '#dc2626',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  grayText: {
    color: '#64748b',
    fontStyle: 'italic',
  },
  breakdownItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  expenseItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  expenseDesc: {
    fontSize: 16,
    color: '#1e293b',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
});
