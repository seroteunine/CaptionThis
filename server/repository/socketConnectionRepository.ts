export class SessionRepository {

    connections: Map<string, string>;

    constructor() {
        this.connections = new Map<string, string>();
    }

    addMapping(sessionID: string, socketID: string) {
        this.connections.set(sessionID, socketID);
    }

    getSocketID(sessionID: string) {
        return this.connections.get(sessionID);
    }

}