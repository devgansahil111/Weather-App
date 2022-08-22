const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define path for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup Handlers engine and views location
app.set('view engine', 'hbs');
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", function(req, res) {
    res.render('index', {
        title: "Weather App",
        name: "Sahil Devgan"
    });
});

app.get("/about", function(req, res) {
    res.render("about", {
        title: "About Me",
        name: "Sahil Devgan"
    });
});

app.get("/help", function(req, res) {
    res.render("help", {
        title: "Help Me",
        name: "Sahil Devgan"
    });
});

// Below are the routes API

// app.get("", function(req, res) {
//     res.send("<h1>Hello Express!</h1>");
// });

// app.get("/help", function(req, res) {
//     res.send({
//         name: "Sahil",
//         lastName: "Devgan",
//         age: 25,
//         qualification: "B.tech",
//         specialization: "Mechanical Engineering"
//     });
// });

// app.get("/about", function(req, res) {
//     res.send("<h1>About Page</h1>");
// });

// app.get("/weather", function(req, res) {
//     res.send({
//         forecast: "It is Partly cloudy today!",
//         location: "Delhi"
//     });
// });

// app.get('/weather', (req, res) => {
//     if (!req.query.address) {
//         return res.send({
//             error: 'You must provide an address!'
//         })
//     }

//     res.send({
//         forecast: 'It is snowing',
//         location: 'Philadelphia',
//         address: req.query.address
//     });
// });

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    console.log(req.query.search);
    res.send({
        products: []
    });
});

app.get("/help/*", function(req, res) {
    res.render("404", {
        title: "404",
        name: "Sahil Devgan",
        errorMessage: "Help Article not Found"
    });
});

app.get("*", function(req, res) {
    res.render("404", {
        title: "404",
        name: "Sahil Devgan",
        errorMessage: "Page not Found"
    });
});

// app.com
// app.com/help
// app.com/about

app.listen(3000, function() {
    console.log("Server is running on port: 3000");
});