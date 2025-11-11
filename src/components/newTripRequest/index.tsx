import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { IconPointFilled, IconMapPinFilled, IconPhone, IconMessage } from "@tabler/icons-react-native"
import { VerticalDashedLine } from "../../components/dottedLine"
import { colors, fontFamily } from "@/styles/theme"
import { TripRequestProps } from '@/types';
import { useDriver } from '@/context/driverContext';
import { useUserAuth } from '@/context/userAuthContext';


export function NewTripRequest({ item, onAccept, isSelected }: {item: TripRequestProps, isSelected: boolean,  
    onAccept: (trip: TripRequestProps) => void;}) {

    const handleCall = () => { console.log("chamando o passageiro") }
    const handleMessage = () => { console.log("escrevendo ao passageiro") }
    const { selectTrip } = useDriver();
    const { user } = useUserAuth();

    return (
        <View style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: "#fff",
            height: 120,
            flex: 1
        }}>
            <View style={{ padding: 10, justifyContent: "space-between", flexDirection: "column", flex: 1 }}>
                <View style={{ justifyContent: "space-between", flexDirection: "row", width: "auto", height: "100%" }}>
                    <View style={{ flexDirection: 'row', flex: 1, }}>
                        <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", marginRight: 4 }}>
                            <IconPointFilled size={20} fill={colors.green.base} />
                            <VerticalDashedLine height={38} width={4} color='#aaa' />
                            <IconMapPinFilled size={15} fill={colors.green.base} />
                        </View>

                        <View style={{ flexDirection: "column", justifyContent: "space-between", marginRight: 40 }}>
                            <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                                <Text style={styles.regular}> origem </Text>
                                <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600], flexWrap: "wrap" }}>{item.origin?.name}</Text>
                            </View>
                            <View>
                                <Text style={styles.regular}> destino</Text>
                                <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600], flexWrap: "wrap" }}>{item.destination?.name}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", width: 80 }}>
                        {/* <View style={styles.verticalBar} /> */}
                        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                            <Text style={styles.regular}>
                                Valor: {`\n`}
                                {item.price !== undefined &&
                                    <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600] }}>
                                        ${item.price.toFixed(2)}
                                    </Text>}
                            </Text>
                            <Text style={styles.regular}>distance: {`\n`}
                                <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600] }}>{item.distance}</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            {isSelected ? (
                <View style={{flexDirection: "column", gap: 4,justifyContent: "space-around",alignItems: "center", width: 50}}>
                    <TouchableOpacity onPress={handleCall}>
                    <IconPhone size={24} color={colors.green.light}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMessage}>
                    <IconMessage size={24} color={colors.green.light} />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={{ width: 80, backgroundColor: colors.green.base, justifyContent: "center", borderBottomRightRadius: 12, borderTopRightRadius: 12 }}
                    onPress={() => {
                        selectTrip(user!, item);
                     }}
                    //  onPress={() => onAccept(item)}
                >
                    <Text style={{
                        color: colors.gray[100],
                        fontFamily: fontFamily.semiBold,
                        fontSize: 16,
                        textAlign: "center"
                    }}>
                       aceitar
                    </Text>
                </TouchableOpacity>             
            )}
        </View >

    );
}

const styles = StyleSheet.create({
    verticalBar: {
        height: 80, width: 2, backgroundColor: colors.green.soft, marginRight: 10
    },
    regular: {
        fontSize: 11
    }
});
