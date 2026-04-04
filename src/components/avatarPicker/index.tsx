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
  avatars: any[];
  onChange: (source: any) => void;
}
type Avatar = {
  id: string;
  uri: string;
};

export function AvatarPicker({
  mode = "both",
  avatars,
  onChange,
}: AvatarPickerProps) {
  const [selected, setSelected] = useState<Avatar | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  // 📸 Escolher imagem da galeria
 const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
  });

  if (!result.canceled) {
    const avatar: Avatar = {
      id: "gallery-" + Date.now(),
      uri: result.assets[0].uri,
    };

    console.log("📸 Galeria:", avatar);

    setSelected(avatar);
    onChange(avatar);
  }
};

  // 👤 Selecionar avatar da lista
const selectAvatar = (avatar: Avatar) => {
  console.log("👤 Selecionado:", avatar);

  setSelected(avatar);
  onChange(avatar);
};

  // 🔄 Abrir/fechar lista
  const toggle = () => {
    console.log("🔄 Toggle aberto/fechado. Estado atual:", isOpen);

    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        400,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );

    setIsOpen((prev) => !prev);
  };

  // 🔍 Comparar seleção
const isSelectedItem = (item: Avatar) => {
  return selected?.id === item.id;
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

      {/* Conteúdo */}
      {isOpen && (
        <>
          {/* Lista de avatares */}
          {mode !== "gallery" && (
            <FlatList
              data={avatars}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => {
                const selectedItem = isSelectedItem(item);

                return (
                  <TouchableOpacity
                    onPress={() => selectAvatar(item)}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      style={[
                        styles.avatar,
                        selectedItem && styles.selectedAvatar,
                      ]}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {/* Botão galeria */}
          {mode !== "avatar" && (
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await pickImage();
                setIsOpen(false);
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
}
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
    selectedAvatar: {
    borderWidth: 3,
    borderColor: "#00AA00",
  },
});