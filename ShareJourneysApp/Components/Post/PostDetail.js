import React,{useState, useEffect} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SliderImage from './SliderImage';
import post from '../../data/postdetail';
import { COLORS} from '../../constants';
import PostOwner from './PostOwner';
import PostTitle from './PostTitle';
import PostJourney from './PostJourney';
import FixedButton from './FixedButton';
import PostComments from './PostComments';
import { Button } from 'react-native-paper';
import { MaterialIcons } from "@expo/vector-icons";
import APIs, { endpoints } from '../../config/APIs';
import Swiper from 'react-native-swiper';

const Dot = () => (
  <View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 }} />
);

const ActiveDot = () => (
  <View style={{ backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 }} />
);

const PostDetail = ({navigation,route}) =>{
    const {place_id} = route.params;
    console.log('helo',place_id);
    const [visible, setVisible] = useState(false);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [detail, setDetail] = useState({});
    const [companions, setcompanion] = useState();

    const loadDetailPost = async () =>{
      try{
        console.log('adwdaw')
        let res = await APIs.get(endpoints['posts'](place_id))
        console.log(res.data)
        console.log(res.data.pic)
        setDetail(res.data)
        }
        catch(ex)
        {
          console.error(ex);
        }
    }
    useEffect(()=>{
        loadDetailPost();
    },[place_id,companions])


    const handlePressReport = () => {
      setIsReportModalVisible(true);
    };
  
    const handlePressCloseReportModal = () => {
      setIsReportModalVisible(false);
    };
    const showModal = () =>{
        setVisible(true);
    } 
    // const images = detail.pic.map(picItem => picItem.picture);

    return (
        <SafeAreaView style = {{height: '100%'}}>
            <TouchableOpacity
        style={
              styles.touchableOpacityGoBack

        }
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
            <ScrollView>
                <View style = {styles.container}>
                    {/* <SliderImage images = {detail.pic}/> */}
                    <View style={styles.container}>
                   {detail.pic===undefined ? <ActivityIndicator/>: 
                    <SliderImage images={detail.pic}/>
                   }
                  </View>
                </View>
                {detail.journey===undefined ? <ActivityIndicator/>: <PostTitle post = {detail}/>}
                {detail.user===undefined ? <ActivityIndicator/>: <PostOwner Owner = {detail.user} navigation = {navigation} />}
                { detail.journey===undefined ? <ActivityIndicator/>: <PostJourney Journey = {detail.journey} sl_stoplocal = {detail.journey.stoplocal.length} />}
                
                <View style={{flexDirection:'row', marginTop:30, marginLeft:10}}>
                    <Text style = {[styles.title, styles.text]}>Comments</Text>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={handlePressReport}
                    >
                    <Text
                        style={{...styles.text,textDecorationLine: 'underline'  }}
                    >
                        Xem bình luận
                    </Text>
               {isReportModalVisible &&  <PostComments  isVisible={isReportModalVisible} onClose={handlePressCloseReportModal} id_userPost = {detail.user.id} id_post = {place_id}/>}
                <View style = {{height: 100}}/>
            </TouchableOpacity>
                </View>

            </ScrollView>
            <FixedButton setcompanion={setcompanion}  companions = {detail.travelCompanion} userPost = {detail.user}  id_post = {place_id}/>
        </SafeAreaView>
    )
    
}
const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 400, // Đặt chiều cao của container của Swiper
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'black',
      
    },
    text:{
      fontSize: 25,
    },
    pad:{
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 5,
    },
    Textcenter:{
        alignSelf: 'center',
    },
    tag:{
        width: 100,
        height: 40,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffbe76'
    },
    button: {
        width: 'auto',
        height: 'auto',
        borderRadius: 10,
        marginLeft:30,
    },
    touchableOpacityGoBack:
    {
        position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 1,
    },
    
  });
export default PostDetail;