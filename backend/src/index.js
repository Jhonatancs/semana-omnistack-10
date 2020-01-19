const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes')
const cors = require('cors');
const http = require('http');
const { setupWebsocket } = require('./webSocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://jdc:@senha123@cluster0-35iem.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);