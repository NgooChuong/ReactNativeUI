

import React, { useContext, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { addMemberToGroup, createGroup, deleteGroup, getUserByEmail, removeMemberFromGroup } from './InitGroup';
import { MaterialIcons } from '@expo/vector-icons';


const AddMenberGr = ({visible,onClose,chatId,mem}) => {
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  
  const handleAddMember = async () => {
    console.log("vo addd ne",mem.map(item => item.user));
    console.log("vo mem",members);

    try {
        if (!members.includes(newMemberEmail) && !mem.map(item => item.user).includes(newMemberEmail)) {
            const user = await getUserByEmail(newMemberEmail);
            await addMemberToGroup(chatId,user,newMemberEmail);
            console.log(members)
            setMembers([...members, newMemberEmail]);
            setNewMemberEmail('');
            setIsConfirmed(true);
        }
        else Alert.alert("Đã có thành viên trong group")
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const handleRemoveMember = async (memberEmail) => {
    try {
      const user = await getUserByEmail(memberEmail);
      await removeMemberFromGroup(chatId, user);
      setIsConfirmed(true);
      setMembers(members.filter(m => m !== memberEmail)); 
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const handleConfirm = () => {
    console.log("ISC",isConfirmed)
   
      console.log("vo addd ne");
      handleAddMember(); // Otherwise add member to the group
  };

  

  return (
    <Modal
      transparent={false}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
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
          </View>
          <FlatList
            data={members}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.memberContainer}>
                <Text style={styles.memberText}>{item}</Text>
                <Button title="Remove" onPress={() => handleRemoveMember(item)} />
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding:10
  },
  section: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  touchableButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  touchableText: {
    color: '#fff',
    fontSize: 16,
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberText: {
    fontSize: 16,
  },
});
export default AddMenberGr;
