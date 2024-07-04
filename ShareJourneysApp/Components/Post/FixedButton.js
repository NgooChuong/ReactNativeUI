import React, { memo, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet ,ScrollView,TouchableOpacity,Image, Alert,Modal, ActivityIndicator,RefreshControl} from 'react-native';
import { COLORS, SIZES} from '../../constants';
import { MaterialIcons } from "@expo/vector-icons";
import APIs, { endpoints } from '../../config/APIs';
import Mycontext from '../../config/Mycontext';
import { authentication, db } from '../../firebase/firebaseconf';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, query, where, getDoc, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import {getUserRoute} from '../CallAPI/Load';
import { Searchbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';


const FixedButton = ({ Journey,navigation,setcompanion,userPost,id_post,companions}) => {
    // const [visible, setVisible] = useState(false);
    const [userRoute, setUserRoute ] = useState([]);
    const dlUser= useContext(Mycontext)
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [local, setLocal] = useState();
    const [pickerLocalCome, setPickerLocalCome] = useState('')
    const [pickerLocalArrive, setPickerLocalArrive] = useState('')
    const mapLocal = () =>{
      const journey = Journey;
      const id_noiDi = journey.id_tuyenDuong.id_noiDi;
      const id_noiDen = journey.id_tuyenDuong.id_noiDen;
      
      const result = journey.stoplocal.map(stop => ({
          id_DiaDiem: stop.id_DiaDiem.id,
          diaChi: stop.id_DiaDiem.diaChi
      }));
      
      // Add id_noiDi and id_noiDen to the result
      result.push({
          id_DiaDiem: id_noiDi.id,
          diaChi: id_noiDi.diaChi
      });
      result.push({
          id_DiaDiem: id_noiDen.id,
          diaChi: id_noiDen.diaChi
      });
      
      // Sort the result by id_DiaDiem if needed
      result.sort((a, b) => a.id_DiaDiem - b.id_DiaDiem);
      
      console.log(result);
      setLocal(result);
    }
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
    const deleteCompanion =  (id_user_copmanion) =>{
      if (dlUser[0].id == userPost.id){
        console.log(id_user_copmanion)
        delCompanion(id_user_copmanion)
        setPage(1);
        setcompanion(companions)
        
      }
      else{
        Alert.alert('Bạn không được xóa')
      }
    }
    const getCOl = async (querydoc, col ) =>{
      getDocs(querydoc).then((querySnapshot) => {
        if (!querySnapshot.empty) { // Kiểm tra xem kết quả truy vấn có tài liệu nào không
          console.log('cawca',querySnapshot.docs[0])
          
          console.log('cawca',querySnapshot.docs[0].data())
          const firstDoc = querySnapshot.docs[0]; // Lấy tài liệu đầu tiên từ kết quả truy vấn
          const firstDocId = firstDoc.id; // Lấy ID của tài liệu đầu tiên
          const docRef = doc(db,col, firstDoc.id);
          setDoc(docRef,firstDoc.data())
          console.log('dfadaw',firstDoc.data())
          if (col == dlUser[0].username)
            return navigation.navigate('Chat', {
              avatar: dlUser[0].avatar,
              name:dlUser[0].username, uid:firstDoc.id,
              username:firstDoc.data().username,
              avatarRec:firstDoc.data().avatarUrl,
            })

        } else {
          console.log("Không có người dùng phù hợp với điều kiện.");
        }
      }).catch((error) => {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      });
    }
    const chat = async () => {
      const condition1 = where('username', '==', userPost.username); // Ví dụ: Lọc ra người dùng có userType là 'normal'
      const condition2 = where('username', '==',dlUser[0].username); // Ví dụ: Lọc ra người dùng có userType là 'normal'
      const usersCollectionRef = collection(db, userPost.username);
      const collectionUserPost = query(usersCollectionRef, condition1);
      const curUser = collection(db, dlUser[0].username);
      const collectionUserAuth = query(curUser, condition2);
      await getCOl(collectionUserAuth,userPost.username)
      await getCOl(collectionUserPost,dlUser[0].username)
  }

    const loadUserRoute = async () =>{
     if (page > 0) {
        console.log('Loading user route')
        try {
            setLoading(true);
            let res = await getUserRoute(id_post,page,searchQuery,pickerLocalCome,pickerLocalArrive)
            if (page === 1){
                 console.log('page1')
              setUserRoute(res.data.results);
            }
           
            else if (page > 1)
              setUserRoute(current => {
                    return [...current, ...res.data.results]
                });
            if (res.data.next === null)
                setPage(0);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }
    }
    useEffect(()=>{
      loadUserRoute()

      console.log('abc')
    },[page])

    useEffect(()=>{
          setPage(1);
    },[searchQuery,modalVisible,pickerLocalArrive,pickerLocalCome]) //

    useEffect(()=>{
      mapLocal()
    },[])

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 20;
      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
  };

    const loadMore = ({nativeEvent}) => {
    if (loading===false  && page > 0 && isCloseToBottom(nativeEvent)) {
        setPage(page + 1);
    }
    }
    return (
      <>
      <View style={styles.fixedButton}>
        <TouchableOpacity
          onPress={() => chat()}
        >
          <MaterialIcons  name="wechat" size={40} color={COLORS.black}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons  name="supervised-user-circle" size={40} color={COLORS.black}/>
        </TouchableOpacity>



      </View>
        <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
         <TouchableOpacity style={styles.closeButtonModal} onPress={()=>setModalVisible(!modalVisible)}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Companions</Text>
        <View style= {styles.filter}>
          <Searchbar style={styles.title}
                placeholder="Search username..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                
              />    
        </View>
        {local==undefined? <ActivityIndicator/>:
        <View style={{width: '80%',marginLeft:'auto',marginRight:'auto', borderColor:'black', borderWidth:1, borderStyle:'solid',padding:10}}>
        <View style={{flexDirection:'row'}}>
                  <MaterialIcons name="share-location" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                  <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Địa điểm đi</Text>
          </View>   
        <RNPickerSelect 
                placeholder={{ label: 'Chọn địa điểm đi' }}
                onValueChange={(value) =>{setPickerLocalCome(value)}}
                items={local.filter((lc) => lc.id_DiaDiem !== pickerLocalArrive).map((lc) => (
                    {
                        value: lc.id_DiaDiem,
                        label: lc.diaChi,
                    }
                ))}
            />
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="share-location" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Địa điểm đến</Text>
            </View>   
        <RNPickerSelect 
                
                placeholder={{ label: 'Chọn địa điểm đến' }}
                onValueChange={(value) =>{setPickerLocalArrive(value)}}
                items={local.filter((lc) => lc.id_DiaDiem !== pickerLocalCome).map((lc) => (
                    {
                        value: lc.id_DiaDiem,
                        label: lc.diaChi,
                    }
                ))}
            />
        </View>
        } 
          <View style = {{...styles.lineDis,marginBottom: 10,marginTop: 10, }}/>
          <Text style={styles.mainTitle}>Danh sách người đi chung</Text>
          <ScrollView  style={{ flex: 1, paddingHorizontal: 1, marginTop: 20}} onScroll={loadMore}>
          <RefreshControl onRefresh={() => loadPosts()} />
          {loading && <ActivityIndicator/>}
            {userRoute==undefined? <ActivityIndicator/>:
            userRoute.map((companion,index)=>
              <View style= {styles.box} key={index}>
                <View style={{flexDirection:"column"}} >
                  <View style={styles.container}>
                    <Image source={{ uri:companion.Companion.user.avatar}} style={styles.imageBackground} resizeMode="cover"/>
                    <Text style={{marginLeft: 10,alignSelf:'center'}}>{companion.Companion.user.username}</Text>
                  </View>
                  <View style={styles.container}>
                    <Text style={{alignSelf:'center'}}> Điểm đón: {companion.diaChiDon.diaChi}</Text>
                    <View style={styles.line}></View>
                    <Text style={{alignSelf:'center'}}> Điểm dừng: {companion.diaChiDen.diaChi}</Text>
                  </View>
                </View>
                    <TouchableOpacity style={styles.closeButton} onPress={()=>{deleteCompanion(companion.Companion.user.id)}}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  
              </View>
              
            )}
          {loading && page > 1 && <ActivityIndicator/>}

          </ScrollView>
          {
            userPost.username == dlUser[0].username && 
            <TouchableOpacity style = {styles.button}
            onPress={()=> navigation.navigate('GroupChatInDetail',{'userRoute': userRoute})}
          >
            <Text style={{color:'white'}}>              
              Tạo group
            </Text>
          </TouchableOpacity>
          }
           
          
       </Modal>
    
      </>
    );
    
};

const styles = StyleSheet.create({
  button:{
    width: 100, 
    height: 40, 
    backgroundColor:COLORS.carrot, 
    alignItems:'center',
    justifyContent:'center',
    marginLeft:150,
    marginBottom:20,
    borderRadius: 5,
    //
  },
  lineDis:{
    width:'80%',
    height:3,
    backgroundColor: 'black',
    alignSelf:'center',
    // 
},
  title: {
    borderStyle:'solid',
     borderColor:'black', 
     borderWidth: 1,

   },
  filter:{
    width: '100%',
    padding: 10,
  },
  line:{
    width: 100,
    height: 1,
    backgroundColor: 'black',
    alignSelf:'center',
    marginLeft: 10,
    marginRight: 10,
    // 
},
  box:{
      width: '80%',
      height: 100,
     marginHorizontal:'10%', 
     flexDirection:'row',
     borderColor:'black',
     borderWidth:1,
     padding:10,
     marginBottom:10,
     borderRadius:5,
     marginTop:10,
    },
    mainTitle: {
      fontSize: SIZES.h1,
      fontWeight: 'bold',
      alignSelf:'center',
      marginTop: 20
    },
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
    closeButtonModal: {
      position: 'absolute',
      top: 10,
      right: 10,
      
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
      width: '100%', // Chiều rộng của hình tròn
      height: 50, // Chiều cao của hình tròn
      borderRadius: 75, // Bán kính của hình tròn (nửa chiều rộng)
      marginRight:10,
      flexDirection:'row'
    },
    imageBackground: {
      width:50,
      height:'100%',
      borderRadius: 50
    },
    closeButton: {
      position: 'absolute', // Đảm bảo nút "x" được đặt trên cùng
      top: -10, // Khoảng cách từ nút "x" đến đỉnh
      right: -10, // Khoảng cách từ nút "x" đến phải
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


export default memo(FixedButton);
