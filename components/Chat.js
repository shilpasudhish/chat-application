import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar  } from "react-native-gifted-chat";
import { query, orderBy, collection, onSnapshot, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    const { name, color, uId } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = async(newMessages) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
      let newMessage = {
          ...newMessages[0],
          createdTime: new Date()
      }
      await addDoc(collection(db, "messages"), newMessage);
    }
    let unsubscriber;
    useEffect(() => {
      if(isConnected) {
        if (unsubscriber) unsubscriber();

        navigation.setOptions({ title: name })
        unsubscriber = null;
        const collectionQuery = query(collection(db, "messages"), orderBy("createdTime", "desc"));
        unsubscriber = onSnapshot(collectionQuery, (messages) => {
          let newList = [];
          messages.forEach(message => {
              let newItem = {
                  ...message.data(),
                  createdAt: new Date(message.data().createdTime.seconds*1000)
              };
              newList.push(newItem);
          })
          cacheMessages(newList);
          setMessages(newList);
        })
      }
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

    const renderInputToolbar = (props) => {
      if (isConnected) return <InputToolbar {...props} />;
      return null;
    }

    const cacheMessages = async (messagesToCache) => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    }
    const loadCachedMessages = async () => {
      const cachedMessages = await AsyncStorage.getItem("messages") || [];
      setMessages(JSON.parse(cachedMessages));
    }
  
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
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