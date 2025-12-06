import { DriverInfo, AuthUser } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DABASE_NAME = '@ecotrip';

const COLLECTION_USERS = `${DABASE_NAME}:user`;
const COLLECTION_RIDES = `${DABASE_NAME}:ride`;

async function storeUser({
    id,
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
}): Promise<AuthUser> {
    const base = {
        id,
        name,
        email,
        image,
        telephone,
        access_token,
        refresh_token,
    };

    let newUser: AuthUser;

    if (role === 'driver' && driverData) {
        newUser = {
            ...base,
            role: {
                type: 'driver',
                data: driverData,
            },
        };
    } else {
        newUser = {
            ...base,
            role: { type: 'passenger' },
        };
    }

    console.log("💾 Saving user to AsyncStorage:", newUser);
    try {
        await AsyncStorage.setItem(COLLECTION_USERS, JSON.stringify(newUser));
        console.log("✅ User saved successfully");
        return newUser;
    } catch (error) {
        console.error("❌ Error saving user:", error);
        throw error;
    }
}

export {
    COLLECTION_USERS,
    COLLECTION_RIDES,
    storeUser,
}