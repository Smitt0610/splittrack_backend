import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { auth } from '../_utils/firebase';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = 'https://splittrack-backend-0ax9.onrender.com';

type Member = {
  email: string;
  nickname: string;
};

export default function AddGroupExpenseScreen() {
  const { groupId, groupName } = useLocalSearchParams();
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [paidBy, setPaidBy] = useState('');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch members on mount
  useState(() => {
    fetch(`${BACKEND_URL}/groups?uid=${auth.currentUser?.email}`)
      .then(res => res.json())
      .then(groups => {
        const thisGroup = groups.find((g: any) => g._id === groupId);
        if (thisGroup) {
          setMembers(thisGroup.members);
          setPaidBy(thisGroup.members[0]?.email || '');
          setSplitBetween(thisGroup.members.map((m: any) => m.email));
        }
      });
  });

  const toggleSplit = (email: string) => {
    if (splitBetween.includes(email)) {
      setSplitBetween(splitBetween.filter(e => e !== email));
    } else {
      setSplitBetween([...splitBetween, email]);
    }
  };

  const handleSubmit = async () => {
    if (!description || !amount || !paidBy || splitBetween.length === 0) {
      Alert.alert('Please fill all fields and select split members.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/group-expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId,
          description,
          amount: parseFloat(amount),
          paidBy,
          splitBetween,
        }),
      });

      if (!res.ok) throw new Error('Failed to add expense');
      Alert.alert('✅ Expense Added');
      router.back();
    } catch (err: any) {
      Alert.alert('❌ Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back button */}
      <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#1e293b" />
              </TouchableOpacity>
              <Text style={styles.title}>Add Expenses to {groupName}</Text>
            </View>

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Who Paid?</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={paidBy} onValueChange={setPaidBy}>
          {members.map((m) => (
            <Picker.Item
              key={m.email}
              label={`${m.nickname} (${m.email})`}
              value={m.email}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Split Between:</Text>
      {members.map((m) => (
        <Text
          key={m.email}
          style={{
            paddingVertical: 4,
            fontSize: 16,
            color: splitBetween.includes(m.email) ? 'black' : 'gray',
          }}
          onPress={() => toggleSplit(m.email)}
        >
          {splitBetween.includes(m.email) ? '✅' : '⬜'} {m.nickname}
        </Text>
      ))}

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.saveButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Expense</Text>
        )}
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
  backButton: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    color: '#1e293b',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
