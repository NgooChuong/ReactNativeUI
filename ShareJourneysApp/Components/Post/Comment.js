import React, { useState, useRef ,forwardRef, useEffect,memo ,useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image, Button,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons,Feather } from '@expo/vector-icons';
import UserComments from '../../data/Comments';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../../constants';
import moment from 'moment';
import reply from '../../data/cmtRep';
import APIs, { authApi, endpoints } from '../../config/APIs';
import Mycontext from '../../config/Mycontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendNotification } from '../Notification/Notification';
//{ title ,ngaydi,id_userPost,setIdReped,id_P, id_c,reference, index, setIn, comment,bool,setIsCmtRep }
const Comment =forwardRef((props, ref) => {
    const [selectedReason, setSelectedReason] = useState();
    const [tick, setTick] = useState();
    const dlUser= useContext(Mycontext)
  
    const handleRep = (id_c) => {
      props.reference()
      props.setIn(props.index)
      props.setIsCmtRep(props.bool);
      props.setIdReped(id_c)
  
    };
  
    const AddCommentTick = async (id_userCMT) =>{
      try{
        let res = await APIs.post(endpoints['add-tick'](props.id_P,props.id_c),{'idUser': id_userCMT})
        setTick(res.data)
        if (res.data.tick[0].active == true) {
          sendNotification(`Bạn được mời đi chung hành trình ${props.title}`,res.data.user.username)
        }
        else {
          sendNotification(`Bạn bị hủy hành trình ${props.title}` ,res.data.user.username)
        }
      }
        catch(ex)
        {
          console.error(ex);
        }
    }
  
  
    
    const handlePressReason = (reason, id_userCMT) => {
      if (props.id_userPost == dlUser[0].id)
      {
        AddCommentTick(id_userCMT)
        if (selectedReason == reason) {
          setSelectedReason(null);
        } else {
          setSelectedReason(reason);
        }
      }
    }
    const checkDisabledButon =()=> {
      if ( moment().isAfter(moment(props.ngaydi)))
        return true
      return false
    }
    return (
      <TouchableOpacity disabled={checkDisabledButon()}  onPress={() => handlePressReason(props.index, props.comment.user.id)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image source={{ uri:  props.comment.user.avatar }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
  
          <View style={{ flex: 1, width: 'auto', backgroundColor: 'lightgray', borderStyle: 'solid', borderWidth: 1, borderRadius: 20, padding: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{props.comment.user.username}</Text>
            <Text>{props.comment.content}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Text style={{ color: 'black', fontSize: 12 }}>{moment(props.comment.created_date).fromNow()}</Text>
  
  
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleRep(props.id_c)} ref={ref}>
                <Feather name="message-circle" size={20} color="black" />
              </TouchableOpacity>
  
              {/* {console.log(comment.tick!= undefined )}
              {console.log( comment.tick.length > 0)}
              {console.log( comment.tick[0].active)} */}
              {/* {console.log('cawcaw' ,tick)} */}
              { tick==undefined? props.comment.tick!= undefined && props.comment.tick.length > 0 && props.comment.tick[0].active &&
              <>
                <View style={{ justifyContent: 'flex-end', width: 40 }}>
                    <MaterialIcons
                              name="check-circle"
                              size={24}
                              color="green"
                            />
                </View>
              </>:
              tick.tick[0].active &&
              <>
              <View style={{ justifyContent: 'flex-end', width: 40 }}>
                  <MaterialIcons
                            name="check-circle"
                            size={24}
                            color="green"
                          />
              </View>
            </>
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });
  
export default Comment;