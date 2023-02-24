var apiKey = "ddf34d495a550c674e9f61eb82d9fc3e";
var savedCities = [];

//local storage(list of cities)
var searchHistoryList = function (cityName){
    $('.previous-search:contains("'+ cityName +'")').remove();

    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("previous-search");
    searchHistoryEntry.text(cityName);
    searchHistoryEntry.append(searchHistoryEntry);

    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchHistoryContainerEl);

    if (savedCities.length > 0){ var previoussavedCities = localStorage.getItem("savedCities"); savedCities = JSON.parse(previoussavedCities);
    }

    // add city name to array of saved searches
    savedCities.push(cityName);localStorage.setItem("savedCities", JSON.stringify(savedCities));

    // reset search input
    $("#search-input").val("");

};

//current weather funtion
var currentWeather = function (cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response) { return response.json();})
        .then(function(response) {
            // get city's longitude and latitude
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) { return response.json();
                })  
                .then(function(response){
                    searchHistoryList(cityName);
                    
                    var currentWeatherBlock =$("current-container");
                    currentWeatherBlock.addClass("current-container");

                    var favCityName =$("current-title");
                    var currentDay = moment().format("MM/DD/YY");
                    favCityName.text(`${cityName} (${currentDay})`);
                    var currentIcon = $("#current-weather-icon");
                    currentIcon.addClass("current-weather-icon");
                    var currentIconCode = response.current.weather[0].icon;
                    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`)
                
                    var currentTemp =$("#current-temperature");
                    currentTemp.text ("Temp:"+ response.current.temp+ " \u00B0F");

                    var currentTemp =$("#current-wind-speed");
                    currentTemp.text ("Wind:"+ response.current.wind_speed+ "MPH");

                    var currentTemp =$("#current-humidity");
                    currentTemp.text ("Humidity:"+ response.current.humidity+ " %");
                })        
        });
 };
//future weather funtion 
var fiveDaywea =function (cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response) { 
            return response.json();
            })
            .then(function(response) {
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                .then(function(response) { return response.json();
                })  
                .then(function(response){
                    console.log(response);
                    var futureWeaTitle = $("#future-forecast-title");
                    futureWeaTitle.text("5-Day Forecast:")

                    for (var i = 1; i <=5;i++){
                        var futureCard = $(".future-card"); futureCard.addClass("future-card-details");

                        var futureDate = $("#future-date" + i);
                        date = moment().add(i, "d").format("MM/DD/YY");
                        futureDate.text(date);

                        var futureTemp = $("#future-temp" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        var futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                    
                })
        })
};

//search for the history on previous cities
var loadSearchHistory = function() {
    var savedHistory = localStorage.getItem ("savedCities");
    if (!savedHistory) {
        return false;
    } 
    savedHistory = JSON.parse(savedHistory);
};

//localhost search history
$("#search-history-container").on("click", "p", function() {   
    var previousCityName = $(this).text();
    currentWeather(previousCityName);
    fiveDaywea(previousCityName);

    var previousCityClicked = $(this);
    previousCityClicked.remove();
});

loadSearchHistory();

//Search for a city form
$("#search-form").on("submit", function() {
    event.preventDefault();
    
    var cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
        alert("Please enter a city name.");
        event.preventDefault();
    } else {
       
        currentWeather(cityName);
        fiveDaywea(cityName);
    }
});
