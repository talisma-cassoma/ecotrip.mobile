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
        //Atualizações específicas de trip rooms
        SELECT_DRIVER: 'selectDriver',

        TRIP_CREATED: 'tripCreated',
        TRIP_ACCEPTED: 'tripAccepted',
        TRIP_CANCELED: 'tripCanceled',
    }
}
