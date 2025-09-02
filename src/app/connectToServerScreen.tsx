import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function ConnectToServerScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:20 }}>
      <Text style={{ fontSize:18, fontWeight:'bold', marginBottom:10 }}>
        verificando el servidor 🚨
      </Text>
      <Text style={{ marginBottom:20 }}>
       esto puede tardar un poco si el servidor está "durmiendo"
      </Text>
      <Text style={{ marginBottom:20 }}>
       aguarde un momento mientras intentamos conectar ao servidor...
      </Text>
    </View>
  );
}
