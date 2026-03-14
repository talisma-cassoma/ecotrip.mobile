import React, { useState } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageSourcePropType,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { IconArrowBarToDown } from "@tabler/icons-react-native";
import { LayoutAnimation, Platform, UIManager } from "react-native";

// Enable on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
type Mode = "avatar" | "gallery" | "both";

interface AvatarPickerProps {
  mode?: Mode;
  avatars: ImageSourcePropType[];
  onChange: (source: ImageSourcePropType | { uri: string }) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  mode = "both",
  avatars,
  onChange,
}) => {
  const [selected, setSelected] = useState<ImageSourcePropType | { uri: string } | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      setSelected(source);
      onChange(source);
      setIsOpen(false);
    }
  };

  const selectAvatar = (avatar: ImageSourcePropType) => {
    setSelected(avatar);
    onChange(avatar);
    setIsOpen(false);
  };

  const toggle = () => {
    // Animate next layout change
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      400, // duration in ms
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity
    )
  );
  setIsOpen(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <Text>Selecciona un avatar</Text>

      {/* Preview */}
      {selected && (
        <TouchableOpacity onPress={toggle}>
          <Image source={selected} style={styles.preview} />
        </TouchableOpacity>
      )}

      {/* Content below */}
      {isOpen && (
        <>
          {mode !== "gallery" && (
            <FlatList
              data={avatars}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectAvatar(item)}>
                  <Image source={item} style={styles.avatar} />
                </TouchableOpacity>
              )}
            />
          )}

          {mode !== "avatar" && (
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await pickImage();
                toggle();
              }}
            >
              <Text style={styles.buttonText}>
                ou clique para cargar una imagen de la galería
              </Text>
              <IconArrowBarToDown size={24} color="#00AA00" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default AvatarPicker;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
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
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonText: {
    fontWeight: "600",
  },
});