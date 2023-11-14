export class SocketRepository {

    connections: Map<string, string>;

    constructor() {
        this.connections = new Map<string, string>();
    }

    addMapping(socketID: string, userID: string) {
        this.connections.set(socketID, userID);
    }

    getSessionID(socketID: string) {
        return this.connections.get(socketID);
    }

    updateMapping(socketID: string, userID: string) {
        this.connections.set(socketID, userID);
    }

    deleteMapping(socketID: string) {
        this.connections.delete(socketID);
    }

}