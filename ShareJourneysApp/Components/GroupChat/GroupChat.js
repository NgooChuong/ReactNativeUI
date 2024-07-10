import React, { useContext, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { addMemberToGroup, createGroup, deleteGroup, getUserByEmail, removeMemberFromGroup } from './InitGroup';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Mycontext from '../../config/Mycontext';

const GroupChat = ({ route }) => {
  const { userId } = route.params;
  const dlUser = useContext(Mycontext);
  const navigation = useNavigation(); // Access navigation object

  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [chatId, setChatId] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [confirmedMembers, setConfirmedMembers] = useState([{}]);

  const handleCreateNameGroup = async () => {
    try {
      console.log("d",dlUser[0].username);
      // const id = await createGroup(groupName, userId, [{uid:userId,user:dlUser[0].username}], dlUser[0].username);
      // setChatId(id);
      console.log("vo day",userId)
      setIsConfirmed(false); // Set confirmation flag to true after successful group creation
      setMembers([{ uid: userId,
        username: dlUser[0].username}]); // Add creator as confirmed member
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddMember = async () => {
    try {
      console.log("emaldad",newMemberEmail);
      let user = await getUserByEmail(newMemberEmail);

      // await addMemberToGroup(chatId,user,newMemberEmail);
      console.log("dada",user);
      if(user != null)
      {
        console.log("vao day sau",user);
        setMembers([
          ...members,
          {
            uid: user,
            username: newMemberEmail,
          },
        ]);
        setNewMemberEmail('');
        setIsConfirmed(false);
      }
      else{
        Alert.alert("sasi raaj khong tim thay")
      }
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfirm = () => {
   
      console.log("vo addd ne");
      handleAddMember(); // Otherwise add member to the group
  };

  const handleRemoveMember = async (memberEmail) => {
    try {
      console.log("damdada",members);
      console.log("dada",memberEmail);
      // const user = await getUserByEmail(memberEmail);
      // await removeMemberFromGroup(chatId, user);
      setIsConfirmed(false);
      setMembers(prevMembers => prevMembers.filter(m => m.username !== memberEmail.username)); 
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      // await deleteGroup(chatId);
      setChatId(null);
      setGroupName('');
      setMembers([]);
      setConfirmedMembers([]); // Clear confirmed members on group deletion
      setIsConfirmed(true); // Reset confirmation state
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCreateGroup = async () => {
    // Example of creating a group, uncomment and adjust according to your needs
    const id = await createGroup(groupName, userId, [{uid: userId, user: dlUser[0].username}], dlUser[0].username);
    console.log("sasa", members);
  
    for (const m of members) {
      console.log("member", m.uid, m.username);
      // Assuming addMemberToGroup needs chatId, user, and email
      await addMemberToGroup(id, m.uid, m.username);
    }
    navigation.navigate('GroupChatScreen', { groupId: id, userId: userId, name: groupName });

  };
      
    


  return (
    <View style={styles.container}>
      {isConfirmed === true ? (
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <Button title="Create Group" onPress={handleCreateNameGroup} />
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.groupTitle}>Group: {groupName}</Text>
          <TextInput
            style={styles.input}
            placeholder="New Member Email"
            value={newMemberEmail}
            onChangeText={setNewMemberEmail}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.touchableButton} onPress={handleConfirm}>
              <Text style={styles.touchableText}>Add Member</Text>
            </TouchableOpacity>
            {!isConfirmed && (
              <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={styles.touchableButton} onPress={handleDeleteGroup}>
                  <Text style={styles.touchableText}>Delete Group</Text>
                </TouchableOpacity>
                {
                  members.length > 2 && <TouchableOpacity style={styles.touchableButton} onPress={handleCreateGroup}>
                  <Text style={styles.touchableText}>Confirm Group</Text>
                </TouchableOpacity>
                }
             </View>
            )}
          </View>

          {/* Display confirmed members */}
          {!isConfirmed && (
  <View style={styles.section}>
    <Text style={styles.groupTitle}>Confirmed Members:</Text>
    <FlatList
      data={members}
      
      keyExtractor={(item) => item.uid} // Use uid as the key
      renderItem={({ item }) => (
        <View style={styles.memberContainer}>
          <Text style={styles.memberText}>{item.username}</Text>
          {item.username !== dlUser[0].username && 
            <Button title="Remove" onPress={() => handleRemoveMember(item)} />
          }
        </View>
      )}
    />
  </View>
)}
                    

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 2,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memberText: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin:10,
  },
  touchableButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 1,
    marginHorizontal:5,
    borderRadius: 5,
  },
  touchableText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default GroupChat;
