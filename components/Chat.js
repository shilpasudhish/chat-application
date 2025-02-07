import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar  } from "react-native-gifted-chat";
import { query, orderBy, collection, onSnapshot, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const { name, color, uId } = route.params;
    const [messages, setMessages] = useState([]);

    // function for sending messages
    const onSend = (newMessages) => {
      const [message] = newMessages;
  
      // adding message to firebase
      addDoc(collection(db, "messages"), {
        _id: message._id,
        text: message.text || "",
        createdTime: message.createdTime?.toDate() || new Date(),
        user: message.user,
        image: message.image || null,
        location: message.location || null,
      });
  
      // adding message to chat
      setMessages((prev) => GiftedChat.append(prev, newMessages));
    };

    let unsubscriber;
    useEffect(() => {
      // checking if user is connected
      if(isConnected) {
        // unsubscribe exisiting listener if any
        if (unsubscriber) unsubscriber();

        navigation.setOptions({ title: name })
        unsubscriber = null;
        // listening to messages in realtime
        const collectionQuery = query(collection(db, "messages"), orderBy("createdTime", "desc"));
        unsubscriber = onSnapshot(collectionQuery, (messages) => {
          let newList = [];
          messages.forEach(message => {
              let newItem = {
                  ...message.data(),
                  createdTime: new Date(message.data().createdTime.seconds*1000)
              };
              newList.push(newItem);
          })
          cacheMessages(newList);
          setMessages(newList);
        })
      }
      // is user is not connected, load cached messages
      else {
        loadCachedMessages();
      }
      return () => {
        if (unsubscriber) unsubscriber();
      }
    }, [isConnected]);

    const renderBubble = (props) => {
      return <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
    }

    // function for rendering message input
    const renderInputToolbar = (props) => {
      if (isConnected) return <InputToolbar {...props} />;
      return null;
    }

    //  function for rendering custom action for chat
    const renderCustomActions = (props) => {
      return <CustomActions storage={storage} userID={uId} onSend={(message) => onSend(message)} name = {name} {...props} />;
    };

    // function for rendering map 
    const renderMapView = (props) => {
      const { currentMessage } = props;
      if (
        currentMessage.location &&
        currentMessage.location.latitude !== 0 &&
        currentMessage.location.longitude !== 0
      ) {
        return (
          <MapView
            style={{ width: 150, height: 100, borderRadius: 15, margin: 4 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
      return null;
    };

    // function for caching messages
    const cacheMessages = async (messagesToCache) => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    }
    // function for loading cached messages
    const loadCachedMessages = async () => {
      const cachedMessages = await AsyncStorage.getItem("messages") || [];
      setMessages(JSON.parse(cachedMessages));
    }
  
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          messages={messages}
          placeholder={"Type to send message"}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          accessible = {true}
          accessibilityLabel="send"
          accessibilityHint="Sends a message"
          accessibilityRole="button"
          renderActions={renderCustomActions}
          renderCustomView={renderMapView}
          onSend={messages => onSend(messages)}
          user={{
            _id: uId,
            name
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;