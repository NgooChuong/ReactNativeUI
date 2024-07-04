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
import Comment from './Comment';


const Comments = forwardRef(({up,setUp,showReplyViews,setShowReplyViews,title ,ngaydi,id_userPost,id_P, setIdReped,handleRef, setIn, comments, set, setRep, rep,setIsCmtR }, ref) => {

    // const [indexState,setIndexState] = useState(0);
    // const [id_cmt, setId_cmt] = useState()
    // const [load, setLoad]= useState(false)
    const loadCommentRepPost = async (comment_id,index) =>{
      try{
        let res = await APIs.get(endpoints['reply'](comment_id))
        const newRep = [...rep]; // Sao chép mảng Rep
        newRep[index] = res.data // Thay đổi giá trị tại index
        console.log('BEn comments',newRep);
        setRep(newRep); // Cập nhật mảng Rep
        }
        catch(ex)
        {
          console.error(ex);
        }
    }
  
  
    const handleReplyPress =  (index, id_cmt) => {
       let change = -up
      setUp(change)
      const newShowReplyViews = [...showReplyViews];
      newShowReplyViews[index] = !newShowReplyViews[index];
      setShowReplyViews(newShowReplyViews);
      loadCommentRepPost(id_cmt, index);
  
    };
    
    // useEffect(() => {
    //   if (showReplyViews[indexState]) {
    //     loadCommentRepPost(id_cmt, indexState);
    //   }
    //   setLoad(true);
    // }, [showReplyViews[indexState]]);
  
  
    const useHandleRefresh = ()=>{
      handleRef()
    }
    return (
      <View >
        {comments.map((comment, indexArr) => (
          <View  key={comment.id} style={{ flexDirection: 'column' }}>
             <Comment  title={title} ngaydi={ngaydi} ref={ref} id_userPost={id_userPost}  setIdReped={setIdReped} id_P = {id_P} id_c = {comment.id} reference={useHandleRefresh} comment={comment} index={indexArr} bool ={true} idCmt = {comment.id} setIsCmtRep={setIsCmtR} setIn={setIn} />
            
            {/* nut hien reply */}
            {comment.reply_count != 0 &&
              <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20, marginRight: 20, flexDirection: 'row' }} onPress={() => handleReplyPress(indexArr, comment.id, rep,comment.reply_count)}>
                <MaterialIcons name="play-arrow" size={24} color="black" style={{ transform: [{ rotate: `${up}deg` }] }} />
                <Text style={{ color: 'black', fontSize: 12 }}>{comment.reply_count} reply</Text>
              </TouchableOpacity>} 
              {console.log('Index của comments',indexArr)}
  
              {/* show reply */}
              {console.log('showReplyViews[indexArr]',showReplyViews[indexArr])}
              {console.log('showReplyViewsindexArr',indexArr)}
              {console.log('showReplyViews',showReplyViews)}
              
            {showReplyViews[indexArr] && (
              <View style={{ paddingLeft: 30, marginTop: 10 }}>
                {console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')}
                {rep.length == 0? <ActivityIndicator/>:  
                <>
                {console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')}
             
                  {console.log('dddddddddddddddddddd',!Array.isArray(rep[indexArr]))}
                  {console.log('eeeeeeeeeeeeeeeeeeeeeeee',rep[indexArr])}

                  {!Array.isArray(rep[indexArr])?   <ActivityIndicator/>:
                 <>
                {console.log('cccccccccccccccccccccccccccccccccccccccccccccc')}

                 {   rep[indexArr].map((reply, indexArr) => (
                    <View style={{ paddingLeft: 10, marginTop: 10 }} key={indexArr}>
                      <Comment reference={useHandleRefresh} comment={reply} index={''} setIn={setIn} bool={false} setIsCmtRep={setIsCmtR}/>
                    </View>
                  ))}
                 </>
                  }
                </>
                }
                
              </View>
            )}
          </View>
        ))}
      </View>
    );
  });
  
  export default Comments;