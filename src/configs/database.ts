const DABASE_NAME = '@ecotrip';

const COLECTION_USERS = `${DABASE_NAME}:user`;
const COLECTION_RIDES = `${DABASE_NAME}:ride`;


type PassengerRole = {
    type: 'passenger';
};

type DriverRole = {
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

interface AuthUser {
    id?: string
    name: string;
    email: string;
    image?: string;
    telephone?: string;
    role: UserRole;
    access_token?: string;
    refresh_token?: string;
};

type DriverInfo = {
    car_model: string;
    car_plate: string;
    car_color: string;
    license_number: string;
    rating?: number
    complited_rides?: number
};

function buildStoredUser({
    name,
    email,
    image,
    telephone,
    access_token,
    refresh_token,
    role,
    driverData,
}: {
    id?: string;
    name: string;
    email: string;
    image?: string;
    telephone?: string;
    access_token: string;
    refresh_token: string;
    role: 'passenger' | 'driver';
    driverData?: DriverInfo;
}): AuthUser {
    const base = {
        name,
        email,
        image,
        telephone,
        access_token,
        refresh_token,
    };

    if (role === 'driver' && driverData) {
        return {
            ...base,
            role: {
                type: 'driver',
                data: driverData,
            },
        };
    }

    return {
        ...base,
        role: { type: 'passenger' },
    };
}


export {
    COLECTION_USERS,
    COLECTION_RIDES,
    buildStoredUser,
    AuthUser
}