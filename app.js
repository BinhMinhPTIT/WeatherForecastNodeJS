const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv');
const app = express();

const path = require('path');
app.set('views', path.join(__dirname, 'views'));

dotenv.config();

const apiKey = process.env.API_KEY;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { weather: null, error: null });
});

app.post('/', (req, res) => {
    const city = req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, (err, response, body) => {
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        } else {
            const weather = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                const weatherInfo = {
                    city: weather.name,
                    temperature: weather.main.temp,
                    description: weather.weather[0].description,
                    icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
                };
                res.render('index', { weather: weatherInfo, error: null });
            }
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Weather app listening on port ${port}!`);
});
