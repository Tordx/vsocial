import { Platform } from "react-native";
import { appcontrol, login, salesdetails, userdetails } from "../../interface";
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';


export const getSalesDetails = async (id: string): Promise<salesdetails[]> => {
    try {
        const collectionRef = firestore().collection('salesdetails');
        const querySnapshot = await collectionRef.where('transId', '==', id).get();
    
        const data: salesdetails[] = [];
        querySnapshot?.forEach((documentSnapshot) => {
        const docData = documentSnapshot.data() as salesdetails;
        data.push(docData);
        });

        return data;
    } catch (error) {
        console.log('Error retrieving data:', error);
        return [];
    }
    };

export const fetchuser = async (username: string): Promise<userdetails[]> => {
    try {
        const collectionRef = firestore().collection('user');
        const querySnapshot = await collectionRef.where('username', '==', username).where('active', '==', true).get();
    
        const data: userdetails[] = [];
        querySnapshot?.forEach((documentSnapshot) => {
        const docData = documentSnapshot.data() as userdetails;
        data.push(docData);
        });

        return data;
    } catch (error) {
        console.log('Error retrieving data:', error);
        return [];
    }
};

export const fetchAppControl = async (): Promise<appcontrol[]> => {
    try {
        const collectionRef = firestore().collection('maintenance');
        const querySnapshot = await collectionRef.get();
    
        const data: appcontrol[] = [];
        querySnapshot?.forEach((documentSnapshot) => {
        const docData = documentSnapshot.data() as appcontrol;
        data.push(docData);
        });

        return data;
    } catch (error) {
        console.log('Error retrieving data:', error);
        return [];
    }
};


export const uploadImageToFirebase = async (imageUri: any, setTransferred: any) => {

    try {
      const uri = imageUri;
      console.log(imageUri);
  
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      setTransferred(0);
      const task = storage().ref(filename).putFile(uploadUri);
      task.on('state_changed', snapshot => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
        );
      });
      return await task.then(async () => {
        const firebasedata = await storage().ref(filename).getDownloadURL();
        return firebasedata;
      });
    } catch (error) {
      console.log('Error uploading image:', error);
      throw error;
    }
  };