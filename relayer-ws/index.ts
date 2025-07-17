/**
 * Relayer websocket server in which our 2 webseockets connection are connected 
 * and data from onw ws can be passed to another ws server
 */

import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 4001 });

// server
const servers: WebSocket[] = [];


wss.on("connection", function connection(ws) {
  ws.on("error", (err) => {
    console.error("Error: ", err);
  });
  // new connection then push to servers;
  servers.push(ws);

  ws.on("message", (data: string) => {
    servers.filter(sockets => sockets != ws).map(socket => {
        socket.send(data);
    })
  })

});
