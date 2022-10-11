const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./app/routes/routes");

const IoHandler = require("./app/services/IoHandler");
const app = require("express")();

const corsOptions = {
  origin: new RegExp(process.env.CORS_ALLOW_ORIGIN),
};

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

const server = require("http").Server(app);
const apiPort = process.env.API_PORT | 3000;

// Initialize websocket
const io = require("socket.io")(server, { cors: corsOptions });
IoHandler.initialize(io);

server.listen(apiPort, () => {
  console.log(`API listening on port :${apiPort}`);
});