require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const app = express();
const mapperRouter = require("./mapper");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const KiteConnect = require("kiteconnect").KiteConnect;
const KiteTicker = require("kiteconnect").KiteTicker;

const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

const kc = new KiteConnect({
  api_key: apiKey,
});
kc.setAccessToken(accessToken);

const ticker = new KiteTicker({
  api_key: apiKey,
  access_token: accessToken,
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));

app.use("/mapper", mapperRouter);

// Order function
const order = async (stock) => {
  const timestamp = new Date();
  console.log(
    `Order placed for ${stock.exchange}:${stock.tradingsymbol}, Transaction: ${stock.transactionType}, product: ${stock.product}, quantity: ${stock.quantity}`,
  );
  console.log(`Time of order: ${timestamp.toUTCString()}`);

  // return kc.placeOrder("regular", {
  //   exchange: stock.exchange,
  //   tradingsymbol: stock.tradingsymbol,
  //   transaction_type: stock.transactionType,
  //   quantity: stock.quantity,
  //   product: stock.product,
  //   order_type: "MARKET",
  // });

  return `Order placed for ${stock.exchange}:${stock.tradingsymbol}, Transaction: ${stock.transactionType}, product: ${stock.product}, quantity: ${stock.quantity}`;
};

app.post("/placeOrder", async (request, response) => {
  const stockArray = request.body;

  const promiseArray = [];

  stockArray.forEach((s) => {
    promiseArray.push(order(s));
  });

  await Promise.all(promiseArray);

  const positions = await kc.getPositions();
  console.log(positions);

  response.send("Check console.");
});

io.on("connection", (socket) => {
  console.log("User connected");

  ticker.connect();

  ticker.on("connect", () => {
    console.log("Connecting to Zerodha");
    const items = [256265];
    console.log("Subscribing to NIFTY 50");
    ticker.subscribe(items);
    ticker.setMode(ticker.modeFull, items);
  });

  ticker.on("ticks", (tick) => {
    socket.emit("FromKiteTicker", JSON.stringify(tick));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

http.listen(5000, () => {
  console.log("listening on *:5000");
});
