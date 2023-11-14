export class SessionRepository {

    connections: Map<string, string>;

    constructor() {
        this.connections = new Map<string, string>();
    }

    addMapping(sessionID: string, userID: string) {
        this.connections.set(sessionID, userID);
    }

    getSessionID(sessionID: string) {
        return this.connections.get(sessionID);
    }

    updateMapping(sessionID: string, userID: string) {
        this.connections.set(sessionID, userID);
    }

    deleteMapping(sessionID: string) {
        this.connections.delete(sessionID);
    }

}