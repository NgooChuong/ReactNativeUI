import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, InputToolbar, Send, Avatar, Time } from 'react-native-gifted-chat';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp ,deleteDoc, where, getDocs } from 'firebase/firestore';
import { authentication, db, storage } from '../../firebase/firebaseconf';
import { Ionicons } from '@expo/vector-icons'; // Bạn cần cài đặt thư viện @expo/vector-icons nếu chưa cài đặt
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';

const Chat = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image URL
  const [showAction, setShowAction] = useState(true); // State để quản lý việc hiển thị action button
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(null);
  const [add, setAdd] = useState([]);
  
  console.log('ben chat',route.params)
  const  uid  = route.params.uid
  const  username  = route.params.name
  const  avatar  = route.params.avatar
  const  avatarRec  = route.params.avatarRec
  const  name  = route.params.username

console.log(uid,username, avatar)

  const ReturnChatId = () =>{
    const chatID = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`
    console.log('Chat Id',chatID)
    return chatID
  };

  const currentUser = authentication?.currentUser?.uid;
  // truy van lay du lieu ma da tuong tac voi nhau 
  useEffect(() => {
    const chatId = ReturnChatId();
    const docref = doc(db, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const q = query(colRef, orderBy('createdAt',"desc"));
    const unsubcribe = onSnapshot(q, (onSnap) => {
      const allMsg = onSnap.docs.map(mes => {
        if(mes.data().createdAt){
          return{
            ...mes.data(),
            createdAt:mes.data().createdAt.toDate()
          }
        }else{
          return{
            ...mes.data(),
            createdAt:new Date()
          }
        }
        

      })
      setMessages(allMsg)

    })

      return () => {
        unsubcribe()
      }
  },[showDeleteButton])
// Gui tin nhan cua nguoi dang nhap vao gui toi uid nguoi nhan duoc
  const onSend = useCallback((messagesArray) => {
    const msg = messagesArray[0];
    // console.log(myMsg)
    const myMsg = {
      ...msg,
      sentBy:currentUser,
      sentTo:uid,
      createdAt: new Date(),
    }
 // Add image URL if there's a selected image
    if (selectedImage) {
      myMsg.image = selectedImage;
      setSelectedImage(null); // Clear the selected image after sending
    }


    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
    const chatId =ReturnChatId();


    const docref = doc(db, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const chatSnap = addDoc(colRef, {
      ...myMsg,
      createdAt:serverTimestamp(),
    })

  }, [selectedImage, currentUser, uid])
  
  const uploadImage = async (uri) => {
    try {
      const storageRef = ref(storage, `images/${Date.now()}.jpg`);
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Handle progress, if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error('Error uploading image:', error);
            reject(error);
          },
          () => {
            // Handle successful uploads on completion
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            }).catch((error) => {
              console.error('Error getting download URL:', error);
              reject(error);
            });
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert("Permission Denied!", "You need to grant permission to access the library.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImage(result.assets[0].uri);
      console.log("imageUrl", imageUrl);

      // Create a temporary message with the selected image
      const imageMessage = {
        _id: new Date().getTime(),
        image: imageUrl,
        createdAt: new Date(),
        user: {
          _id: currentUser,
        },
      };

      // Send the image message directly
      onSend([imageMessage]);
    }
  };

    // Custom renderMessageImage to style the image message
    const renderMessageImage = (props) => {
      return (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: props.currentMessage.image }}
          />
        </View>
      );
    };

    useEffect(() => {
      const messageIds = messages.map(message => message._id);
      setAdd(messageIds);
    }, [messages]);

    const handleLongPress = useCallback((context, message) => {
      console.log("messsssdafga",message);
      console.log("messsss",message.currentMessage._id);
      setShowDeleteButton(message.currentMessage._id);
    }, []);

    const deleteMessage = async (messageId) => {
        try {
          const chatId = ReturnChatId()
          // Tạo tham chiếu đến collection messages trong chatroom cụ thể
          const messagesRef = collection(db, 'chatrooms', chatId, 'messages');
          
          // Truy vấn document dựa trên field `_id`
          const q = query(messagesRef, where('_id', '==', messageId));
          const querySnapshot = await getDocs(q);
      
          // Xóa document đầu tiên tìm được
          if (!querySnapshot.empty) {
            const docToDelete = querySnapshot.docs[0];
            await deleteDoc(docToDelete.ref);
            console.log(`Deleted message with _id: ${messageId} in chatroom: ${chatId}`);
          } else {
            console.log(`No message found with _id: ${messageId}`);
          }
        } catch (error) {
          console.error('Error deleting message: ', error);
        }
      
    };

    const handleDeleteMessage = useCallback((messageId) => {
      console.log(`Deleting message with id: ${messageId}`);
      deleteMessage(messageId)
      // Add your delete message logic here
    }, []);
  
    useEffect(() => {
      
    }, [showDeleteButton]);
    const renderBubble = ((props) => {
      console.log("dafafafadsddsdsdada",props.currentMessage._id,showDeleteButton)
      const isInArray = add.includes(showDeleteButton);
      console.log(isInArray);
      return (
        <View>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: props.currentMessage.image ? 'transparent' : '#0084ff',
              },
              left: {
                backgroundColor: props.currentMessage.image ? 'transparent' : '#f0f0f0',
              },
            }}
            renderMessageImage={renderMessageImage}
            renderTime={() => (
              <Time
                {...props}
                timeTextStyle={{
                  right: {
                    color: props.currentMessage.image ? '#000' : '#000',
                  },
                  left: {
                    color: props.currentMessage.image ? '#000' : '#000',
                  },
                }}
              />
            )}
            onLongPress={(context) => handleLongPress(context, props)}
          />
          { isInArray && props.currentMessage._id===showDeleteButton&& (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteMessage(props.currentMessage._id)}
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      );
    });

 
   
    const renderActions = (props) => {
      if (showAction) {
        return (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                marginLeft: 5,
                marginBottom: 5,
              }}
            >
              <Ionicons name="camera" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                marginLeft: 5,
                marginBottom: 5,
              }}
            >
              <Ionicons name="happy" size={30} color="black" />
            </TouchableOpacity>
          </View>
        );
      }
      return null;
    };
    const handleEmojiSelect = (emoji) => {
      setInputText((prevText) => prevText + emoji);
      setShowEmojiPicker(false);
    };
  
    const renderInputToolbar = (props) => (
      <InputToolbar
        {...props}
        renderActions={renderActions}
        text={inputText}
        onTextChanged={(text) => setInputText(text)}
      />
    );


  return (
    


    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() =>navigation.goBack()} style ={{...styles.callButton,backgroundColor:'#fff',marginRight:10}} >
          <Ionicons name="chevron-back" size={20} color="#000" />
      </TouchableOpacity>
        <Image
          source={{ uri: avatarRec }} // Thay thế bằng URL avatar của người trò chuyện
          style={styles.avatar}
        />
        <Text style={styles.headerText}>{name}</Text>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <GiftedChat
      messages={messages}
      onSend={text => onSend(text)}
      placeholder='Nhập tin nhắn'
      user={{
        _id: currentUser,
        name: username,
        avatar: avatar,
       
      }}
      renderInputToolbar={renderInputToolbar}
      text={inputText}
    onInputTextChanged={(text) => setInputText(text)}
      renderBubble={renderBubble}
      renderMessageImage={renderMessageImage}
      renderActions={renderActions}
      onLongPress={handleLongPress}
    />
    {showEmojiPicker && (
          <EmojiSelector
            category={Categories.all}
            onEmojiSelected={handleEmojiSelect}
            showSearchBar={false}
            showSectionTitles={false}
          />
        )}
    </SafeAreaView>
    

  )
}
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: `${(((height/100 - 0.95)*100)/height)*100}%`,
    position:'relative',
    zIndex: 0,
    marginTop:30,
  },
  header: {
    height: '10%',
    width: '100%',
    backgroundColor: '#0084FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position:'relative',
    top:0,
    zIndex:999,
    
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: {
    borderRadius: 0,
    padding: 2,
    backgroundColor: 'transparent',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 35,
    left: 1 ,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 150,
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 5,
  },
});

export default Chat;