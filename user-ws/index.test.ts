import { describe, expect, test } from "bun:test";

const BACKEND_URL = "ws://localhost:8080";

describe("Chat application", () => {
  test("Message sent form room 1 reaches another participant in room 1", async () => {
    // create 2 ws connection
    const ws1 = new WebSocket(BACKEND_URL);
    const ws2 = new WebSocket(BACKEND_URL);

    // make sure the socktes are connected.  we can achieve this by using promise, its like pausing the thread and then pasing the control
    await new Promise<void>((resolve) => {
      let count = 0;
      ws1.onopen = () => {
        count++;
        if (count === 2) {
          resolve();
        }
      };
      ws2.onopen = () => {
        count++;
        if (count === 2) {
          resolve();
        }
      };
    });

    // the below code will only reun when the both socket connection establish. we have awited the promise to mimic that.
    ws1.send(
      JSON.stringify({
        type: "join-room",
        room: "Room 1",
      })
    );

    ws2.send(
      JSON.stringify({
        type: "join-room",
        room: "Room 1",
      })
    );

    console.log("Hello i have reachers here");

    await new Promise<void>((resolve) => {
      ws2.onmessage = ({ data }) => {
        console.log(data.toString());
        const parsedData = JSON.parse(data);
        expect(parsedData.type == "chat");
        expect(parsedData.message == "Hi there");
        resolve(); // resove only happen whent we recieved the message.
      };

      ws1.send(
        JSON.stringify({
          type: "chat",
          room: "Room 1",
          message: "Hi there",
        })
      );
    });
  });
});
