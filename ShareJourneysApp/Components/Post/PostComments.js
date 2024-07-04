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
import Comments from './Comments';






const InputView = forwardRef(({showReplyViews,setShowReplyViews,setUp,view,setView, id_c,id_P,index,setIn,comments, set,rep, setRep ,iscmtRep,setIsCmtR }, ref) => {
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
  const loadCommentRepPosts = async (comment_id) => {
    try{
      let res = await APIs.get(endpoints['reply'](comment_id))
      const newRep = [...rep]; // Sao chép mảng Rep
      newRep[index] = res.data // Thay đổi giá trị tại index
      console.log('draahghjhjhhjh',res.data)
      console.log('BEn Postcomments',newRep);
      setRep(newRep); // Cập nhật mảng Rep
      // return newRep // Cập nhật mảng Rep
      }
      catch(ex)
      {
        console.error(ex);
      }
  }
  const addRep = async () => {
    try {
      let token = await AsyncStorage.getItem('access-token');
      let res = await authApi(token).post(endpoints['add-rep'](id_c), {
          'content': newCommentText
      })

      const cm = comments.splice(index, 1,res.data);
      // console.log('123456',cm);
      // setUp(-90);
      const newShowReplyViews = [...showReplyViews];
      newShowReplyViews[index] = true;
      setShowReplyViews(newShowReplyViews);
     loadCommentRepPosts(cm[0].id)
      set(comments);
      setView(!view);

  } catch (ex) {
      console.error(ex);
  }
  }

  const handleAddComment = () => {
    if(iscmtRep) {

        addRep()
    }
    else{
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


const PostComments = ({title,ngaydi,islocked,id_userPost,id_post, isVisible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [cmtRep, setCmtRep] = useState()
  const [isCmtRep, setIsCmtRep] = useState(false)
  const [index, setIndex] = useState(0);
  const inputRef = useRef();
  const [idCmt, setIdCmt] = useState()// de luu rep
  const [viewCMTRep,setViewCMTRep ] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showReplyViews, setShowReplyViews] = useState(Array(comments.length).fill(false));
  const [up, setUp] = useState(90)

  const handleButtonPress = () => {
    // Thực hiện hành động trên TextInput của thành phần cha

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const loadCommentsPost = async () =>{

    if (page > 0) {
      setLoading(true);
    try{
      let res = await APIs.get(`${endpoints['comments'](id_post)}?page=${page}`)

    
      if (res.data.next === null)
        setPage(0);

      if (page === 1)
        setComments(res.data.results);
      else
        setComments(current => {
            return [...current, ...res.data.results];
        });
      }
      catch(ex)
      {
        console.error(ex);
      }
      finally{
        setLoading(false);

      }
  }
}
  useEffect(()=>{
    loadCommentsPost();
  },[id_post,viewCMTRep,page])

  useEffect(()=>{
    setCmtRep(() => Array(comments.length).fill(null).map(() => []))

  },[comments])


    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 20;
      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
  };
  const loadMore = ({nativeEvent}) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
    }
}


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
        <ScrollView style={{ width: '100%', height: '80%', marginTop: 30 }} onScroll={loadMore}>
        <RefreshControl onRefresh={() => loadCommentsPost()} />
        {loading && <ActivityIndicator />}
          {comments.length != 0 && <Comments
           title={title} 
           ngaydi={ngaydi} 
           id_userPost={id_userPost}  
           id_P = {id_post} 
           setIdReped={setIdCmt} 
           handleRef={handleButtonPress}  
           setIn = {setIndex} 
           comments={comments} 
           rep = {cmtRep} 
           setRep = {setCmtRep} 
           set = {setComments} 
           setIsCmtR = {setIsCmtRep} 
           ref={inputRef} 
           setShowReplyViews={setShowReplyViews}
           setUp={setUp}
           showReplyViews={showReplyViews}
           up={up}
           />}
          {loading && page > 1 && <ActivityIndicator />}

        </ScrollView>
        {islocked != 'lock'  && <InputView 
        view = {viewCMTRep} 
        setView = {setViewCMTRep} 
        id_P = {id_post} 
        id_c ={idCmt} 
        comments={comments} 
        index={index} 
        setIn = {setIndex} 
        set={setComments} 
        rep = {cmtRep} 
        setRep = {setCmtRep} 
        iscmtRep = {isCmtRep} 
        setIsCmtR = {setIsCmtRep}  
        ref={inputRef} 
        setShowReplyViews={setShowReplyViews}
        setUp={setUp}
        showReplyViews={showReplyViews}
        />}
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
