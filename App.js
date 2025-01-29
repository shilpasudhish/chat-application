import Chat from './components/Chat';
import Start from './components/Start';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function App() {
  const Stack = createNativeStackNavigator();

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
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
