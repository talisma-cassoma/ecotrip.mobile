import { DriverInfo, AuthUser } from "@/types";

const DABASE_NAME = '@ecotrip';

const COLECTION_USERS = `${DABASE_NAME}:user`;
const COLECTION_RIDES = `${DABASE_NAME}:ride`;

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