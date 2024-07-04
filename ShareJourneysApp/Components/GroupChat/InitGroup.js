import { collection, doc, setDoc, serverTimestamp, getFirestore, arrayUnion, arrayRemove, query, where, getDocs, getDoc, limit, updateDoc, onSnapshot, addDoc, orderBy, deleteDoc } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/firebaseconf';

// Initialize Firestore and Auth


// Create a new group
export const createGroup = async (groupName, creatorId, members,username) => {
  console.log("member",members);
  const groupRef = doc(collection(db, 'groups')); // Create a new document reference in the 'groups' collection
  await setDoc(groupRef, {
    avatar:'https://tse2.mm.bing.net/th?id=OIP.avb9nDfw3kq7NOoP0grM4wHaEK&pid=Api&P=0&h=220',
    name: groupName,
    creator: creatorId,// id nguoi tao
    creator_by: username,
    members: members,
    // avatarGroup: avatar,
    createdAt: serverTimestamp(),
  });
  return groupRef.id;
};

const getGroup = async (groupId) => {
 // Reference to the specific document that contains the member array
 const docRef = doc(db, 'groups', groupId);
      
 // Get the document
 const docSnap = await getDoc(docRef);
 return docSnap
}

// Add a member to a group
export const addMemberToGroup = async (chatId, memberId, username) => {
  const groupRef = doc(db, 'groups', chatId);
  try {
    await updateDoc(groupRef, {
      members: arrayUnion({ uid: memberId, user: username }),
    });
    console.log(`Member ${memberId} (${username}) added to group ${chatId} successfully.`);
  } catch (error) {
    console.error('Error adding member to group:', error);
    throw error;
  }
};
// Remove a member from a group
// Xóa thành viên từ mảng members trong tài liệu Firestore
export const removeMemberFromGroup = async (chatId, memberId) => {
  const groupRef = doc(db, 'groups', chatId);

  try {
    const groupDoc = await getDoc(groupRef);
    if (!groupDoc.exists()) {
      throw new Error('Group does not exist.');
    }

    const currentMembers = groupDoc.data().members || [];

    // Tạo mảng mới chỉ chứa các thành viên có uid khác với memberId
    const updatedMembers = currentMembers.filter(member => member.uid !== memberId);

    // Cập nhật lại mảng members vào Firestore
    await setDoc(groupRef, {
      ...groupDoc.data(),
      members: updatedMembers,
    });

    console.log(`Member ${memberId} removed from group ${chatId} successfully.`);
  } catch (error) {
    console.error('Error removing member from group:', error);
    throw error;
  }
};

// Delete a group
export const deleteGroup = async (chatId) => {
  console.log("Chatfa",chatId)
  const groupRef = doc(db, 'groups', chatId);
  console.log(groupRef);
  try {
    await deleteDoc(groupRef);
    console.log(`Group ${chatId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

// Get a user by email
export const getUserByEmail = async (email) => {
  try {
    const collectionRef = collection(db, email); // Tạo reference đến collection
    const querySnapshot = await getDocs(collectionRef); // Lấy tất cả tài liệu trong collection

    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        if (userData.username === email) {
          console.log("Document ID:", doc.id);
          return userData.userUID; // Trả về UID của document khớp
        }
      }
      throw new Error('No matching documents found');
    } else {
      throw new Error('No documents found in collection');
    }
  } catch (error) {
    throw new Error('Error fetching document UID: ' + error.message); // Xử lý lỗi nếu có
  }
};
// Send a message to a group
// Lấy tin nhắn trong nhóm
export const listenGroupMessages = (groupId, callback) => {
    console.log("Checking for group messages in group:", groupId);
    const colRef = collection(db, 'groups', groupId, 'messages');
    const q = query(colRef, orderBy('createdAt', 'desc')); // Sắp xếp tin nhắn theo thời gian tăng dần
  
    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No messages found.");
        callback([]); // Trả về mảng rỗng nếu không có tin nhắn
      } else {
        const messages = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            user: {
              _id: data.senderId,
              name: data.senderName, // Assuming you have the sender's name available in the 'messages' collection
              avatar: data.senderAvatar, 
            },
          };
        });
        console.log("Messages retrieved:", messages);
        callback(messages);
      }
    }, (error) => {
      console.error('Error listening to group messages:', error);
      callback([]); // Trả về mảng rỗng nếu có lỗi
    });
  };
  
  // Gửi tin nhắn trong nhóm
  export const sendGroupMessage = async (groupId, senderId,newMessage,senderName,senderAvatar) => {
    console.log("secdas",newMessage)
    const colRef = collection(db, 'groups', groupId, 'messages');
    if (senderAvatar == null)
    {
      senderAvatar="https://thumbs.dreamstime.com/b/businessman-avatar-line-icon-vector-illustration-design-79327237.jpg"
    }
    console.log("adaava",senderAvatar)
    await addDoc(colRef, {
      text: newMessage,
      senderId: senderId,
      senderName: senderName,
      senderAvatar: senderAvatar,
      createdAt: serverTimestamp(),
    });
  };
  export const getGroupMembers = async (groupId) => {
    try {
      const docSnap= await getGroup(groupId);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const memberData = data.members; // Assuming the array is stored under the 'members' field
        const avatar = data.avatar
        const name = data.name
        if (Array.isArray(memberData)) {
          const memberCount = memberData.length; // Count the elements in the array
          return {avatar,memberData, memberCount,name}; // Return the count of members
        } else {
          throw new Error('Members field is not an array or is missing.');
        }
      } else {
        throw new Error('No such document!');
      }
    } catch (error) {
      throw new Error('Error getting member data: ' + error.message);
    }
  };

  export const changeCreator = async (groupId, newCreatorId, newCreatorEmail) => {
    try {
      // Reference to the group document
      const groupDoc= await getGroup(groupId);

  
      if (groupDoc.exists()) {
        // Update the creator and creator_by fields
        console.log("Group document exists. Data:", groupDoc.data());
        await updateDoc(groupRef, {
          creator: newCreatorId,
          creator_by: newCreatorEmail
        });
        console.log("Creator changed successfully");
      } else {
        console.log("Group document does not exist");
      }
    } catch (error) {
      console.error("Error changing creator: ", error);
    }
  };