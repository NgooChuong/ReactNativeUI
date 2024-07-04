import React, { useContext, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { addMemberToGroup, createGroup, deleteGroup, getUserByEmail, removeMemberFromGroup } from './InitGroup';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Mycontext from '../../config/Mycontext';
import { authentication, db } from '../../firebase/firebaseconf'

const GroupChatInDetail = ({navigation, route }) => {
  const { userRoute } = route.params;
  const dlUser = useContext(Mycontext);
  const [groupName, setGroupName] = useState('');

  const handleCreateNameGroup = async () => {
    try {
      let uid_current = authentication?.currentUser?.uid;
      const id = await createGroup(groupName, uid_current, [{uid:uid_current,user:dlUser[0].username}], dlUser[0].username);
      userRoute.map((user) => {
        handleAddMember(id,user.Companion.user.username);
      })
      navigation.navigate('GroupChatScreen', { groupId: id, userId: uid_current, name: groupName });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddMember = async (id_chat,member) => {
    try {
      const user = await getUserByEmail(member);
      await addMemberToGroup(id_chat,user,member);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfirm = () => {
      console.log("vo neeeeee");
      handleCreateNameGroup(); // Call group creation if not confirmed

  };


  return (
    <View style={styles.container}>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <Button title="Create Group" onPress={handleConfirm} />
        </View>
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

export default GroupChatInDetail;
