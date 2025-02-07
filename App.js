import Chat from './components/Chat';
import Start from './components/Start';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore,  disableNetwork, enableNetwork  } from "firebase/firestore";
import { useNetInfo }from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { getStorage } from "firebase/storage";

// Firebase configurations
const firebaseConfig = {
  apiKey: "AIzaSyDncD213T7UcnCJW5VeCG8j6aNReiFzbu0",
  authDomain: "chatapp-56ae8.firebaseapp.com",
  projectId: "chatapp-56ae8",
  storageBucket: "chatapp-56ae8.firebasestorage.app",
  messagingSenderId: "415769590769",
  appId: "1:415769590769:web:729f5e073c759ea72aa250"
};

export default function App() {
  const Stack = createNativeStackNavigator();
   // Initialising Firebase
  const app = initializeApp(firebaseConfig);

  // Initialise firestore for database reference
  const db = getFirestore(app);

   // using useNetInfo() React hook to keep track of connection status & updates
  const connectionDetails = useNetInfo();

  // Initialise storage handler for firebase storage
  const storage = getStorage(app);

   // Display popup if connection is lost
  useEffect(() => {
    if (connectionDetails.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionDetails.isConnected === true) {
      enableNetwork(db);
    }
    // re-run code block when dependency value(connection status) changes
  }, [connectionDetails.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="start"
      >
        <Stack.Screen
          name="start"
          component={Start}
        />
        <Stack.Screen
          name="chat"
         >
          {/* passing required props to Chat component along with the other unspecific props using spread operator*/}
          {props => <Chat db={db} isConnected={connectionDetails.isConnected} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
