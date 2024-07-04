import React, { useState, useEffect, useCallback } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView,Image, RefreshControl, ActivityIndicator} from 'react-native';
import {SIZES, SPACING, COLORS} from '../../constants/theme';
import { MaterialIcons } from "@expo/vector-icons";
import moment from 'moment';
import "moment/locale/vi"
import {getFillPosts} from '../CallAPI/Load';


const ScreenHeader = ({navigation,fil,q,tag_id,tag_name}) => {

  const [SortPosts, setSortPosts] = useState([]) 
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const ToPostDetail = (id) =>{
    navigation.navigate('PostDetail',{"place_id": id,"naviName": 'HomePage'})
  }


  
  const loadPosts = async () => {
    if (page > 0) {
        try {
            setLoading(true);
            let res = await getFillPosts(tag_id,q,fil,page)
            if (page === 1)
              setSortPosts(res.data.results);
            else if (page > 1)
              setSortPosts(current => {
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
    loadPosts()
  },[q,fil,page])
  
  useEffect(()=>{
    setPage(1)
  },[q,fil])

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
      <View style={{...styles.container, width:'100%', height:'100%'}}>
          <Text style={styles.mainTitle}>{tag_name}</Text>
          {
            SortPosts.length==0?
              <Text>Không có kết quả trong tag {tag_name}</Text>
            :
            <ScrollView  style={{ flex: 1, paddingHorizontal: 1}} onScroll={loadMore}>
            <RefreshControl onRefresh={() => loadPosts()} />
            {loading && <ActivityIndicator/>}
              {SortPosts.map((place, index) => {
              return (
              <TouchableOpacity key={index} onPress={() =>ToPostDetail(place.id)}>
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
                      height:300,
                      marginLeft: 14,
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
              )
          })}
            {loading && page > 1 && <ActivityIndicator/>}
            </ScrollView>
          }
        <View style={{height:130}}></View>             
      </View>

   
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.l,
  },
  mainTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  secondTitle: {
    fontSize: SIZES.title,
  },
});

export default ScreenHeader;
