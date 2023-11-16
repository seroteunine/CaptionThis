import { Room } from '../room';

//Mock variables
const roomID = 'AB12'
const hostID = 'ABCD1234'


test('New room can be made with host, where game is empty.', () => {
    const room = new Room(roomID, hostID);

    let host = room.getHostID();

    expect(host).toBe(hostID);
    expect(room.game).toBe(undefined);
});

test('Players can be added to the room', () => {
    const room = new Room(roomID, hostID);

    room.addPlayer('qwer1234');

    expect(room.getPlayers()).toStrictEqual(['qwer1234']);
});

test('Game can not be started with 2 people', () => {
    const room = new Room(roomID, hostID);

    room.addPlayer('111');
    room.addPlayer('222');

    room.startGame();

    expect(room.game).toBe(undefined);
})

test('Game can not be started with 9 people', () => {
    const room = new Room(roomID, hostID);

    room.addPlayer('111');
    room.addPlayer('222');
    room.addPlayer('333');
    room.addPlayer('444');
    room.addPlayer('555');
    room.addPlayer('666');
    room.addPlayer('777');
    room.addPlayer('888');
    room.addPlayer('999');

    room.startGame();

    expect(room.game).toBe(undefined);
})

test('Game CAN be started with 5 people', () => {
    const room = new Room(roomID, hostID);

    room.addPlayer('111');
    room.addPlayer('222');
    room.addPlayer('333');
    room.addPlayer('444');
    room.addPlayer('555');

    room.startGame();

    expect(room.game).toBeDefined();
})