import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet ,ImageBackground,TouchableOpacity,Image, Alert} from 'react-native';
import { COLORS} from '../../constants';
import { MaterialIcons } from "@expo/vector-icons";
import APIs, { endpoints } from '../../config/APIs';
import Mycontext from '../../config/Mycontext';

const FixedButton = ({ setcompanion,userPost,id_post,companions}) => {
    const [visible, setVisible] = useState(false);
    const [del, setDel ] = useState(false);
    const dlUser= useContext(Mycontext)

    const delCompanion = async (id_user_companion) => {
      try {
          console.log('LOADCOMPANION');
          console.log(typeof id_user_companion);
  
          // Đảm bảo rằng id_user_companion đã được định nghĩa và không rỗng
          if (id_user_companion) {
              let res = await APIs.delete(endpoints['deleteCompanion'](id_post), {
                data: { idUser: id_user_companion }
            });

          } else {
              console.error('id_user_companion is undefined or empty');
          }
      } catch (ex) {
          console.error(ex);
      }
  }
    // useEffect(()=>{
    //   loadCompanion();
    // },[id_post])

    const deleteCompanion =  (id_user_copmanion) =>{
      if (dlUser[0].id == userPost.id){
        console.log(id_user_copmanion)
        delCompanion(id_user_copmanion)
        setcompanion(companions)
      }
      else{
        Alert.alert('Bạn không được xóa')
      }
    }
    
    return (
      <>
      <View style={styles.fixedButton}>
        <TouchableOpacity
          onPress={() => console.log('Nhấn nút')}
        >
          <MaterialIcons  name="wechat" size={40} color={COLORS.black}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVisible(!visible)}
        >
          <MaterialIcons  name="supervised-user-circle" size={40} color={COLORS.black}/>
        </TouchableOpacity>

      </View>
      {visible && 
        <View style={styles.messageBox}>
          {companions.map((companion)=>
            <View style={styles.container} key={companion.id}>
              <Image source={{ uri:companion.avatar}} style={styles.imageBackground} resizeMode="cover"/>
              <TouchableOpacity style={styles.closeButton} onPress={()=>{deleteCompanion(companion.id)}}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text>{companion.username}</Text>
            </View>
          )}

          
      </View>
      }
      </>
    );
    
};

const styles = StyleSheet.create({
    fixedButton: {
      position: 'absolute',
      top: '70%',
      right: 20,
      width: 50,
      height: 50,
      borderRadius:50,
      alignItems: 'center',
      justifyContent:'center',
      elevation:5,
      width:'auto',
      height:'auto',
      flexDirection: 'column',
      padding:10
    },
    messageBox: {
      flexDirection: 'row',
      backgroundColor: '#EDEDED', // Màu nền của tin nhắn
      borderRadius: 10, // Độ cong của góc
      borderWidth: 1, // Độ dày của đường viền
      borderColor: '#CCCCCC', // Màu của đường viền
      padding: 10, // Khoảng cách giữa nội dung và viền
      width: '80%', // Chiều rộng của tin nhắn
      alignSelf: 'center', // Canh giữa theo chiều ngang
      marginVertical: 10, // Khoảng cách giữa các tin nhắn
      position: 'absolute', //
      top: '76%',
      right: 100,
      width:"auto",
      height:90,
    },
    container: {
      width: 50, // Chiều rộng của hình tròn
      height: 50, // Chiều cao của hình tròn
      borderRadius: 75, // Bán kính của hình tròn (nửa chiều rộng)
      marginRight:10,
    },
    imageBackground: {
      width:'100%',
      height:'100%',
      borderRadius: 50
    },
    closeButton: {
      position: 'absolute', // Đảm bảo nút "x" được đặt trên cùng
      top: 0, // Khoảng cách từ nút "x" đến đỉnh
      right: 0, // Khoảng cách từ nút "x" đến phải
      width: 20, // Chiều rộng của nút "x"
      height:20, // Chiều cao của nút "x"
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền của nút "x"
      borderRadius: 15, // Độ cong của góc nút "x" để tạo thành hình tròn
      justifyContent: 'center', // Căn giữa theo chiều dọc
      alignItems: 'center', // Căn giữa theo chiều ngang

    },
    closeButtonText: {
      color: 'white', // Màu chữ của nút "x"
      fontSize: 10 // Kích thước chữ của nút "x"
    },
  });


export default FixedButton;
