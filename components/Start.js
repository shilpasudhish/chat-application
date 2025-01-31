import { useState } from 'react';
import { ImageBackground, Image, StyleSheet, View, Text, TouchableOpacity , TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import image from '../assets/Background Image.png';
import { getAuth, signInAnonymously } from 'firebase/auth';


const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#090C08');

  const auth = getAuth();
  const signUserIn = () => {
      signInAnonymously(auth).then(res => {
          navigation.navigate("chat", {uId: res.user.uid, name: name, color: color});
          Alert.alert("Here we go!");
      }).catch(err => {
          Alert.alert("Sorry something unexpected happened.");
      })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : ''}
    >
      <View style={styles.main}>
        <ImageBackground source={image} style={styles.image}>
          <View style= {styles.titlewrapper}>
            <Text style={styles.title}>Let's Hello!</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.inputWrapper}>
            <Image
              style={[styles.searchIcon, {resizeMode: 'stretch'}]}
              source={require('../assets/icon.svg')}
            />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={name}
                onChangeText={(val) => setName(val)}
                placeholderTextColor='#757083'
              />
            </View>
            <Text style={styles.label}>Choose Background Color:</Text>
            <View style={styles.colorOptions}>
              <TouchableOpacity  style={[styles.colorCircle, { backgroundColor: '#090C08' }, color === '#090C08' && { borderWidth: 2, borderColor: '#757083', }]} onPress={() => setColor('#090C08')} />
              <TouchableOpacity  style={[styles.colorCircle, { backgroundColor: '#474056' }, color === '#474056' && { borderWidth: 2, borderColor: '#757083', }]} onPress={() => setColor('#474056')} />
              <TouchableOpacity able style={[styles.colorCircle, { backgroundColor: '#8A95A5' }, color === '#8A95A5' && { borderWidth: 2, borderColor: '#757083', }]} onPress={() => setColor('#8A95A5')} />
              <TouchableOpacity  style={[styles.colorCircle, { backgroundColor: '#B9C6AE' }, color === '#B9C6AE' && { borderWidth: 2, borderColor: '#757083', }]} onPress={() => setColor('#B9C6AE')} />
            </View>
            <TouchableOpacity sable style={styles.buttonText} onPress={() => {
                        if (name == '') {
                            Alert.alert('Username is required to proceed further.');
                        } else {
                            signUserIn();
                        }
                    }}>
              <Text style={styles.text}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%'
  },
  titlewrapper: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchIcon: {
    width: 40,
    height: 40, borderWidth: 1,
    borderColor: 'red',
    color:'blue'
    
  },
  container: {
    width: '88%',
    flex: 4,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  inputWrapper: {
    flexDirection: 'row',
    width: '88%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    flex: 1
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#757083'
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    marginBottom: 20,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  buttonText: {
    width: 'auto',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 600,
  },
  image: {
    flex: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30
  },
});

export default Start;