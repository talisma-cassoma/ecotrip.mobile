// Authentication Constants
export const COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh_token";
export const COOKIE_MAX_AGE = 20; // 20 seconds
export const JWT_EXPIRATION_TIME = "20s"; // 20 seconds
export const REFRESH_TOKEN_EXPIRY = "30d"; // 30 days
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

import { socketUrl } from "@/services/api"
export const constants = {
    socketUrl: socketUrl,
    socketNamespaces: {
        room: 'room',
        lobby: 'lobby'
    },
    event: {
        USER_CONNECTED: 'userConnection',
        USER_DISCONNECTED: 'userDisconnection',

        JOIN_ROOM: 'joinRoom',
        LOBBY_UPDATED: 'lobbyUpdated',
        UPDATE_ROOM: 'updateRoom',

        //Atualizações específicas de trip rooms
        SELECT_DRIVER: 'selectDriver',

        TRIP_CREATED: 'tripCreated',
        TRIP_ACCEPTED: 'tripAccepted',
        TRIP_CANCELED: 'tripCanceled',
    },

    oauth: {
        // Google OAuth Constants
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
        GOOGLE_REDIRECT_URI: `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/callback`,
        GOOGLE_AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth",

        // Apple OAuth Constants
        APPLE_CLIENT_ID: "com.beto.expoauthexample.web",
        APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET!,
        APPLE_REDIRECT_URI: `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/apple/callback`,
        APPLE_AUTH_URL: "https://appleid.apple.com/auth/authorize",

        // Environment Constants
        BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
        APP_SCHEME: process.env.EXPO_PUBLIC_SCHEME,
        JWT_SECRET: process.env.JWT_SECRET!,

        // Cookie Settings
        COOKIE_OPTIONS: {
            httpOnly: true,
            secure: true,
            sameSite: "Lax" as const,
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        },

        REFRESH_COOKIE_OPTIONS: {
            httpOnly: true,
            secure: true,
            sameSite: "Lax" as const,
            path: "/api/auth/refresh", // Restrict to refresh endpoint only
            maxAge: REFRESH_TOKEN_MAX_AGE,
        }
    },

    maps:{
        GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY
    }

}

