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

    async function refreshPlayerArray(gameId) {
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
              if (parsedData[i].data.charName && !charNamesForRoom.includes(parsedData[i].data.charName)) {
                allPlayersArray.push(parsedData[i].data);
                charNamesForRoom.push(parsedData[i].data.charName);
              } else {
                continue;
              }
            }
          }
          socket.emit("there you go", allPlayersArray);
        });
    }

    //socket.emit("new user connected", playersObject, socket.id);

    // socket.on("chat message", (arg1) => {
    //   console.log("message recieved", arg1);
    // });

    socket.on("create new player", (data) => {
      socket.data = data;
    });

    socket.on("join room", (gameId) => {
      socket.join(`${gameId}`);
      console.log("bejött a szobába", gameId, socket.data);
      io.to(`${gameId}`).emit("character updated from server", socket.data.charName);
    });

    socket.on("leave room", (gameId) => {
      socket.leave(`${gameId}`);
      console.log("elhagyta a szobát", gameId, socket.data);
      io.to(`${gameId}`).emit("character updated from server", socket.data.charName);
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
        console.log("változás volt", socket.data.charName);
        socket.data = updatedData;
      }
      if (dataChanged) {
        console.log(dataChanged);
        io.to(`${socket.data.gameId}`).emit("character updated from server", socket.data.charName);
      }
      if (!dataChanged) {
        console.log("nem volt változás");
      }
    });

    socket.on("need sockets", async (gameId) => {
      refreshPlayerArray(gameId);
      // await io
      //   .in(gameId)
      //   .fetchSockets()
      //   .then((parsedData) => {
      //     if (!parsedData) {
      //       return;
      //     }
      //     let allPlayersArray = [];
      //     let charNamesForRoom = [];
      //     for (let i = 0; i < parsedData.length; i++) {
      //       if (Object.entries(parsedData[i].data).length != 0) {
      //         if (parsedData[i].data.charName && !charNamesForRoom.includes(parsedData[i].data.charName)) {
      //           allPlayersArray.push(parsedData[i].data);
      //           charNamesForRoom.push(parsedData[i].data.charName);
      //         } else {
      //           continue;
      //         }
      //       }
      //     }
      //   });
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

    socket.on("disconnect", async () => {
      console.log("A client disconnected", socket.data.charName);
      socket.leave(`${socket.data.gameId}`);
      console.log("elhagyta a szobát", socket.data.gameId, socket.data);
      refreshPlayerArray(socket.data.gameId);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
