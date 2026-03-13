import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { IconEyeClosed, IconEye } from "@tabler/icons-react-native";
import { colors, fontFamily } from "@/styles/theme";

interface PasswordInputProps extends TextInputProps {
  // optional prop to control initial visibility
  isVisible?: boolean;
}

export function PasswordInput({ isVisible = false, style, ...rest }: PasswordInputProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(isVisible);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
      <TextInput
        {...rest}
        style={[styles.input, { flex: 1 }, style]}
        placeholder="********"
        placeholderTextColor={colors.gray[300]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          right: 0,
          top: 0,
          bottom: 0,
          margin: 6,
          borderRadius: 8,
          backgroundColor: colors.green.soft,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showPassword ? (
          <IconEye size={24} color="#00AA00" />
        ) : (
          <IconEyeClosed size={24} color="#00AA00" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    color: '#333',
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20,
  },
});