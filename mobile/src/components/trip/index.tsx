import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { IconPointFilled, IconMapPinFilled } from "@tabler/icons-react-native"
import { VerticalDashedLine } from "../../components/dottedLine"
import { colors, fontFamily } from "@/styles/theme"

interface Trip {
    id: string;
    origin: string;
    destination: string;
    datetime: string; // ISO string
    fare?: number;
    status: string;
}
export function Trip({ item }: { item: Trip }) {
    return (
        <View style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            marginBottom: 12,
            backgroundColor: '#FFF',
            justifyContent: "space-between",
            flexDirection: "row",
            height: 100,
            flex: 1,
        }}>
           
            <View style={{ flexDirection: 'row', width: 220 }}>
                <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", marginRight:4}}>
                    <IconPointFilled size={20} fill={colors.green.base} />
                    <VerticalDashedLine height={28} width={4} color='#aaa'/>
                    <IconMapPinFilled size={15} fill={colors.green.base}/>
                </View>

                <View  style={{ flexDirection: "column", justifyContent:"space-between"}}>
                    <View>
                    <Text style={styles.regular}> {new Date(item.datetime).toLocaleString()} </Text>
                    <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600] }}>{item.origin}</Text>
                    </View>
                    
                    <View>
                    <Text style={styles.regular}> {new Date(item.datetime).toLocaleString()}</Text>
                    <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600] }}>{item.destination}</Text>
                    </View>
                </View> 
            </View>
               
            <View style={{ flexDirection: "row", width:90 }}>
                <View style={styles.verticalBar} />
                <View style={{ flexDirection: "column", justifyContent:"space-between" }}>
                    <Text style={styles.regular}>
                        Valor: {`\n`}
                        {item.fare !== undefined &&
                            <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600] }}>
                                ${item.fare.toFixed(2)}
                            </Text>}
                    </Text>
                    <Text style={styles.regular}>Status: {`\n`}
                        <Text style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600] }}>{item.status}</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    verticalBar: {
        height: 80, width: 2, backgroundColor: colors.green.soft, marginRight:10
    },
    regular:{
        fontSize: 11
    }
});
