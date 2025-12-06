import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fontFamily } from "@/styles/theme"
import { Button } from '@/components/button';
import { IconArrowLeft } from "@tabler/icons-react-native"
import { router } from "expo-router"


export default function AboutUs() {
    return (
        <View style={styles.container}>
            <Button style={{ width: 40, height: 40, marginBottom: 40 }} onPress={() => router.back()}>
                <Button.Icon icon={IconArrowLeft} />
            </Button>
            <Text style={styles.title}>Sobre nosotros</Text>
            <ScrollView
                style={{ flex: 1, padding: 24, backgroundColor: "white" }}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
            >

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.green.soft,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    }
});
