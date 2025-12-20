import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { IconPointFilled, IconMapPinFilled, IconPhone, IconMessage } from "@tabler/icons-react-native";
import { VerticalDashedLine } from "../../components/dottedLine";
import { colors, fontFamily } from "@/styles/theme";
import { TripRequestProps } from '@/types';
import { useDriver } from '@/context/driverContext';
import { useUserAuth } from '@/hooks/useUserAuth';

export function NewTripRequest({ item, isSelected, onAccept }: 
    {item: TripRequestProps, isSelected: boolean, onAccept: (trip: TripRequestProps) => void }) {

    const { selectTrip } = useDriver();
    const { user } = useUserAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleCall = () => { console.log("chamando o passageiro") };
    const handleMessage = () => { console.log("escrevendo ao passageiro") };

    const handleAccept = () => {
        if (isLoading || isDisabled) return;

        setIsLoading(true);

        // seleciona a viagem imediatamente (opcional)
        selectTrip(user!, item);

        // aguarda 10 segundos
        setTimeout(() => {
            setIsLoading(false);
            setIsDisabled(true);

            // chama a função passada pelo parent
            onAccept(item);
        }, 10000); // 10 segundos
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 10, justifyContent: "space-between", flexDirection: "column", flex: 1 }}>
                <View style={{ justifyContent: "space-between", flexDirection: "row", width: "auto", height: "100%" }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", marginRight: 4 }}>
                            <IconPointFilled size={20} fill={colors.green.base} />
                            <VerticalDashedLine height={38} width={4} color='#aaa' />
                            <IconMapPinFilled size={15} fill={colors.green.base} />
                        </View>

                        <View style={{ flexDirection: "column", justifyContent: "space-between", marginRight: 40 }}>
                            <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                                <Text style={styles.regular}> origem </Text>
                                <Text style={styles.boldText}>{item.origin?.name}</Text>
                            </View>
                            <View>
                                <Text style={styles.regular}> destino</Text>
                                <Text style={styles.boldText}>{item.destination?.name}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", width: 80 }}>
                        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                            <Text style={styles.regular}>
                                Valor: {`\n`}
                                {item.price !== undefined &&
                                    <Text style={styles.boldText}>
                                        ${item.price.toFixed(2)}
                                    </Text>}
                            </Text>
                            <Text style={styles.regular}>distance: {`\n`}
                                <Text style={styles.boldText}>{item.distance}</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {isSelected ? (
                <View style={{ flexDirection: "column", gap: 4, justifyContent: "space-around", alignItems: "center", width: 50 }}>
                    <TouchableOpacity onPress={handleCall}>
                        <IconPhone size={24} color={colors.green.light}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMessage}>
                        <IconMessage size={24} color={colors.green.light} />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={[
                        styles.acceptButton,
                        (isDisabled || isLoading) && { backgroundColor: colors.gray[400] }
                    ]}
                    onPress={handleAccept}
                    disabled={isDisabled || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.acceptText}>
                            {isDisabled ? "aguarde" : "aceitar"}
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
        height: 120,
        flex: 1
    },
    verticalBar: {
        height: 80, width: 2, backgroundColor: colors.green.soft, marginRight: 10
    },
    regular: {
        fontSize: 11
    },
    boldText: {
        fontSize: 14,
        fontFamily: fontFamily.bold,
        color: colors.gray[600],
        flexWrap: "wrap"
    },
    acceptButton: {
        width: 80,
        backgroundColor: colors.green.base,
        justifyContent: "center",
        alignItems: "center",
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12
    },
    acceptText: {
        color: colors.gray[100],
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        textAlign: "center"
    }
});
