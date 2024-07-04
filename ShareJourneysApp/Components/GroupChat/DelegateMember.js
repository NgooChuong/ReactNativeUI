import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changeCreator } from './InitGroup';

const DelegateMember = ({ visible, onClose,groupId,handleRemoveMember,members,userId}) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMem, setSelectedMem] = useState(null);



//   const filteredContacts = members.memberData.filter(contact =>
//     contact.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );


  const handleSelectMem = (item) => {
    setSelectedMem(item);
  };

  const handleConfirm =async () => {
    if(selectedMem){
         changeCreator(groupId,selectedMem.uid,selectedMem.user)
         handleRemoveMember();
    }
  }
  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() => handleSelectMem(item)}
      >
        <Ionicons
          name={selectedMem === item ? "radio-button-on" : "radio-button-off"}
          size={24}
          color="black"
        />
        <Text style={styles.contactName}>{item.user}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
        <Text style={{fontSize:20, marginBottom:10}}>Chọn thành viên làm nhóm trưởng</Text>
          <FlatList
            data={members.memberData?.filter(member => member.uid!= userId)}
            keyExtractor={item => item.uid}
            renderItem={renderContact}
          />
          <View style={{flexDirection:'row', justifyContent:'space-around'}}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.SubmitButton}>
                <Text style={styles.closeButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  groupNameInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contactName: {
    marginLeft: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  SubmitButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DelegateMember;
