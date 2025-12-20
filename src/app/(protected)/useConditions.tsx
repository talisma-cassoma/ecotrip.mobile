import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fontFamily } from "@/styles/theme"
import { Button } from '@/components/button';
import { IconArrowLeft } from "@tabler/icons-react-native"
import { router } from "expo-router"


export default function useConditions() {
    return (
        <View style={styles.container}>
            <Button style={{ width: 40, height: 40, marginBottom: 40 }} onPress={() => router.back()}>
                <Button.Icon icon={IconArrowLeft} />
            </Button>
            <Text style={styles.title}> Términos de uso – Generales</Text>
            <ScrollView
                style={{ flex: 1, padding: 24, backgroundColor: "white" }}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
            >



                <Text>
                    1. Definiciones

                    EcoTrip: plataforma digital de movilidad.

                    Usuario: persona que usa la aplicación (pasajero o conductor).

                    Trayecto: viaje solicitado mediante la app.

                    Precio acordado: tarifa negociada entre pasajero y conductor.
                </Text>
                <Text>

                    2. Objeto del contrato

                    EcoTrip permite conectar conductores y pasajeros para la realización de trayectos urbanos e interurbanos. La plataforma actúa como intermediaria, sin participar en la ejecución del servicio de transporte.
                </Text>
                <Text>
                    3. Aceptación
                </Text>
                <Text>
                    El uso de EcoTrip implica la aceptación plena de estos términos. Si el usuario no está de acuerdo, debe abstenerse de utilizar la aplicación.
                </Text>
                <Text>
                    4. Registro

                    Los usuarios deben proporcionar datos reales y mantenerlos actualizados.

                    No se permite el uso de información falsa o de terceros.

                    Los conductores deben cumplir requisitos legales y de seguridad.

                </Text>
                <Text>
                    5. Fijación de precios

                    El pasajero propone una tarifa, que el conductor puede aceptar o negociar.

                    El precio final es acordado directamente por ambas partes.

                </Text>
                <Text>
                    6. Pagos y comisiones

                    El pago se efectúa directamente entre pasajero y conductor.

                    EcoTrip puede aplicar una comisión sobre el precio acordado.
                </Text>
                <Text>

                    7. Responsabilidad

                    EcoTrip no se responsabiliza por incidentes durante el trayecto.

                    Conductores y pasajeros son responsables de su comportamiento y cumplimiento legal.
                </Text>
                <Text>

                    8. Cancelaciones

                    Cancelaciones anticipadas no generan penalización.

                    Cancelaciones tardías pueden conllevar sanciones.

                </Text>

                <Text>
                    9. Privacidad

                    Los datos personales se recogen, almacenan y procesan conforme a la legislación vigente.

                    La información no será compartida con terceros sin consentimiento, salvo obligación legal.

                </Text>

                <Text>
                    10. Cambios en los términos

                    EcoTrip puede modificar estos términos en cualquier momento. El uso continuado implica la aceptación de las modificaciones.
                </Text>

                <Text>
                    11. Jurisdicción

                    Estos términos se rigen por las leyes de Guinea Ecuatorial. Cualquier controversia será resuelta ante los tribunales locales.


                    
                </Text>

                <Text>
                    Términos de uso – conductores
                </Text>

                <Text>
                    1. Requisitos para conducir

                    Licencia de conducir válida.

                    Documentación del vehículo en regla.

                    Certificado de Antecedentes penales.

                    Cumplimiento de normas locales de transporte.

                </Text>

                <Text>
                    2. Obligaciones del conductor

                    Asegurar un trato respetuoso a los pasajeros.

                    Mantener el vehículo limpio y en buen estado.

                    Respetar el precio acordado sin imposiciones adicionales.
                </Text>

                <Text>

                    3. Comisión de EcoTrip

                    EcoTrip retiene una comisión predeterminada sobre cada trayecto completado. Esta se descuenta automáticamente del saldo en la cuenta ecotrip del conductor.
                </Text>

                <Text>
                    4. Sanciones y suspensión

                    EcoTrip se reserva el derecho de suspender temporal o permanentemente a cualquier conductor por:

                    Incumplimiento de los requisitos legales o técnicos.

                    Conducta inapropiada.

                    Reiteradas cancelaciones o faltas de puntualidad.

                </Text>

                <Text>
                    5. Evaluaciones

                    Cada conductor puede ser evaluado por los pasajeros. Un promedio bajo reiterado puede derivar en suspensión de la cuenta.
                </Text>

                <Text>
                    6. Soporte

                    Los conductores tienen derecho a contactar al equipo de soporte de EcoTrip para resolver incidencias, recibir formación o hacer sugerencias de mejora.
                </Text>
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
