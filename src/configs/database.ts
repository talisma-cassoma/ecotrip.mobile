import { DriverInfo, AuthUser } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DABASE_NAME = '@ecotrip';

const COLLECTION_USERS = `${DABASE_NAME}:user`;
const COLLECTION_RIDES = `${DABASE_NAME}:ride`;

async function storeUser(userData: AuthUser): Promise<AuthUser> {
    const { id, name, email, image, telephone, access_token, refresh_token, role } = userData;
    
    const base = {
        id,
        name,
        email,
        image,
        telephone,
        access_token: access_token || '',
        refresh_token: refresh_token || '',
    };

    let newUser: AuthUser;

    if (role.type === 'driver' && role.data) {
        newUser = {
            ...base,
            role: {
                type: 'driver',
                data: role.data,
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
};
