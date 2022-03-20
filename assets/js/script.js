//global variables
var openWeatherApiKey = '541b695c3c5f838d72e939805aa87e32';
var openWeatherCoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='
var userFormEL = $('#search-container');
var col2El = $('.col2');
var cityInputEl = $('#city');
var weatherEl = $('#weather-container');
var searchHistoryEl = $('#history-container');
var currentDay = moment().format('M/DD/YYYY');
const weatherIconUrl = 'http://openweathermap.org/img/wn/';
var searchHistoryArray = loadSearchHistory();



//function to capitalize the first letter of a string
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

//load cities from local storage and recreate history buttons
function loadSearchHistory() {
    var searchHistoryArray = JSON.parse(localStorage.getItem('search history'));

    if (!searchHistoryArray) {
        searchHistoryArray = {
            searchedCity: [],
        };
    } else {
        for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
            searchHistory(searchHistoryArray.searchedCity[i]);
        }
    }

    return searchHistoryArray;
}

//save to local storage
function saveSearchHistory() {
    localStorage.setItem('search history', JSON.stringify(searchHistoryArray));
};

//create history buttons
function searchHistory(city) {
    var searchHistoryBtn = $('<button>')
        .addClass('btn')
        .text(city)
        .on('click', function () {
            $('#current-weather').remove();
            $('#weather-container').empty();
            $('#weather-container-header').remove();
            getWeather(city);
        })
        .attr({
            type: 'button'
        });

    searchHistoryEl.append(searchHistoryBtn);
}

//get weather data from apiUrl
function getWeather(city) {
    var apiCoordinatesUrl = openWeatherCoordinatesUrl + city + '&appid=' + openWeatherApiKey;

    fetch(apiCoordinatesUrl)
        .then(function (coordinateResponse) {
            if (coordinateResponse.ok) {
                coordinateResponse.json().then(function (data) {
                    var cityLatitude = data.coord.lat;
                    var cityLongitude = data.coord.lon;

                    var apiOneCallUrl = oneCallUrl + cityLatitude + '&lon=' + cityLongitude + '&appid=' + openWeatherApiKey + '&units=imperial';

                    fetch(apiOneCallUrl)
                        .then(function (weatherResponse) {
                            if (weatherResponse.ok) {
                                weatherResponse.json().then(function (weatherData) {

                                    var currentWeatherEl = $('<div>')
                                        .attr({
                                            id: 'current-weather'
                                        })

                                    var weatherIcon = weatherData.current.weather[0].icon;
                                    var cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';

                                    var currentWeatherHeadingEl = $('<h2>')
                                        .text(city + ' (' + currentDay + ')');
                                    var iconImgEl = $('<img>')
                                        .attr({
                                            id: 'current-weather-icon',
                                            src: cityCurrentWeatherIcon,
                                            alt: 'Weather Icon'
                                        })

                                    var currWeatherListEl = $('<ul>')

                                    var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
                                    console.log(currWeatherDetails)
                                    for (var i = 0; i < currWeatherDetails.length; i++) {
                                        if (currWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {

                                            var currentWeatherItem = $('<li>')
                                                .text('UV Index: ')

                                            currWeatherListEl.append(currentWeatherItem);

                                            var uvItem = $('<span>')
                                                .text(weatherData.current.uvi);

                                            if (uvItem.text() <= 2) {
                                                uvItem.addClass('favorable');
                                            } else if (uvItem.text() > 2 && uvItem.text() <= 7) {
                                                uvItem.addClass('moderate');
                                            } else {
                                                uvItem.addClass('severe');
                                            }

                                            currentWeatherItem.append(uvItem);
                                        } else {
                                            var currentWeatherItem = $('<li>')
                                            .text(currWeatherDetails[i])
                                            currWeatherListEl.append(currentWeatherItem);
                                        }

                                    }

                                    $('#weather-container').before(currentWeatherEl);
                                    currentWeatherEl.append(currentWeatherHeadingEl);
                                    currentWeatherHeadingEl.append(iconImgEl);
                                    currentWeatherEl.append(currWeatherListEl);

                                    var fiveDayHeaderEl = $('<h2>')
                                        .text('5-Day Forecast:')
                                        .attr({
                                            id: 'weather-container-header'
                                        })

                                    $('#current-weather').after(fiveDayHeaderEl)

                                    var fiveDayArray = [];

                                    for (var i = 0; i < 5; i++) {
                                        let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');

                                        fiveDayArray.push(forecastDate);
                                    }

                                    for (var i = 0; i < fiveDayArray.length; i++) {
                                        var cardDivEl = $('<div>')
                                            .addClass('col3');

                                        var cardBodyDivEl = $('<div>')
                                            .addClass('card-body');

                                        var cardTitleEl = $('<h3>')
                                            .addClass('card-title')
                                            .text(fiveDayArray[i]);

                                        var forecastIcon = weatherData.daily[i].weather[0].icon;

                                        var forecastIconEl = $('<img>')
                                            .attr({
                                                src: weatherIconUrl + forecastIcon + '.png',
                                                alt: 'Weather Icon'
                                            });

                                        var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

                                        var tempEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Temp: ' + weatherData.daily[i].temp.max)

                                        var windEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Wind: ' + weatherData.daily[i].wind_speed + ' MPH')

                                        var humidityEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Humidity: ' + weatherData.daily[i].humidity + '%')

                                        weatherEl.append(cardDivEl);

                                        cardDivEl.append(cardBodyDivEl);
                                        cardBodyDivEl.append(cardTitleEl);
                                        cardBodyDivEl.append(forecastIconEl);
                                        cardBodyDivEl.append(tempEL);
                                        cardBodyDivEl.append(windEL);
                                        cardBodyDivEl.append(humidityEL);
                                    }


                                })
                            }
                        })
                });
            } else {
                alert('Error: Open Weather could not find city')
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
};

// push info to weather cards and notify user if city has already been searched
function submitCitySearch(event) {
    event.preventDefault();
    var city = titleCase(cityInputEl.val().trim());

    if (searchHistoryArray.searchedCity.includes(city)) {
        alert(city + ' is included in history below. Click the ' + city + ' button to get weather.');
        cityInputEl.val('');
    } else if (city) {
        getWeather(city);
        searchHistory(city);
        searchHistoryArray.searchedCity.push(city);
        saveSearchHistory();
        cityInputEl.val('');
    } else {
        alert('Please enter a city');
    }
}

//fetch data from api on click
userFormEL.on('submit', submitCitySearch);

//on submit replace info with new info
$('#search-btn').on('click', function () {
    $('#current-weather').remove();
    $('#weather-container').empty();
    $('#weather-container-header').remove();
})