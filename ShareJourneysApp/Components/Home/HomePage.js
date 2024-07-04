import React, { useState, useEffect, useCallback, useRef } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView,Image, RefreshControl, ActivityIndicator} from 'react-native';
import {SIZES, SPACING, COLORS} from '../../constants/theme';
import { SEARCH_PLACES } from '../../data';
import { MaterialIcons } from "@expo/vector-icons";
import { Chip, Surface} from 'react-native-paper';
import PostDetail from '../Post/PostDetail';
import APIs, { endpoints } from '../../config/APIs';
import moment from 'moment';
import "moment/locale/vi"
import Notification from '../Notification/Notification';
import registerNNPushToken from 'native-notify';
import getTags,{getPosts} from '../CallAPI/Load';

const HomePage = ({navigation}) => {

  const [SortTags, setSortTags] = useState([]) 
  const [SortPosts, setSortPosts] = useState([]) 
  const [selectedChips, setSelectedChips] = useState('');
  const allTags= useRef(null)
  const [Tag, setTag] = useState([])
  const [all, setAll] = useState(true)
  const [refreshing,setRefreshing] = useState(true)


  Notification()
  const ToPostDetail = (id) =>{
    navigation.navigate('PostDetail',{"place_id": id,"naviName": 'HomePage'})
  }
  const ToTagScreen = (id,name) =>{
    navigation.navigate('MainHeader',{"tag_id": id,"tag_name":name,"naviName": 'HomePage'})
  }
  const handlePressChip = async(chip) => {
    if(chip!==undefined) {
        let tag = allTags.current.filter(t => t.id==chip)
        setSortTags(tag)
        let post = await getPosts(chip,1)
        setSortPosts([post])
        setSelectedChips(chip)
        setAll(false)
    }
    else{
        setSelectedChips(''); 
        setSortTags(allTags.current)
        setAll(true)
    }

};
  const loadTag= async () => {
    let data = await getTags();
    setSortTags(data.sort((a,b) => b.id - a.id));     
    setTag(data)   
    if (allTags.current === null) {
      allTags.current = data;
    }
  }

  const loadPosts= async () => {
    try {
      let datas = SortTags.map(async(tag) =>{
        let data = await getPosts(tag.id,1);
        return data
      })
      const result = await Promise.all(datas);
      setSortPosts(result);
    } catch(ex) {
        console.error(ex);
    }
  }

  
  useEffect( ()=>{
    if(selectedChips===''){
      loadPosts();
    }
    setRefreshing(true);
  },[SortTags])

  useEffect(()=>{
    loadTag()
    },[refreshing])






const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToTop = 5;
  return contentOffset.y <= paddingToTop;
};
const loadMore = ({nativeEvent}) => {
  if ( isCloseToTop(nativeEvent)) {
      setRefreshing(false);
  }
}


return (
  <View style={{ ...styles.container, width: '100%', height: '100%' }}>
    <Text style={styles.mainTitle}>TAGS</Text>
    {SortTags.length == 0 ? (
      <ActivityIndicator />
    ) : (
      <>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
        {Tag.map((tag) => (
          <Chip
            key={tag.id}
            mode="flat"
            selected={selectedChips === tag.id}
            onPress={() => handlePressChip(tag.id)}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            {tag.name}
          </Chip>
        ))}
        <Chip
          mode="flat"
          selected={all}
          onPress={() => handlePressChip(undefined)}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          all
        </Chip>
      </View>
      
        <ScrollView onScroll={loadMore}>
        {
      refreshing==false && <ActivityIndicator/>
    }
      {SortTags.map((tag, index) => (
        <View key={index}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
  <Text style={styles.mainTitle}>{tag.name}</Text>
  <TouchableOpacity onPress={() => ToTagScreen(tag.id,tag.name)}>
    <Text>Xem thêm</Text>
  </TouchableOpacity>
</View>
          {SortPosts.length === 0 ? (
            <ActivityIndicator />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SortPosts[index]===undefined? <ActivityIndicator/>:
              SortPosts[index].map((place, placeIndex) => (
               <TouchableOpacity key={place.id} onPress={() =>ToPostDetail(place.id)}>
               <View 
               style={
               { 
                 margin: 9, 
                 padding:5, 
                 borderRadius: 10 ,
                 backgroundColor: '#f0f0f0', // Màu nền của container
                 shadowColor: '#000',
                 shadowOffset: {
                   width: 50,
                   height: 50,
                 },
                 shadowOpacity: 1,
                 shadowRadius: 0,
                 elevation: 5,
                 borderStyle:'solid',
                 borderWidth:2,
                 borderColor: 'gray'
                 
               }} >
               <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1 }}>
                 <Image
                   source={{ uri:place.user.avatar }}
                   style={{ width: 30, height: 30, borderRadius: 15}}
                 />
                 <View>
                   <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 14 }}>{place.user.username}</Text>
                   <Text style={{ color: 'gray', fontSize: 12 }}>{moment(place.created_date).fromNow()}</Text>
                 </View>
               </View>
               <View
                     style={{
                       flex: 1,
                       aspectRatio: 1,
                       borderRadius: 12,
                       overflow: 'hidden',
                       width:300,
                       height:300
                     }}
                   >
                   <Image
                       key={index}
                       source={{ uri: place.pic[0].picture}}
                       style={{ width: "100%", height: "80%", borderRadius: 12 }}
                     />
                     
                         <Text style={{ ...styles.text_Post, color: COLORS.black, fontSize: 25, textAlign:'center' }}>{place.title}</Text>
                         <View style = {{
                           flexDirection: 'row', 
                           paddingVertical: 5, 
                           paddingHorizontal: 5, 
                           justifyContent:'space-around'
                           }}>
                           <View style = {{flexDirection: 'row', }}>
                             <MaterialIcons name="star-border" size={20} color={COLORS.black} />
                             <Text 
                               style={{color: COLORS.black, fontSize: 15 }}>
                               { place.avgRate.toFixed(1)}
                             </Text>
                           </View>
                           <View style = {{flexDirection: 'row', }}>
                             <MaterialIcons name="lock-clock" size={20} color={COLORS.black} />
                             <Text 
                               style={{color: COLORS.black, fontSize: 15 }}>
                               {moment(place.journey.ngayDi).format("DD/MM/YYYY")}
                             </Text>
                           </View>
                           <View style = {{flexDirection: 'row', }}>
                             <MaterialIcons name="payment" size={20} color={COLORS.black} />
                             <Text 
                               style={{color: COLORS.black, fontSize: 15 }}>
                               {place.journey.chiPhi}
                             </Text>
                           </View>
                         </View>
                         
               </View>
             </View>  
             </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      ))}
      <View style={{ height: 200 }}></View>
    </ScrollView>
      </>
      
      
    )}

  
  </View>
);

};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.l,
  },
  mainTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
  },
  secondTitle: {
    fontSize: SIZES.title,
  },
 
 row: {
    flexDirection: "row",
    flexWrap: "wrap"
}
});

export default HomePage;
