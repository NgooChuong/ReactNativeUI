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
  ActivityIndicator
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






const Comment =forwardRef(({ id_userPost,hasVisible,setHasVisible,setIdReped,id_P, id_c,reference, index, setIn, comment,bool,setIsCmtRep }, ref) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const dlUser= useContext(Mycontext)

  const handleRep = (id_c) => {
    console.log('3')
    reference()
    console.log(bool);
    setIn(index)
    setIsCmtRep(bool);
    setIdReped(id_c)

  };

  const AddCommentTick = async (id_userCMT) =>{
    try{
      let res = await APIs.post(endpoints['add-tick'](id_P,id_c),{'idUser': id_userCMT})
      
      console.log(res.data);  
      }
      catch(ex)
      {
        console.error(ex);
      }
  }
  useEffect(()=>{
    setHasVisible(!hasVisible)
  },[selectedReason])

  
  const handlePressReason = (reason, id_userCMT) => {
    console.log('dawdawdw222222222222222222222222222222222222222',id_userCMT)
    if (id_userPost == dlUser[0].id)
    {
      AddCommentTick(id_userCMT)
      if (selectedReason === reason) {
        setSelectedReason(null);
      } else {
        setSelectedReason(reason);
      }
    }
  }
  return (
    <TouchableOpacity  onPress={() => handlePressReason(index, comment.user.id)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      
      <Image source={{ uri:  comment.user.avatar }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />

        <View style={{ flex: 1, width: 'auto', backgroundColor: 'lightgray', borderStyle: 'solid', borderWidth: 1, borderRadius: 20, padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{comment.user.username}</Text>
          <Text>{comment.content}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Text style={{ color: 'black', fontSize: 12 }}>{moment(comment.created_date).fromNow()}</Text>


            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleRep(id_c)} ref={ref}>
              <Feather name="message-circle" size={20} color="black" />
            </TouchableOpacity>


            {comment.tick.length > 0 && comment.tick[0].active &&
            <>
              {console.log('ifffffffffffffffffffffffff')}
              {console.log(comment.tick[0].active)}
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


const Comments = memo(forwardRef(({id_userPost,hasVisible, setHasVisible,id_P, setIdReped,handleRef, setIn, comments, set, setRep, rep,setIsCmtR }, ref) => {
  const [showReplyViews, setShowReplyViews] = useState(Array(comments.length).fill(false));
  const [up, setUp] = useState(90)
  // const [indexState,setIndexState] = useState(0);
  // const [id_cmt, setId_cmt] = useState()
  // const [load, setLoad]= useState(false)
  const loadCommentRepPost = async (comment_id,index) =>{
    try{
      console.log('commentRep')
      let res = await APIs.get(endpoints['reply'](comment_id))
      const newRep = [...rep]; // Sao chép mảng Rep
      console.log('index trong api',index)
      newRep[index] = res.data // Thay đổi giá trị tại index
      console.log('new',newRep)
      setRep(newRep); // Cập nhật mảng Rep
      console.log(res.data);  
      }
      catch(ex)
      {
        console.error(ex);
      }
  }


  const handleReplyPress =  (index, id_cmt,rep, count_rep) => {
     let change = -up
    setUp(change)
    // Sao chép mảng hiện tại của showReplyViews
    const newShowReplyViews = [...showReplyViews];

    // Đảo ngược trạng thái của phản hồi cho comment tại chỉ mục index
    newShowReplyViews[index] = !newShowReplyViews[index];
   
    // Cập nhật trạng thái mới
    // set lai comment trong này
    
    // console.log('day la moi rep',rep[0])
  //  setIndexState(index)
  //   setId_cmt(id_cmt)

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
    console.log('2')
    handleRef()
  }
  return (
    <View >
      {comments.map((comment, indexArr) => (
        <View  key={comment.id} style={{ flexDirection: 'column' }}>
          {console.log('index duoi',indexArr)}
           <Comment ref={ref} id_userPost={id_userPost} hasVisible = {hasVisible} setHasVisible={setHasVisible} setIdReped={setIdReped} id_P = {id_P} id_c = {comment.id} reference={useHandleRefresh} comment={comment} index={indexArr} bool ={true} idCmt = {comment.id} setIsCmtRep={setIsCmtR} setIn={setIn} />
          
          {/* nut hien reply */}
          {comment.reply_count != 0 &&
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20, marginRight: 20, flexDirection: 'row' }} onPress={() => handleReplyPress(indexArr, comment.id, rep,comment.reply_count)}>
              <MaterialIcons name="play-arrow" size={24} color="black" style={{ transform: [{ rotate: `${up}deg` }] }} />
              <Text style={{ color: 'black', fontSize: 12 }}>{comment.reply_count} reply</Text>
            </TouchableOpacity>} 


            {/* show reply */}
          {showReplyViews[indexArr] && (
            <View style={{ paddingLeft: 30, marginTop: 10 }}>
              {console.log('isRep',rep[indexArr])}
              
              {rep.length == 0? <ActivityIndicator/>:  
              <>
                {console.log('isReply',rep[indexArr])}
                {console.log('isTypeReply',Array.isArray( rep[indexArr]))}

                {!Array.isArray( rep[indexArr])?   <ActivityIndicator/>:
               <>
               {console.log('adwdadadadwawdada',rep[indexArr])}
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
}));


const InputView = forwardRef(({view,setView, id_c,id_P,index,setIn,comments, set,rep, setRep ,iscmtRep,setIsCmtR }, ref) => {
  const [newCommentText, setNewCommentText] = useState('');

  
  // newComment.content = newCommentText;

  const addComment = async () => {
      try {
          let token = await AsyncStorage.getItem('access-token');
          let res = await authApi(token).post(endpoints['add-comment'](id_P), {
              'content': newCommentText
          })
          set([res.data,...comments]);
          

      } catch (ex) {
          console.error(ex);
      }
  }

  const addRep = async () => {
    try {
      console.log('ad',newCommentText);
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['add-rep'](id_c), {
          'content': newCommentText
      })
      console.log('adadadawdawddddddddddddddddddddddddddddd',res.data);

      setRep([res.data,...rep]);
      setView(!view);

  } catch (ex) {
      console.error(ex);
  }
  }

  const handleAddComment = () => {
    if(iscmtRep) {
        console.log(rep)
        // comments[index].reply_count+=1;
        // console.log('rep');
        
        // setRep([newComment,...rep]);
        addRep()
    }
    else{
      console.log('thg');
      // set([newComment,...comments]);
      addComment()

    }
    setIsCmtR(false)
    setNewCommentText('');
  };

  return (
    <View style={{ width: '100%' }}>
      <TextInput
        ref={ref} // Đảm bảo chuyển ref vào TextInput
        style={{ borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
        label="Thêm bình luận"
        value={newCommentText}
        onChangeText={setNewCommentText}
        right={
          <TextInput.Icon icon="send" onPress={handleAddComment} />
        }
      />
    </View>
  );
});


const PostComments = ({id_userPost,id_post, isVisible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [cmtRep, setCmtRep] = useState()
  const [isCmtRep, setIsCmtRep] = useState(false)
  const [index, setIndex] = useState(0);
  const inputRef = useRef();
  const [idCmt, setIdCmt] = useState()// de luu rep
  const [viewCMTRep,setViewCMTRep ] = useState(false);
  const [hasVisible, setHasVisible] = useState(false);
  const handleButtonPress = (idCmt, setIdCmt) => {
    // Thực hiện hành động trên TextInput của thành phần cha
    console.log('1')

    if (inputRef.current) {
      console.log('1.if')
      inputRef.current.focus();
    }
  };

  // const NewUserCmt = () => {
  //   let id =''
  //   if (comments.length== 0) {
  //     id= 0
  //   }
  //   else comments[0].id + 1
    
  //   return user
  // }



  const loadCommentsPost = async () =>{
    try{
      console.log('commentedwdawdawd')
      let res = await APIs.get(endpoints['comments'](id_post))
      setComments(res.data)
      console.log('abc',res.data)
      }
      catch(ex)
      {
        console.error(ex);
      }
  }
  useEffect(()=>{
    loadCommentsPost();
  },[id_post,viewCMTRep,hasVisible])

  useEffect(()=>{
    setCmtRep(() => Array(comments.length).fill(null).map(() => []))

  },[comments])

  // useEffect(()=>{
  //   console.log('cadwda',cmtRep)
  //   setViewCMTRep(!viewCMTRep)
  // },[cmtRep])
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}

    >
      <View style={[styles.container, styles.overlay]}>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Bình Luận</Text>
        <ScrollView style={{ width: '100%', height: '80%', marginTop: 30 }}>
          {console.log(comments.length)}
          {console.log('mag trong mag',cmtRep)}
          {comments.length != 0 && <Comments id_userPost={id_userPost} hasVisible={hasVisible}  setHasVisible={setHasVisible}   id_P = {id_post} setIdReped={setIdCmt} handleRef={handleButtonPress}  setIn = {setIndex} comments={comments} rep = {cmtRep} setRep = {setCmtRep} set = {setComments} setIsCmtR = {setIsCmtRep} ref={inputRef} />}
        </ScrollView>
        <InputView view = {viewCMTRep} setView = {setViewCMTRep} id_P = {id_post} id_c ={idCmt} comments={comments} index={index} setIn = {setIndex} set={setComments} rep = {cmtRep} setRep = {setCmtRep} iscmtRep = {isCmtRep} setIsCmtR = {setIsCmtRep}  ref={inputRef} />

      </View>
    </Modal>
  );

};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    width: '100%',
    height:'100%',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedReasonItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 5,
  },
  reasonText: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});




export default memo(PostComments);
