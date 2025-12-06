import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fontFamily } from "@/styles/theme"
import { Button } from '@/components/button';
import { IconArrowLeft } from "@tabler/icons-react-native"
import { router } from "expo-router"



export default function Agreements() {
    return (
        <View style={styles.container}>
            <Button style={{ width: 40, height: 40, marginBottom: 40 }} onPress={() => router.back()}>
                <Button.Icon icon={IconArrowLeft} />
            </Button>

            <Text style={styles.title}>Términos E Condiciones</Text>
                <ScrollView
                    style={{ flex: 1, padding: 24, backgroundColor: "white", flexDirection:"column", columnGap:10 }}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
                >

                    <Text>Fecha de entrada en vigor: xxxxx</Text>

                    <Text>
                        1. Aceptación de los términos

                        Al acceder y utilizar la aplicación EcoTrip, el usuario acepta plenamente estos Términos de Uso, así como cualquier modificación futura. Si no está de acuerdo con ellos, debe abstenerse de utilizar la plataforma.

                        ---
                    </Text>
                    <Text>
                        2. Descripción del servicio

                        EcoTrip es una plataforma digital que conecta pasajeros con conductores independientes para facilitar servicios de transporte urbano e interurbano. EcoTrip no presta directamente servicios de transporte, sino que actúa como intermediario tecnológico.
                        ---
                    </Text>
                    <Text>
                        3. Registro y acceso

                        Para utilizar la plataforma, los usuarios deben registrarse con información veraz, actualizada y completa.

                        EcoTrip se reserva el derecho de suspender o cancelar cuentas que incumplan los presentes términos.

                        Los conductores deberán cumplir requisitos adicionales como: licencia de conducir válida, documentos del vehículo, y aceptación del acuerdo de conductor.
                        ---
                    </Text>
                    <Text>
                        4. Condiciones de uso

                        El usuario se compromete a utilizar la plataforma de manera legal, ética y segura.

                        Está prohibido manipular el sistema, cometer fraudes, acosar a otros usuarios o realizar usos indebidos de la aplicación.

                        El incumplimiento de estas reglas puede conllevar la suspensión o eliminación de la cuenta, sin derecho a indemnización.

                        ---
                    </Text>
                    <Text>
                        5. Negociación del precio

                        El precio del trayecto se negocia libremente entre el pasajero y el conductor antes de iniciar el viaje.

                        EcoTrip no establece tarifas fijas ni garantiza precios mínimos o máximos.

                        Cualquier disputa sobre el precio acordado deberá ser resuelta directamente entre las partes, salvo que se demuestre mala fe o fraude.



                        ---
                    </Text>
                    <Text>
                        6. Pagos y comisiones

                        El pago se puede realizar en efectivo o por medios electrónicos (si están habilitados).

                        EcoTrip podrá aplicar una comisión al conductor por el uso de la plataforma, previamente informada.

                        Las tarifas o promociones pueden variar sin previo aviso.



                        ---
                    </Text>
                    <Text>
                        7. Cancelaciones

                        Los pasajeros pueden cancelar el trayecto antes de que el conductor esté en camino sin penalización.

                        Las cancelaciones injustificadas, repetitivas o de último momento pueden conllevar sanciones temporales.



                        ---
                    </Text>
                    <Text>
                        8. Responsabilidad

                        EcoTrip no es responsable por retrasos, accidentes, pérdidas o conflictos durante el viaje.

                        Los conductores son independientes, no empleados, y son plenamente responsables por su comportamiento y el estado de su vehículo.

                        EcoTrip no garantiza la disponibilidad del servicio en todo momento.



                        ---
                    </Text>
                    <Text>
                        9. Protección de datos

                        EcoTrip recopila, utiliza y protege los datos personales conforme a su Política de Privacidad.

                        El usuario acepta el tratamiento de sus datos para el funcionamiento de la plataforma y mejora del servicio.



                        ---
                    </Text>
                    <Text>
                        10. Modificaciones

                        EcoTrip podrá modificar estos Términos de Uso en cualquier momento. Las nuevas versiones se comunicarán a través de la aplicación o el sitio web. El uso continuado tras una modificación implica la aceptación de los nuevos términos.


                        ---
                    </Text>
                    <Text>
                        11. Legislación aplicable

                        Estos términos se rigen por las leyes de Guinea Ecuatorial. En caso de conflicto, las partes se someten a los tribunales competentes del país.


                        ---
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
