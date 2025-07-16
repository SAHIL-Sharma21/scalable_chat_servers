import {describe, test} from 'bun:test';

const BACKEND_URL = "ws://localhost:8080"

describe("Chat application" , () => {
    test("Message sent form room 1 reaches another participant in room 1", () => {
        // create 2 ws connection
        const ws1 = new WebSocket(BACKEND_URL)
        const ws2 = new WebSocket(BACKEND_URL);

        // make sure the socktes are connected.


        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }));

        ws2.send(JSON.stringify({
            type:"join-room",
            room: "Room 1"
        }));

        

    });
})