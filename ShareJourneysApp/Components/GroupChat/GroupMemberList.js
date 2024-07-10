import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity,Image, TextInput, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { changeAvatar, changeName, getGroupMembers, removeMemberFromGroup, uploadImage } from './InitGroup'; // Import removeMemberFromGroup function
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import * as ImagePicker from "expo-image-picker";

const GroupMemberList = ({ navigation,route }) => {
  const { groupId,userId ,avatar,name} = route.params;
  const [selectedImage, setSelectedImage] = useState(avatar);
  const [nameChange, setNameChange] = useState(name);
  const [input, setInputText] = useState(false);
  const [members, setMembers] = useState([]);
  const [isCreator, setIsCreator] = useState(false); // State to track if the current user is the creator
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const groupMembers = await getGroupMembers(groupId);
        console.log("dasdda",groupMembers)
        setMembers(groupMembers.memberData);
        const groupCreatorId = groupMembers.memberData[0].uid;
        console.log('dawdawda',groupCreatorId)
        console.log('djapndmpawod',userId == groupCreatorId)

        // Check if the current user is the creator of the group
        setIsCreator(userId == groupCreatorId);
      } catch (error) {
        console.error('Error fetching members: ', error);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleRemoveMember = async (memberId) => {
    try {

      await removeMemberFromGroup(groupId, memberId);
      console.log('member',members)
      setMembers(members.filter(m => m.uid !== memberId));
    } catch (error) {
      console.error('Error removing member: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberText}>{item.user}</Text>
      {isCreator && (
        <TouchableOpacity onPress={() => handleRemoveMember(item.uid)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
  
    if (!result.canceled) {
      const imageUrl = await uploadImage(result.assets[0].uri);
      await changeAvatar(groupId, imageUrl)
      setSelectedImage(imageUrl)
      Alert.alert('Thay đổi thành công');
    }
    
  };

  const handleTextSubmit = async () => {
      await changeName(groupId,nameChange);
      Alert.alert('Thay đổi thành công');
  };


  return (
    <View style={styles.container}>
      <View style={{width:'100%',height:50,position:'relative',marginTop:20}}>
        <TouchableOpacity
        style={
              styles.touchableOpacityGoBack

        }
        onPress={() =>{
          navigation.navigate('GroupChatScreen1', {
            groupId: groupId,
            userId: userId,
            name: nameChange,
          })
        }}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
          </View >
      <View>
      <View
            style={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleImageSelection}>
              <Image
                source={{ uri:  selectedImage}}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              />
  
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 10,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
           <View style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 22,
            marginLeft:10,
            flexDirection: "row",
            borderBottomWidth:0.5,
            borderBottomColor: COLORS.black,
            padding:10
 
           }}>
                <TextInput
                  value={nameChange}
                  onChangeText={(value) => setNameChange(value)}
                  editable={input}
                  style={{fontSize:20, color:COLORS.black}}
                  onSubmitEditing={handleTextSubmit} // Bắt sự kiện nhấn nút tick
                  returnKeyType="done" // Điều chỉnh loại nút trên bàn phím (done, go, search, send, etc.)
                />                
                <TouchableOpacity onPress={()=>setInputText(!input)}>
                  <MaterialIcons
                    name="edit"
                    size={25}
                    color={input?COLORS.carrot:COLORS.black}
                  />
                </TouchableOpacity>
            </View>       
      </View>

      <Text style={styles.memberTextTitle}>Number of members: {members.length}</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.uid}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberText: {
    fontSize: 16,
  },
  memberTextTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: 'green',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
  },
});

export default GroupMemberList;
