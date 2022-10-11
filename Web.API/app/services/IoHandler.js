const { EventEmitter } = require("events");
const url = require("url");

const routes = {
  adminLogs: "/admin/logs",
};

const eventEmitter = new EventEmitter();
const namespacesCreated = {}; // will store the existing namespaces

module.exports = {
  initialize: async (io) => {
    io.sockets.on("connection", (socket) => {
      const { ns } = url.parse(socket.handshake.url, true).query;
      let matched = false;

      if (!ns) {
        // if there is not a ns in query disconnect the socket
        socket.disconnect();
        return { err: "ns not provided" };
      }

      Object.keys(routes).forEach((name) => {
        const matches = ns.match(routes[name]);

        if (matches) {
          matched = true;
          socket.join(name);
          if (!namespacesCreated[ns]) {
            // check if the namespace was already created
            namespacesCreated[ns] = true;
            io.of(ns).on("connection", (nsp) => {
              const evt = `dynamic.group.${name}`; // emit an event four our group of namespaces
              eventEmitter.emit(evt, nsp, ...matches.slice(1, matches.length));
            });
          }
        }
      });

      if (!matched) {
        // if there was no match disconnect the socket
        socket.disconnect();
      }
    });
    console.log("SocketIO initialized");
  },
};