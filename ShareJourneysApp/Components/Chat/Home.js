import { View, Text, Image , Pressable, TextInput, TouchableOpacity, ViewBase, FlatList, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { authentication, db } from '../../firebase/firebaseconf'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Mycontext from '../../config/Mycontext';
import { ListItem } from './Listitem';
import { MaterialIcons } from '@expo/vector-icons';


const Home = ({ navigation }) => {
  const dlUser= useContext(Mycontext)
  const [users, setUsers] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const getUsers =  () => {
    const docsRef = collection(db, dlUser[0].username);
    const q =  query(docsRef, where('userUID', '!=', authentication?.currentUser?.uid ));
    const docsSnap = onSnapshot(q, (onSnap) => {
      let data = [];
      onSnap.docs.forEach(user => {
        data.push({...user.data()})
        setUsers(data)        
      })
    })
  }
  useEffect(() => {
    getUsers();
    getGroupChats();
  },[])
  const getGroupChats = () => {
    // Tạo tham chiếu đến bộ sưu tập 'groups' trong Firestore
    const groupRef = collection(db, 'groups');
    
    // Lấy UID của người dùng hiện tại từ nguoi dung xác thực
    const userId = authentication?.currentUser?.uid;
  
    // Lắng nghe thay đổi trên bộ sưu tập 'groups'
    onSnapshot(groupRef, (querySnapshot) => {
      // Duyệt qua tất cả các tài liệu (documents) trong kết quả trả về
      const chats = querySnapshot.docs
        // Tạo một mảng mới chứa các đối tượng nhóm với ID của tài liệu
        .map(doc => ({ id: doc.id, ...doc.data() }))
        // Lọc các nhóm có thành viên chứa UID của người dùng hiện tại
        .filter(group => group.members.some(member => member.uid === userId));
      // Cập nhật state với các nhóm chat mới
      setGroupChats(chats);
    });
  };

    return (
      <>

       <View style={{ marginVertical: 22 }}>
       <TouchableOpacity style={{padding: 10, flexDirection:'row', justifyContent:'flex-end'}}
        onPress={() => navigation.navigate("GroupChat", { userId: authentication?.currentUser?.uid })}
>
        <MaterialIcons name="add-box" size={30} color="black" />
        <Text style={{fontSize:15, alignSelf:'center'}} >Tạo Nhóm</Text>
      </TouchableOpacity>
      <FlatList
          data={users}
          key={user => user.username}
          renderItem={({item}) => 
          <ListItem 
          onPress={() => navigation.navigate('Chat', 
                  {
                  name:dlUser[0].username, 
                  uid:item.userUID,
                  avatarRec:item.avatarUrl ,
                  avatar: dlUser[0].avatar,
                  username: item.username,
                }
                )}
          title={item.username}
          subTitle={item.email}
          image={item.avatarUrl}
          />
        }
      />
      <FlatList
        data={groupChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => navigation.navigate('GroupChatScreen', {groupId: item.id, userId:authentication?.currentUser?.uid,name:item.name})}
            title={item.name}
            subTitle={`Creator: ${item.creator_by}`}
            // Assuming you have an image URL or avatar for the group
          />
        )}
      />
    </View>
      </>
     
      
    );
  }
  
  export default Home;