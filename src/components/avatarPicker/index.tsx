import React, { useState } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

type Mode = "avatar" | "gallery" | "both";

interface AvatarPickerProps {
  mode?: Mode;
  avatars: string[];
  onChange: (uri: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  mode = "both",
  avatars,
  onChange,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelected(uri);
      onChange(uri);
    }
  };

  const selectAvatar = (uri: string) => {
    setSelected(uri);
    onChange(uri);
  };

  return (
    <View style={styles.container}>
      {selected && (
        <Image source={{ uri: selected }} style={styles.preview} />
      )}

      {mode !== "gallery" ? (
        <FlatList
          data={avatars}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectAvatar(item)}>
              <Image source={{ uri: item }} style={styles.avatar} />
            </TouchableOpacity>
          )}
        />
      ) : null}

      {mode !== "avatar" ? (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default AvatarPicker;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});