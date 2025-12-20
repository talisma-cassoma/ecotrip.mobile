import React from "react";
import { Image, Text, StyleSheet, View } from "react-native";
import { colors, fontFamily } from "@/styles/theme";
import { Loading } from "@/components/loading";


export default function ProtectedIndex() {
 
    return (  
        <View style={{ flex: 1, flexDirection: "column",padding: 24, justifyContent: 'center', }}> 
           {/* <Image source={require("@/assets/logo.png")} style={{ width: 150, height: 150, marginTop: 24, marginBottom: 2, alignSelf: 'center' }} /> */}
              <Text style={{fontSize: 24,
                  fontFamily: fontFamily.bold,
                  color: colors.gray[600],
                  textAlign: 'center',
                  marginBottom: 38,}}>EcoTrip</Text> 
     <Loading/>
        </View>
  );
}
