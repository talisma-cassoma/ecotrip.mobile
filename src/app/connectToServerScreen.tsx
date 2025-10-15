import { View, Text, Image } from 'react-native';
import { useUserAuth } from '../context/userAuthContext';

export default function ConnectToServerScreen() {
  const { serverMessage } = useUserAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        {serverMessage}
      </Text>
      <Image
        source={require("@/assets/car.gif")}
        style={{
          width: 200,
          height: 178,
          marginTop: 24,
          marginBottom: 28
        }}
      />
      <Text style={{ marginBottom: 20, textAlign: 'center', color: '#555' }}>
        Conectando al servidor... Puede tardar un poco.{"\n"}
        (servidor dormindo...💤)
      </Text>
    </View>
  );
}
