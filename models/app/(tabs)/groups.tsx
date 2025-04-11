import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import { auth } from '../../_utils/firebase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = 'https://splittrack-backend-0ax9.onrender.com';

type Group = {
  _id: string;
  name: string;
  members: { email: string; nickname: string }[];
};

export default function GroupsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [members, setMembers] = useState<{ email: string; nickname: string }[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const user = auth.currentUser;
  const router = useRouter();

  const fetchGroups = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${BACKEND_URL}/groups?uid=${user.email}`);
      const data = await res.json();
      setGroups(data);
    } catch (err: any) {
      console.error('❌ Error fetching groups:', err.message);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddMember = () => {
    if (!email || !nickname) {
      Alert.alert('Please enter both email and nickname.');
      return;
    }
    setMembers([...members, { email: email.trim(), nickname: nickname.trim() }]);
    setEmail('');
    setNickname('');
  };

  const handleCreateGroup = async () => {
    if (!user || !name || members.length === 0) {
      Alert.alert('Fill in all group details and add at least one member.');
      return;
    }

    const finalMembers = [...members, { email: user.email!, nickname: 'You' }];

    try {
      const res = await fetch(`${BACKEND_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          members: finalMembers,
          createdBy: user.email,
        }),
      });

      if (!res.ok) throw new Error('Failed to create group');
      Alert.alert('✅ Group created!');
      setName('');
      setMembers([]);
      fetchGroups();
    } catch (err: any) {
      Alert.alert('❌ Error', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>👥 Create a Group</Text>

      {/* Group Name */}
      <View style={styles.inputCard}>
        <Ionicons name="people" size={18} color="#888" />
        <TextInput
          placeholder="Group name"
          value={name}
          onChangeText={setName}
          style={styles.inputField}
        />
      </View>

      {/* Add Members */}
      <Text style={styles.subheading}>➕ Add Members</Text>
      <View style={styles.inputCard}>
        <Ionicons name="mail" size={18} color="#888" />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.inputField}
        />
      </View>
      <View style={styles.inputCard}>
        <Ionicons name="person" size={18} color="#888" />
        <TextInput
          placeholder="Nickname"
          value={nickname}
          onChangeText={setNickname}
          style={styles.inputField}
        />
      </View>

      {/* Add Button */}
      <TouchableOpacity onPress={handleAddMember} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Add Member</Text>
      </TouchableOpacity>

      {/* Member List */}
      <FlatList
        data={members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.memberItem}>✅ {item.nickname} ({item.email})</Text>
        )}
        ListEmptyComponent={<Text style={styles.grayText}>No members added yet.</Text>}
      />

      {/* Create Group Button */}
      <TouchableOpacity onPress={handleCreateGroup} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Create Group</Text>
      </TouchableOpacity>

      {/* Group List */}
      <Text style={styles.title}>📃 Your Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '../group-details',
                params: { groupId: item._id, groupName: item.name },
              })
            }
          >
            <View style={styles.groupCard}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupMembers}>
                Members: {item.members.map(m => m.nickname).join(', ')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.grayText}>No groups yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#f0f8ff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  subheading: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
    color: '#334155',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
    gap: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  grayText: {
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  memberItem: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 10,
    color: '#1e293b',
  },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  groupMembers: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
});
