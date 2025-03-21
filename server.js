const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on("connection", async (socket) => {
    console.log("A client connected");

    //socket.emit("new user connected", playersObject, socket.id);

    // socket.on("chat message", (arg1) => {
    //   console.log("message recieved", arg1);
    // });

    socket.on("create new player", (data) => {
      socket.data = data;
      socket.join(`${data.gameId}`);
    });

    socket.on("character updated", (updatedData) => {
      let dataChanged = false;
      if (
        socket.data.currentFp != updatedData.currentFp ||
        socket.data.currentEp != updatedData.currentEp ||
        socket.data.currentPp != updatedData.currentPp ||
        socket.data.currentMp != updatedData.currentMp ||
        socket.data.currentLp != updatedData.currentLp ||
        socket.data.atkRollResult != updatedData.atkRollResult ||
        socket.data.atkRollDice != updatedData.atkRollDice ||
        //socket.data.activeBuffs != updatedData.activeBuffs ||
        socket.data.skillCheckResult != updatedData.skillCheckResult ||
        socket.data.skillCheckDice != updatedData.skillCheckDice ||
        socket.data.numberOfActions != updatedData.numberOfActions ||
        socket.data.initiativeWithRoll != updatedData.initiativeWithRoll
      ) {
        dataChanged = true;
        socket.data = updatedData;
      }
      console.log(socket.data);
      if (dataChanged) {
        io.to(`${socket.data.gameId}`).emit("character updated from server", socket.data.charName);
      }
      console.log(socket.data);
    });

    socket.on("need sockets", async (gameId) => {
      await io
        .in(gameId)
        .fetchSockets()
        .then((parsedData) => {
          if (!parsedData) {
            return;
          }
          let allPlayersArray = [];
          let charNamesForRoom = [];
          for (let i = 0; i < parsedData.length; i++) {
            if (Object.entries(parsedData[i].data).length != 0) {
              if (!charNamesForRoom.includes(parsedData[i].data.charName)) {
                allPlayersArray.push(parsedData[i].data);
                charNamesForRoom.push(parsedData[i].data.charName);
              } else {
                continue;
              }
            }
          }
          socket.emit("there you go", allPlayersArray);
        });
    });

    // socket.on("sending data to update", async (data) => {
    //   console.log("data recieved", data);
    //   const JSONdata = JSON.stringify(data);
    //   const endpoint = "wss://localhost:3000/pages/api/updateCharacter";
    //   const options = {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSONdata,
    //   };
    //   await fetch(endpoint, options);
    // });

    socket.on("disconnect", () => {
      console.log("A client disconnected", socket.data.charName);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
