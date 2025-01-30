import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from "react-native-gifted-chat";


const Chat = ({ route, navigation }) => {
    const { name, color } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }

    useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: 'You have joined the chatroom',
          createdAt: new Date(),
          system: true,
        },
      ]);
    }, []);


    useEffect(() => {
      navigation.setOptions({ title: name })
    }, []);

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
            _id: 1,
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