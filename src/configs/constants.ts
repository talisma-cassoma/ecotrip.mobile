import { socketUrl } from "@/services/api"

export const constants = {
    socketUrl: socketUrl,
    socketNamespaces: {
        room: 'room',
        lobby: 'lobby'
    },
    events: {
        USER_CONNECTED: 'userConnection',
        USER_DISCONNECTED: 'userDisconnection',

        JOIN_ROOM: 'joinRoom',
        LOBBY_UPDATED: 'lobbyUpdated',
        //Atualizações específicas de trip rooms
        SELECT_DRIVER:'selectDriver',
        LEAVE_ROOM:'leaveRoom',
    }
}
