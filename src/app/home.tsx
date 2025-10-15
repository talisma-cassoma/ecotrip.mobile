import { useEffect, useState, useRef } from "react"
import { View, Alert, Text } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"

import { router } from "expo-router"

import { api } from "@/services/api"
import { fontFamily, colors } from "@/styles/theme"

import { RideModal } from "@/components/rideModal"
import { PlaceProps } from "@/components/place"
import { Categories, CategoriesProps } from "@/components/categories"
import { useTrip } from "@/context/tripContext"
import { DropDownMenu } from "@/components/dropDownMenu"
import { MapDirections } from "@/components/mapDirections"


type RidesProps = PlaceProps & {
  latitude: number
  longitude: number
  categoryId: string
  name: string
  description: string
  coupons: number
  address: string
  phone: string
  cover: string
}

const mockRides: RidesProps[] = [
  // ALIMENTAÇÃO
  {
    id: "012576ea-4441-4b8a-89e5-d5f32104c7c4",
    categoryId: "146b1a88-b3d3-4232-8b8f-c1f006f1e86d",
    name: "Sabor Grill",
    // Descrição em espanhol
    description:
      "Churrasquería con cortes nobles y buffet variado. Experiencia completa para los amantes de la carne.",
    // Localização: Malabo
    latitude: 3.7500,
    longitude: 8.7833,
    coupons: 10,
    address: "Malabo", // Endereço original mantido
    phone: "(11) 94567-1212",
    cover:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300",
  },
  {
    id: "2bc11e34-5f30-4ba0-90fa-c1c98f649281",
    categoryId: "146b1a88-b3d3-4232-8b8f-c1f006f1e86d",
    name: "Café Central",
    description:
      "Café acogedor con opciones de bocadillos y bebidas artesanales. Perfecto para una pausa.",
    // Localização: Bata
    latitude: 1.8639,
    longitude: 9.7656,
    coupons: 10,
    address: "Bata",
    phone: "(12) 3456-7890",
    cover:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300",
  },
  {
    id: "4197b830-aa9c-40d4-a22e-c05043588a77",
    categoryId: "146b1a88-b3d3-4232-8b8f-c1f006f1e86d",
    name: "Burguer Up",
    description:
      "Hamburguesas gourmet preparadas al momento. Ingredientes frescos y combinaciones únicas.",
    // Localização: Luba
    latitude: 3.4597,
    longitude: 8.5500,
    coupons: 10,
    address: "Luba",
    phone: "(13) 98765-4321",
    cover:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=300",
  },
  {
    id: "4209c72f-9d14-410c-91af-c24d08f177cc",
    categoryId: "146b1a88-b3d3-4232-8b8f-c1f006f1e86d",
    name: "Doce & Delícia",
    description:
      "Confitería con dulces y postres increíbles. Pastel de vitrina y especialidades artesanales.",
    // Localização: Ebebiyín
    latitude: 2.1514,
    longitude: 11.3167,
    coupons: 10,
    address: "Ebebiyín",
    phone: "(14) 2345-6789",
    cover:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300",
  },
  {
    id: "4e6dd864-f04a-4711-9db2-e5624fd32b8e",
    categoryId: "146b1a88-b3d3-4232-8b8f-c1f006f1e86d",
    name: "Verde Vida",
    description:
      "Restaurante vegano con platos saludables y sabrosos. Comida natural en un ambiente acogedor.",
    // Localização: Mongomo
    latitude: 1.9200,
    longitude: 11.3167,
    coupons: 10,
    address: "Mongomo",
    phone: "(15) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300",
  },
  // COMPRAS
  {
    id: "6dbf1cd5-c20a-4e6a-bc9a-a26069825d2c",
    categoryId: "52e81585-f71a-44cd-8bd0-49771e45da44",
    name: "Loja Nova",
    description:
      "Ropa y accesorios modernos para el día a día. Estilo casual con excelentes precios.",
    // Localização: San Antonio de Palé (Annobón)
    latitude: -1.4033,
    longitude: 5.6322,
    coupons: 10,
    address: "San Antonio de Palé (Annobón)",
    phone: "(16) 3456-7890",
    cover:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=300",
  },
  {
    id: "756b1d53-cc5b-4995-8ebd-8eee3dae01af",
    categoryId: "52e81585-f71a-44cd-8bd0-49771e45da44",
    name: "Tech Plus",
    description:
      "Tienda de electrónicos con productos de última generación. Gadgets y accesorios para todos.",
    // Localização: Malabo (Ciclando na lista)
    latitude: 3.7500,
    longitude: 8.7833,
    coupons: 10,
    address: "Malabo",
    phone: "(17) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300",
  },
  {
    id: "77a5d5eb-bcfa-4457-916d-a5b6fe7aa183",
    categoryId: "52e81585-f71a-44cd-8bd0-49771e45da44",
    name: "Casa Luxo",
    description:
      "Decoración sofisticada para hogar y oficina. Productos exclusivos para ambientes elegantes.",
    // Localização: Bata
    latitude: 1.8639,
    longitude: 9.7656,
    coupons: 10,
    address: "Bata",
    phone: "(18) 2345-6789",
    cover:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300",
  },
  {
    id: "78806cca-cfb0-45bc-8dc3-c57a42f0da01",
    categoryId: "52e81585-f71a-44cd-8bd0-49771e45da44",
    name: "BookMart",
    description:
      "Librería especializada en best-sellers y clásicos. Espacio acogedor para la lectura.",
    // Localização: Luba
    latitude: 3.4597,
    longitude: 8.5500,
    coupons: 10,
    address: "Luba",
    phone: "(19) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300",
  },
  {
    id: "78ced7b1-436b-42ca-9c66-747f2b671321",
    categoryId: "52e81585-f71a-44cd-8bd0-49771e45da44",
    name: "Green Market",
    description:
      "Productos orgánicos y saludables para tu día a día. Alimentos frescos y sostenibles.",
    // Localização: Ebebiyín
    latitude: 2.1514,
    longitude: 11.3167,
    coupons: 10,
    address: "Ebebiyín",
    phone: "(11) 8765-4321",
    cover:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=300",
  },
  // HOSPEDAGEM
  {
    id: "7be85f5b-533f-4974-8c9e-75cae740041c",
    categoryId: "57d6e5ff-35f6-4d21-a521-84f23d511d25",
    name: "Hotel Céu Azul",
    description:
      "Hotel moderno con habitaciones acogedoras. Ideal para relajarse.",
    // Localização: Mongomo
    latitude: 1.9200,
    longitude: 11.3167,
    coupons: 10,
    address: "Mongomo",
    phone: "(12) 1234-5678",
    cover:
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=400&h=300",
  },
  {
    id: "806c7934-037b-4dcd-99bb-c0fc6f2c5a45",
    categoryId: "57d6e5ff-35f6-4d21-a521-84f23d511d25",
    name: "Casa Serena",
    description:
      "Posada encantadora en el corazón de la ciudad, con ambiente tranquilo y servicio personalizado.",
    // Localização: San Antonio de Palé (Annobón)
    latitude: -1.4033,
    longitude: 5.6322,
    coupons: 10,
    address: "San Antonio de Palé (Annobón)",
    phone: "(13) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300",
  },
  {
    id: "8cf0433e-68de-4c2a-9fff-c0c2941ec521",
    categoryId: "57d6e5ff-35f6-4d21-a521-84f23d511d25",
    name: "Suites Urban",
    description:
      "Alojamientos sofisticados en el centro de la ciudad. Perfecto para viajes de negocios o placer.",
    // Localização: Malabo (Ciclando)
    latitude: 3.7500,
    longitude: 8.7833,
    coupons: 10,
    address: "Malabo",
    phone: "(14) 2345-6789",
    cover:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300",
  },
  {
    id: "b2c3014d-64bd-4c01-95e9-7f408e12ff6f",
    categoryId: "57d6e5ff-35f6-4d21-a521-84f23d511d25",
    name: "Villa Encanto",
    description:
      "Chalets rústicos en una zona tranquila. Experiencia de alojamiento exclusiva con total privacidad.",
    // Localização: Bata
    latitude: 1.8639,
    longitude: 9.7656,
    coupons: 10,
    address: "Bata",
    phone: "(15) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300",
  },
  {
    id: "b3a4dab2-1b83-4015-ba95-22f5770c6108",
    categoryId: "57d6e5ff-35f6-4d21-a521-84f23d511d25",
    name: "Estalagem Real",
    description:
      "Hotel boutique con diseño clásico y atención de excelencia. Una estancia lujosa y confortable.",
    // Localização: Luba
    latitude: 3.4597,
    longitude: 8.5500,
    coupons: 10,
    address: "Luba",
    phone: "(16) 3456-7890",
    cover:
      "https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=400&h=300",
  },
  // CINEMA
  {
    id: "bde73364-95c5-46e4-8084-79a7ca3824c4",
    categoryId: "826910d4-187d-4c15-88f4-382b7e056739",
    name: "CineStar",
    description:
      "Cine moderno con salas cómodas y tecnología de última generación.",
    // Localização: Ebebiyín
    latitude: 2.1514,
    longitude: 11.3167,
    coupons: 10,
    address: "Ebebiyín",
    phone: "(17) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300",
  },
  {
    id: "c5271f4e-6058-4eda-8b08-0e7fb0b73a0d",
    categoryId: "826910d4-187d-4c15-88f4-382b7e056739",
    name: "MovieLand",
    description:
      "Espacio cultural con una selección variada de películas y festivales exclusivos.",
    // Localização: Mongomo
    latitude: 1.9200,
    longitude: 11.3167,
    coupons: 10,
    address: "Mongomo",
    phone: "(11) 2345-6789",
    cover:
      "https://images.unsplash.com/photo-1497493292307-31c376b6e479?w=400&h=300",
  },
  {
    id: "d21b8cad-8d01-4ffd-8117-a34d613cdcf5",
    categoryId: "826910d4-187d-4c15-88f4-382b7e056739",
    name: "TelaMax",
    description:
      "Cine de barrio con atmósfera acogedora y opciones de películas clásicas y estrenos.",
    // Localização: San Antonio de Palé (Annobón)
    latitude: -1.4033,
    longitude: 5.6322,
    coupons: 10,
    address: "San Antonio de Palé (Annobón)",
    phone: "(19) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300",
  },
  // PADARIA
  {
    id: "def71683-e89f-4c3b-a652-868a02f54ae9",
    categoryId: "abce52cf-b33b-4b3c-8972-eb72c66c83e4",
    name: "Grão Dourado",
    description:
      "Famosa por sus croissants y panes de fermentación natural.",
    // Localização: Malabo (Ciclando)
    latitude: 3.7500,
    longitude: 8.7833,
    coupons: 10,
    address: "Malabo",
    phone: "(11) 5432-1098",
    cover:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300",
  },
  {
    id: "e4949574-a579-4b07-a005-3fc4b7339752",
    categoryId: "abce52cf-b33b-4b3c-8972-eb72c66c83e4",
    name: "Pão & Cia",
    description:
      "Panadería artesanal con panes frescos y delicias caseras todos los días.",
    // Localização: Bata
    latitude: 1.8639,
    longitude: 9.7656,
    coupons: 10,
    address: "Bata",
    phone: "(11) 8765-4321",
    cover:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=300",
  },
  {
    id: "ea097b60-d0fb-41aa-ad44-a7ed850c9ecd",
    categoryId: "abce52cf-b33b-4b3c-8972-eb72c66c83e4",
    name: "Doce Massa",
    description:
      "Especializada en dulces y salados, con opciones de desayuno completo.",
    // Localização: Luba
    latitude: 3.4597,
    longitude: 8.5500,
    coupons: 10,
    address: "Luba",
    phone: "(11) 1234-5678",
    cover:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300",
  },
  {
    id: "ebfecf67-fe4d-4137-90f0-b7083fd58da1",
    categoryId: "abce52cf-b33b-4b3c-8972-eb72c66c83e4",
    name: "Padaria da cidade",
    description:
      "Panadería de barrio con panes rústicos y tradicionales horneados al momento.",
    // Localização: Ebebiyín
    latitude: 2.1514,
    longitude: 11.3167,
    coupons: 10,
    address: "Ebebiyín",
    phone: "(11) 9876-5432",
    cover:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300",
  },
]
const mockCategories: CategoriesProps = [
  { id: "146b1a88-b3d3-4232-8b8f-c1f006f1e86d", name: "Alimentación" },
  { id: "52e81585-f71a-44cd-8bd0-49771e45da44", name: "Compras" },
  { id: "57d6e5ff-35f6-4d21-a521-84f23d511d25", name: "Alojamiento" },
  { id: "826910d4-187d-4c15-88f4-382b7e056739", name: "Cine" },
  { id: "abce52cf-b33b-4b3c-8972-eb72c66c83e4", name: "Panadería" },
]
const whiteMapStyle = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e9e9e9"
      },
      {
        "lightness": 17
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "lightness": 17
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "lightness": 29
      },
      {
        "weight": 0.2
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "lightness": 18
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "lightness": 16
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      },
      {
        "lightness": 21
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dedede"
      },
      {
        "lightness": 21
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#ffffff"
      },
      {
        "lightness": 16
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "saturation": 36
      },
      {
        "color": "#333333"
      },
      {
        "lightness": 40
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f2f2f2"
      },
      {
        "lightness": 19
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#fefefe"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#fefefe"
      },
      {
        "lightness": 17
      },
      {
        "weight": 1.2
      }
    ]
  }
]

