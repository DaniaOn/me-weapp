var apiKey = "ddf34d495a550c674e9f61eb82d9fc3e";
var favCity = [];

//current weather funtion
var currentWeather = function (cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response) { return response.json();})
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
var fiveDaysWea =function (cityNamev){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function(response) { return response.json();
        })
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
                    } 
                })
        });

};


//localhost search history
$("#search-history-container").on("click", "p", function() {   
    var previousCityName = $(this).text();
    currentWeatherSection(previousCityName);
    fiveDayForecastSection(previousCityName);

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
        fiveDaysWea(cityName);
    }
});
