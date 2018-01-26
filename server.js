const express = require("express"),
    bodyparser = require("body-parser"),
    path = require("path"),
    fs = require("fs"),
    Request = require("request")
screenshot = require("screenshot-desktop"),
    app = express(),
    Papa = require("babyparse");


// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyparser.json())
app.use(express.static('public'))


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.get("/getEuropilot", function (request, response) {
    var data = {};
    var date = new Date();
    var dateoutput = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate() + 'T' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '-' + date.getMilliseconds();
    var output = {
        filename: 'data2/images/' + dateoutput + '_image.png'
    }

    screenshot(output).then((path) => {
        data.img = dateoutput + '_image.png';
        Request.get("http://192.168.0.227:25555/api/ets2/telemetry", function (error, res, body) {
            if (error) {
                console.log(error);
            }
            var truck = JSON.parse(body);
            data.gametime = dateoutput;            
            data.speed = truck.truck.speed;    
            data.gameSteer = truck.truck.gameSteer;
            data.gameThrottle = truck.truck.gameThrottle;
            data.gameBrake = truck.truck.gameBrake;     
            data.speedLimit = truck.navigation.speedLimit;        
            fs.appendFile("data2/data.json", "," + JSON.stringify(data), (err) => {
                if (err) console.log(err)
            })
            response.json(data);
        })
    })
        .catch((error) => console.log(error));
})


app.listen(3000, function () {
    console.log("server is listening on port 3000")
})


