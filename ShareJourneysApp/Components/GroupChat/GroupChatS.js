import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Alert, StyleSheet, KeyboardAvoidingView, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, Image, Dimensions } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { sendGroupMessage, listenGroupMessages, getGroupMembers, removeMemberFromGroup, getGroupCreator } from './InitGroup';
import Mycontext from '../../config/Mycontext';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, deleteDoc } from "firebase/firestore"; // Import Firestore functions
import { authentication, db } from '../../firebase/firebaseconf';
import AddMenberGr from './ModalAddMember';
import { getUserByEmail } from './InitGroup';
import DelegateMember from './DelegateMember';

const GroupChatScreen = ({ route, navigation }) => {
  const { groupId, userId, name } = route.params;
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const dlUser = useContext(Mycontext);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupCreatorId, setGroupCreatorId] = useState(null); // State to store group creator ID
  const [modalVisibleMem, setModalVisibleMem] = useState(false);
  const [modalVisibleDelegate, setModalVisibleDelegate] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);
  // const closeModal = () => setModalVisible(false);

  const handleAddMember = () => {
    // Implement logic to add member to group
    setModalVisibleMem(true);
    closeModal();
  };
  const handleCloseModal = () => {
    // Implement logic to add member to group
    if (modalVisibleMem==true){
      setModalVisibleMem(false);
    }
    if (modalVisibleDelegate==true){
      setModalVisibleDelegate(false);
    }
  };
  const handleDelegate = () => {
    // Implement logic to delegate group
    setModalVisibleDelegate(true);
    toggleModal();
  };
  const handleDeleteGroup = async () => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const creatorId = groupData.creator;

        if (creatorId === userId) {
          await deleteDoc(groupRef);
          console.log("Group deleted successfully");
          closeModal();
          navigation.goBack(); // Go back to the previous screen after deletion
        } else {
          console.log("You are not authorized to delete this group");
          alert("You are not authorized to delete this group");
        }
      } else {
        console.log("Group document does not exist");
      }
    } catch (error) {
      console.error("Error deleting group: ", error);
    }
  };

  const handleRemoveMember = async () => {
    try {
      const user = await getUserByEmail(dlUser[0].username);
      await removeMemberFromGroup(groupId, user);
      navigation.navigate('HomeChat')
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = listenGroupMessages(groupId, (newMessages) => {
      console.log(newMessages)
      setMessages(newMessages);
    });
    console.log("Gdahdoiahodhaohfoiahofhoiahfoih")
    loadMembers();
    fetchGroupCreator(); // Fetch group creator ID

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadMembers = async () => {
    try {
      const groupMembers = await getGroupMembers(groupId);
      setMembers(groupMembers);
    } catch (error) {
      console.error('Error loading members:', error.message);
    }
  };

  const fetchGroupCreator = async () => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        setGroupCreatorId(groupData.creator); // Set group creator ID state
      } else {
        console.log("Group document does not exist");
      }
    } catch (error) {
      console.error("Error fetching group creator:", error);
    }
  };

  const handleSendMessage = async (newMessages) => {
    try {
      const message = newMessages[0]; // Assuming GiftedChat sends an array of messages
      await sendGroupMessage(groupId, userId, message.text, dlUser[0].username, dlUser[0].avatar);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };


  // const renderActions = () => {
  //   return (
  //     <Button title="Add Member" onPress={handleAddMember} />
  //   );
  // };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeChat')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: members.avatar }}
            style={styles.profileImage}
          />
          <View style={{ flexDirection: "column", margin: 14 }}>
            <Text style={styles.nameText}>{name}</Text>
            <TouchableOpacity onPress={{}} style={styles.memberButton}>
              <Ionicons name="person" size={20} color="black" style={styles.modalIcon} />
              <Text style={styles.memberText}>Members: {members.memberCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleModal} style={styles.actionButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.messageContainer}>
        <GiftedChat
          messages={messages}
          onSend={handleSendMessage}
          user={{ _id: userId }}
        />
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() =>{
             navigation.navigate('GroupMemberList', { groupId,userId,avatar:members.avatar,name:members.name })
             toggleModal()
            }
             } style={styles.modalItem}>
            <Ionicons name="list" size={20} color="black" style={styles.modalIcon} />
            <Text>View Group Members</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddMember} style={styles.modalItem}>
            <Ionicons name="person-add" size={20} color="black" style={styles.modalIcon} />
            <Text>Add Member</Text>
          </TouchableOpacity>
         {
           authentication?.currentUser?.uid != groupCreatorId?  
           <TouchableOpacity onPress={handleRemoveMember} style={styles.modalItem}>
           <Ionicons name="exit" size={20} color="black" style={styles.modalIcon} />
           <Text>Leave Group</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={handleDelegate} style={styles.modalItem}>
            <Ionicons name="exit" size={20} color="black" style={styles.modalIcon} />
            <Text>Leave Group</Text>
            </TouchableOpacity>
         }
         

          {groupCreatorId === userId && (
            <TouchableOpacity onPress={handleDeleteGroup} style={styles.modalItem}>
              <Ionicons name="trash" size={20} color="black" style={styles.modalIcon} />
              <Text>Delete Group</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
              <AddMenberGr visible = {modalVisibleMem} onClose={handleCloseModal} chatId = {groupId} mem = {members.memberData}/>
              <DelegateMember 
                visible = {modalVisibleDelegate} 
                onClose={handleCloseModal} 
                handleRemoveMember={handleRemoveMember}
                members={members}
                groupId={groupId}
                userId={userId}
              />
    </KeyboardAvoidingView>
  );
};
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: `${(((height/100 - 0.95)*100)/height)*100}%`,
    position:'relative',
    zIndex: 0,
    marginTop:30,
  },
  messageContainer: {
    flex: 1,
    marginTop: 100, // Same as header height to avoid overlap
    backgroundColor: '#f5f5f5', // Background color for the message area
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  actionButton: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalIcon: {
    marginRight: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust as needed
    backgroundColor: 'white',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 20, // For status bar padding, adjust as needed
  },
  backButton: {
    marginRight: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    fontSize: 20,
    color: 'green',
  },
  memberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    marginLeft: 1,
  },
});

export default GroupChatScreen;
