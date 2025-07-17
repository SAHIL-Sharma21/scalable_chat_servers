import { WebSocketServer, WebSocket as WebSockeWsType } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface Room {
  sockets: WebSockeWsType[];
}

const rooms: Record<string, Room> = {};

// pass the message to the relayer
const RELAYED_URL = 'ws://localhost:4001';
const relayerSocket = new WebSocket(RELAYED_URL);

relayerSocket.onmessage = ({data}) => {
    const parsedData = JSON.parse(data);
    // if user chat then we will forward the message in the room
    if (parsedData.type === "chat") {
      const room = parsedData.room;
      rooms[room].sockets.map((socket) => socket.send(data));
    }
}

wss.on("connection", function connection(ws) {
  ws.on("error", (err) => {
    console.error("Error: ", err);
  });

  ws.on("message", (data: string) => {
         // parsing the data as ws send the data in string or binary
    const parsedData = JSON.parse(data);

    if (parsedData.type === "join-room") {
      const room = parsedData.room;
      if (!rooms[room]) {
        rooms[room] = {
          sockets: [],
        };
      }

      rooms[room].sockets.push(ws);
    }

    // this chat only then if forwards to the relayer server.
    if(parsedData.type === "chat"){
      relayerSocket.send(data);
    }
  });
});
