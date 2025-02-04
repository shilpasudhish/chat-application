import Chat from './components/Chat';
import Start from './components/Start';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore,  disableNetwork, enableNetwork  } from "firebase/firestore";
import { useNetInfo }from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert } from 'react-native';

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
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const connectionDetails = useNetInfo();

  useEffect(() => {
    if (connectionDetails.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionDetails.isConnected === true) {
      enableNetwork(db);
    }
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
          {props => <Chat db={db} isConnected={connectionDetails.isConnected} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
