const express = require('express')
const app = express()
const port = 3001;
const cors = require('cors');
const ACTION = require('./action');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
var corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}
app.use(cors(corsOptions));
// make connection with user from server side

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
    socket.on(ACTION.ROOM_JOIN, ({ email, room }) => {
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        io.to(room).emit(ACTION.USER_JOIN, { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit(ACTION.ROOM_JOIN, { email, room });
    });

    socket.on(ACTION.USER_CALL, ({ to, offer }) => {
        console.log(to, offer);
        io.to(to).emit(ACTION.INCOMING_CALL, { from: socket.id, offer });
    });

    socket.on(ACTION.CALL_ACCEPTED, ({ to, ans }) => {
        console.log(to, ans);
        io.to(to).emit(ACTION.CALL_ACCEPTED, { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

});









app.get("/", (req, res) => {
    res.send('hello world')
});

server.listen(port, () => {
    console.log('successfully connected running in 3001');
});

