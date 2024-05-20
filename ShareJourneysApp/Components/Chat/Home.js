import { View, Text, Image , Pressable, TextInput, TouchableOpacity, ViewBase, FlatList, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { authentication, db } from '../../firebase/firebaseconf'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Mycontext from '../../config/Mycontext';
import { ListItem } from './Listitem';


const Home = ({ navigation }) => {
  const dlUser= useContext(Mycontext)
  console.log(dlUser);
  const [users, setUsers] = useState([]);
  const getUsers =  () => {
    const docsRef = collection(db, 'users');
    const q =  query(docsRef, where('userUID', '!=', authentication?.currentUser?.uid ));
    const docsSnap = onSnapshot(q, (onSnap) => {
      let data = [];
      onSnap.docs.forEach(user => {
        data.push({...user.data()})
        setUsers(data)
        console.log(user.data())
        
      })
    })
  }
  useEffect(() => {
    getUsers();
  },[])
    
    return (
      <View style={{ marginVertical: 22 }}>
        <FlatList
            data={users}
            key={user => user.username}
            renderItem={({item}) => 
            <ListItem 
            onPress={() => navigation.navigate('Chat', {name:item.username, uid:item.userUID})}
            title={item.username}
            subTitle={item.email}
            image={item.avaterUrl}
            />
          }
        />
        
      </View>
      
    );
  }
  
  export default Home;