export type LocationPoint = {
    name: string;
    location: {
        lat: number;
        lng: number;
    };
};

export type TripStatus = "requested" | "offered" | "accepted" | "in_progress" | "completed" | "cancelled";


type PassengerRole = {
    type: 'passenger';
};

export type DriverRole = {
    type: 'driver';
    data: {
        car_model: string;
        car_plate: string;
        car_color: string;
        license_number: string;
        rating?: number
        complited_rides?: number
    };
};

type UserRole = PassengerRole | DriverRole;

export interface AuthUser {
    id?: string
    socketId?: string
    name: string;
    email: string;
    image?: string;
    telephone?: string;
    role: UserRole;
    access_token?: string;
    refresh_token?: string;
};

export type DriverInfo = {
    car_model: string;
    car_plate: string;
    car_color: string;
    license_number: string;
    rating?: number
    complited_rides?: number
};

export interface TripRequestProps {
    id?: string;
    status?: TripStatus;
    owner?: AuthUser;
    users?: Set<AuthUser>;
    assignedDriver?: AuthUser | null;        
    distance: number;
    duration: number;
    price: number;
    directions?: {};
    created_at?: Date | string;
    updated_at?: Date | string;
    origin?: {
        name: String;
        location?: {
            lat: number;
            lng: number;
        }
    };
    destination?: {
        name: String;
        location?: {
            lat: number;
            lng: number;
        }
    },
}

export type PlaceProps = {
  id: string
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

export interface AvailableDriverProps {
  id: string,
  email: string
  name: string
  image: string
  telephone: string
  isSelected?: boolean,
  car_model?: string
  car_plate?: string
  car_color?: string,
  rating?: number
  complited_rides?: number
}