export default function Home() {
  const mapRef = useRef<MapView>(null)

  const [categories, setCategories] = useState<CategoriesProps>(mockCategories)
  const [category, setCategory] = useState("")
  const [rides, setRides] = useState<RidesProps[]>([])

  const { originCoords, destinationCoords, setDistance, setDuration } = useTrip();


  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories")
      setCategories(data)
      setCategory(data[0].id)
    } catch (error) {
      console.log(error)
      Alert.alert("Categorias", "Não foi possível carregar as categorias.")
    }
  }

  async function fetchRides() {
    try {
      if (!category) return
      // const { data } = await api.get("/rides/category/" + category)
      // setRides(data)

      // Simulando a filtragem de rides com base na categoria
      const filteredRides = mockRides.filter(ride => ride.categoryId == category);
      setRides(filteredRides);

    } catch (error) {
      console.log(error)
      Alert.alert("Locais", "Não foi possível carregar os locais.")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchRides()
  }, [category])

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
        <Categories
          data={categories}
          onSelect={setCategory}
          selected={category}
        />

        <DropDownMenu />
        <MapView
          ref={mapRef}
          customMapStyle={whiteMapStyle}
          provider={PROVIDER_GOOGLE}
          zoomControlEnabled={true}
          zoomEnabled={true}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 1.8575468799281134,
            longitude: 9.773508861048843,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            identifier="current"
            coordinate={{
              latitude: 1.8575468799281134,
              longitude: 9.773508861048843
            }}
          // image={require("@/assets/location.png")}
          />

          {rides.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              image={require("@/assets/pin.png")}
            >
              <Callout>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.gray[600],
                      fontFamily: fontFamily.medium,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.gray[600],
                      fontFamily: fontFamily.regular,
                    }}
                  >
                    {item.address}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {originCoords?.latitude && destinationCoords?.latitude && (
            <>
              <MapDirections
              />
              <Marker
                key={`origin-${originCoords.latitude}-${originCoords.longitude}`}
                coordinate={{
                  latitude: originCoords.latitude,
                  longitude: originCoords.longitude
                }}
                image={require("@/assets/location.png")}
                title="Starting Point"
              />
              <Marker
                key={`destination-${destinationCoords.latitude}-${destinationCoords.longitude}`}
                coordinate={{
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude
                }}
                image={require("@/assets/pin.png")}
                title="Destination Point"
              />
            </>
          )}
        </MapView>

        <RideModal data={rides} />
      </View>
    </>
  )
}
