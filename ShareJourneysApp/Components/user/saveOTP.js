
import { Timestamp, addDoc, collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { authentication, db } from '../../firebase/firebaseconf';
export const generateVerificationCode = () => {
    return String(Math.floor(1000 + Math.random() * 9000)); // Generates a 4-digit number
  };
export const saveVerificationCodeToFirestore = async (email, code) => {
  try {
 
    const docRefs = doc(db, 'tokens', email);

    // Set document data with verification code and expiry time (30 seconds)
    await setDoc(docRefs, {
        code: code,
        expiry_time: Timestamp.fromDate(new Date(Date.now() + 30000)) // 30 seconds expiry
      });

    console.log('Verification code saved in Firestore:', code);
  } catch (error) {
    console.error('Error saving verification code in Firestore:', error);
    throw error; // Rethrow error for further handling
  }
};

export const verifyVerificationCode = async (email, enteredCode) => {
  try {
    console.log(enteredCode,email);
    const docRef = doc(db, 'tokens', email);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error('Verification code not found.');
    }

    const tokenData = snapshot.data();
    const { code, expiry_time } = tokenData;

    // Convert Firebase Timestamp to Date object
    const expiryTime = expiry_time.toDate();
    const now = new Date();

    // Check if code matches and is within expiry time
    if (code === enteredCode && now < expiryTime) {
      // Code is valid, proceed with verification
      console.log('Verification successful!');
      // Proceed with further actions (e.g., navigating to the next screen)
    } else {
      throw new Error('Invalid or expired verification code.');
    }
  } catch (error) {
    console.error('Error verifying verification code:', error);
    throw error; // Rethrow error for further handling
  }
};

