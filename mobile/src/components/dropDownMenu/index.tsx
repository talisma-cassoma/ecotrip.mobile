import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as Svg from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

export function DropDownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const navigation = useNavigation();

    const menuOptions = [
        { label: "profile", screen: "profile" },
        { label: "Historic", screen: "historic" },
        { label: "Login", screen: "login" },
    ];

    const handleOptionPress = (screen: string) => {
        setIsOpen(false);
        navigation.navigate(screen as never); // TypeScript pode reclamar se não usar "as never"
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.container} onPress={() => setIsOpen((prev) => !prev)}>
                <Svg.Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
                    <Svg.Path
                        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                        fill="black"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    />
                </Svg.Svg>
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.dropdown}>
                    {menuOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.option} onPress={() => handleOptionPress(option.screen)}>
                            <Text style={styles.optionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
        alignItems: "flex-start",
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 100,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    dropdown: {
        marginTop: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    optionText: {
        fontSize: 16,
    },
});
