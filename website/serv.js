const express = require("express");
const app = express();
const port = 1234;
const server = require('http').createServer(app);
const io = require("socket.io")(server);

var data = [];

app.use(express.static(__dirname + "/public"));

app.get("/recv_data", (req, res) => {
    /*var new_data = {
        pm10_standard: parseInt(req.query.pm10_standard),
        pm25_standard: parseInt(req.query.pm25_standard),
        pm100_standard: parseInt(req.query.pm100_standard),
        pm10_env: parseInt(req.query.pm10_env),
        pm25_env: parseInt(req.query.pm25_env),
        pm100_env: parseInt(req.query.pm100_env),
        particles_03um: parseInt(req.query.particles_03um),
        particles_05um: parseInt(req.query.particles_05um),
        particles_10um: parseInt(req.query.particles_10um),
        particles_25um: parseInt(req.query.particles_25um),
        particles_50um: parseInt(req.query.particles_50um),
        particles_100um: parseInt(req.query.particles_100um)
    }*/
    var new_data = [
        parseInt(req.query.pm10_standard),
        parseInt(req.query.pm25_standard),
        parseInt(req.query.pm100_standard),
        parseInt(req.query.pm10_env),
        parseInt(req.query.pm25_env),
        parseInt(req.query.pm100_env),
        parseInt(req.query.particles_03um) / 100,
        parseInt(req.query.particles_05um) / 100,
        parseInt(req.query.particles_10um) / 10,
        parseInt(req.query.particles_25um),
        parseInt(req.query.particles_50um),
        parseInt(req.query.particles_100um)
    ]

    console.log(new_data);
    // data.push(new_data);
    io.emit("new_data", new_data);
    res.end();

    // var pm10_standard = req.query.pm10_standard;
    // var pm25_standard = req.query.pm25_standard;
    // var pm100_standard = req.query.pm100_standard;
    // var pm10_env = req.query.pm10_env;
    // var pm25_env = req.query.pm25_env;
    // var pm100_env = req.query.pm100_env;
    // var particles_03um = req.query.particles_03um;
    // var particles_05um = req.query.particles_05um;
    // var particles_10um = req.query.particles_10um;
    // var particles_25um = req.query.particles_25um;
    // var particles_50um = req.query.particles_50um;
    // var particles_100um = req.query.particles_100um;

});

app.get("/recv_temp", (req, res) => {
    var new_data = [
        parseFloat(req.query.temperature),
        parseFloat(req.query.pressure),
        parseFloat(req.query.altitude)
    ]
    console.log(new_data);
    // data.push(new_data);
    io.emit("new_temp", new_data);
    res.end();
});

io.sockets.on("connection", socket => {
    var address = socket.handshake.address;
    console.log(`New client page from ${address}, id=${socket.id}`);
})


server.listen(port, () => console.log(`Server is running on port ${port}`));
