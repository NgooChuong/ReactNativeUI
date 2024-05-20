import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet,TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import color from '../../style/color';
import { useNavigation, useRoute } from '@react-navigation/native';
import { pofile, userJson } from '../../data/data';
import moment from 'moment';
import {  FontAwesome } from '@expo/vector-icons';
import APIs, { endpoints } from '../../config/APIs';
import Mycontext from '../../config/Mycontext';
  const { name, posts } = userJson;

  const PhotosRoutes = ({posts,navigation}) => {
    const {username,posts_current_user}  = posts;
    return(
      <ScrollView style={{ flex: 1, paddingHorizontal: 1 }}horizontal={true} showsHorizontalScrollIndicator={false}>
      {posts_current_user.map((user, index) => (
        
        <TouchableOpacity style={{ margin: 1, backgroundColor: color.white, padding:3, borderWidth: 1, borderColor: 'black', borderRadius: 10}} key={index} onPress={() => {navigation.navigate('PostDetail',{'place_id':user.id, "naviName": 'PostScreen'})}}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1 }}>
            <Image
              source={{ uri: user.user.avatar }}
              style={{ width: 30, height: 30, borderRadius: 15}}
            />
            <View>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 14 }}>{user.user.username}</Text>
              <Text style={{ color: 'gray', fontSize: 12 }}>{moment(user.created_date).fromNow()}</Text>
            </View>
            
          </View>
          <View
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 12,
                  overflow: 'hidden',
                  width:300,
                  height:300,
                  margin:10
                }}
              >
                <Image
                  key={index}
                  source={{ uri:  user.pic[0].picture}}
                  style={{ width: "100%", height: "80%", borderRadius: 12 }}
                />                  
                <Text 
                      style={{   fontSize: 16, lineHeight: 24,
                        marginLeft:-10,marginRight:-10, color: color.primary,textAlign:"center" }}>
                      {user.title}
                    </Text>
                    <Text 
                      style={{ lineHeight: 24,
                        marginLeft:2, color: "red", fontSize: 14 }}>
                      {user.avgRate}
                      <FontAwesome name="star" size={15} color={color.secondary} />
                    </Text>
              </View>
             
        </TouchableOpacity>
      ))}
    </ScrollView>
    )
    
  };
const PostScreen = ({navigation}) => {
    const route = useRoute();
    const formData = route.params?.formData; // Sử dụng optional chaining để kiểm tra tồn tại của route.params
    const dlUser= useContext(Mycontext)
    const [posts, setPosts] = useState()
    const loadUserPosts = async() => {
      try {
        let res = await APIs.get(endpoints['user'](dlUser[0].id))
        setPosts(res.data);
        } catch (ex) {
            console.error(ex);
            return;
        }
  }
    useEffect(() => {
      loadUserPosts()
    }, [formData])
    // const navigation = useNavigation();




    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://th.bing.com/th/id/OIP.0JITmpedQwHPZWj00eGiqwHaE7?rs=1&pid=ImgDetMain' }}
            style={styles.image}
          />
          <Text style={styles.text}>sharejourney</Text>
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={()=>navigation.navigate("PostForm")}>
            <Text style={styles.submitButtonText}>Bạn muốn share hành trình</Text>
          </TouchableOpacity>
        </View>
        <View style={{...styles.formContainer,padding:1,marginTop:50}}>
          <Text style={{...styles.text,marginTop:1}}>Các bài viết:</Text>
          {posts== undefined? <ActivityIndicator/>:<PhotosRoutes posts = {posts} navigation={navigation}></PhotosRoutes>}
        </View>
      </ScrollView>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:30
    },
    imageContainer: {
      flexDirection:"row",
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 50, // Half of the width and height to make it a circle
    },
    text: {
      marginTop:20,
    //  / marginLeft: 10, // Adjust this value to position the text as needed
      fontSize: 20,
      color:color.primary
    },
    formContainer: {
      width: '100%',
      backgroundColor: '#f2f2f2', // Light gray background color for the form
      padding: 30,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      margin:5,

    },
    formContainer2: {
     backgroundColor: '#f2f2f2', // Light gray background color for the form
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
      margin:5,

    },
    
    submitButton: {
      backgroundColor:"white",
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 20,
    },
    submitButtonText: {
      color: 'black',
      fontSize: 16,
      textAlign:"center"
    },
  });

  export default PostScreen