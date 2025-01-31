import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { query, orderBy, collection, onSnapshot, addDoc } from "firebase/firestore";



const Chat = ({ route, navigation, db, }) => {
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

    useEffect(() => {
      navigation.setOptions({ title: name })
      var unsubscriber = null;
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
        setMessages(newList);
      })
      return () => {
        if (unsubscriber) unsubscriber();
      }
    }, [`${messages}`]);

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
  
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
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