//MultiCityWeather App
$(document).ready(function() {
    console.log("I see my JS file.");
    var currentDate = moment().format("MMMM D, YYYY");
    console.log("Got date: ", currentDate);
    const api = {
        key: "appid=ab222fde8a40e718d2b8f92721309596", 
        base: "https://api.openweathermap.org/data/2.5/",
        units: "&units=imperial&",
        uvi: "uvi?"
    };
    // get recents search from localStorage searchHistory
    var searchHistory = localStorage.getItem("city") ? JSON.parse(localStorage.getItem('city')) : []
    console.log(searchHistory)

    //add Cities to search list used in buildURL/get currentweather
    const ul = $("ul").addClass('list-group'); //get 'ul' element by tag
    console.log("-----------------searchHistory[0]: ", searchHistory,"---------------------");
    searchHistory.forEach(function(oldcity, i){
        renderBtns(oldcity)
        if(i === searchHistory.length -1){
            checkCity(oldcity)
        }
        
        
    })
    
    //need to add class to tag
    var lat;
    var long;
    var queryURL;
    var queryURLUV;
    

    //https://api.openweathermap.org/data/2.5/uvi?appid=ab222fde8a40e718d2b8f92721309596&lat=33.9609&lon=-83.3779
    function uvIndex(currentLat,currentLon) {
        console.log("in uvIndex", currentLat, currentLon);
        queryURLUV = api.base + api.uvi + api.key + "&lat=" + currentLat + "&lon=" + currentLon;
        console.log("queryURLUV: ", queryURLUV);
        $.ajax({
            url: queryURLUV,
            method: "GET" 
            })
                .then(function (response) {
                    var uvIndex = response.value;
                    var uvBadge;
                    if (uvIndex > 10.99) { //greater than 11
                        uvBadge = "badge-inverse";
                    }
                    else if ((uvIndex > 7.9) && (uvIndex < 10.99)) {//8-10
                        uvBadge = "badge badge-danger";    
                    }
                    else if ((uvIndex > 5.99) && (uvIndex < 7.99)) {//6-8
                        uvBadge = "badge badge-info";    
                    }
                    else if ((uvIndex > 2.99) && (uvIndex < 5.99)) {//3-5
                        uvBadge = "badge badge-warning";    
                    }
                    else if (uvIndex < 3) {
                        uvBadge = "badge badge-success";    
                    }

                    $("#search-city-uv").html("<h4 class='dark-text text-left' id='search-city-UV'>UV Index: <span class='" + uvBadge + "'>" + response.value + "</span></h4>");
                    console.log("Line 64 at end of uvi");
                })
                .catch(function (error) {
                    console.log("Unable to reach OpenWeatherAPI:", error);
                });  
    }

    function checkCity(getCity){
        console.log("Line 72 in checkCity: ", getCity);
        if (!getCity) {
            console.log("going to getLocation");
            // queryURL = getLocation(getCity);
            $(".alert").show().text("Please enter a City to Search.");
        } 
        else {
            console.log("going to buildURL", getCity);
            // searchHistory.unshift(getCity);
            $(".alert").hide();
            buildURL(getCity);
        }
    }
    
    //render saved city buttons
    function renderBtns(getCity) {
        ul.prepend("<li class='list-group-item btn'>" + getCity + "</li>");
    }

    
    function buildURL (getCity){
        if (getCity === ""){
            console.log("Line 94 getCity emptystring", getCity);
            queryURL = getLocation();
            
        }
        else {
            queryURLforecast = api.base + "forecast?q=" + `${getCity}` + api.units + api.key;
            queryURLcurrent = api.base + "weather?q=" + `${getCity}` + api.units + api.key;
        }

        //get the current weather
        $.ajax({
        url: queryURLcurrent,
        method: "GET" 
        })
            .then(function (response) {
                console.log("URL Sent: ", queryURLcurrent);
                console.log("response: ", response);
                console.log("Line 104 response.name: ", response.name);
                var currentLat = response.coord.lat;
                var currentLon = response.coord.lon;
                console.log("Line 107 Current Lat & Long: ", response.coord.lat, ",",response.coord.lon);
                getCity = response.name;
                var currentCoord = {"lat" : currentLat, "lon" : currentLon};
                var currrentIcon = response.weather[0].icon;
                $(".city").html("<h1>" + response.name + " (" + currentDate + ") </h1");
                $("#search-city-temp").html("<h4 class='dark-text text-left' id='search-city-temp'>" + "Temprature: " + response.main.temp + "°F</h4>");
                $("#search-city-humidity").html("<h4 class='dark-text text-left' id='search-city-humidity'>Humidity: " + response.main.humidity + "%</h4>");
                $("#search-city-wind").html("<h4 class='dark-text text-left' id='search-city-wind'>" + "Wind Speed: " + response.wind.speed + "MPH</h4>");
                console.log("currentLat: ", currentLat, "currentLon: ",currentLon);
                uvIndex(currentLat, currentLon);
                var cityListGroup = $("<ul class='list-group'>");
                var cityListGroupItem = $("<li class='list-group-item'>");
                var cityName = response.name;
                var iconCode = response.weather[0].icon;
                console.log(" Line 121 current: ", iconCode);
                var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
                console.log("current city: ", cityName);
                $("#weatherIcon").html("<img src='" + iconUrl  + "'>");
                
                //add to searched list
                var found = searchHistory.find(city => city === getCity)
                if(!found){
                    searchHistory.push(getCity)
                    localStorage.setItem("city", JSON.stringify(searchHistory));
                    renderBtns(getCity);
                    
                }
                forecastAPI();
                     

            })
            .catch(function (error) {
                console.log("Line 146 getCity: ", getCity);
                console.log("Unable to reach OpenWeatherAPI:", error);
                $(".alert").show().text("No City found matching your Search.");
            });
        
    function forecastAPI(){
        $.ajax({
            url: queryURLforecast,
            method: "GET" 
            })
                .then(function (response) {
                    console.log("URL Sent: ", queryURLforecast);
                    console.log("forcast: ", response);
                    console.log("temp5: ", response.list[4].main.temp_max);
                    for(var i = 0; i < 5; i++) {
                        let myDay = moment().add((1 + i),'day').format('l');
                        let nextDay = "#day" + (i + 1);
                        let icon = nextDay + "-icon";
                        console.log("line 144 In for loop :", nextDay, i);
                        $(nextDay).html(myDay);
                        console.log("Icon: ",icon);
                        let myIconCode = response.list[i].weather[0].icon;
                        myIconUrl = "https://openweathermap.org/img/w/" + myIconCode + ".png";
                        console.log("iconURL: ", myIconUrl);
                        $(icon).html("<img src=" + myIconUrl  + ">");
                        let myTemp = response.list[i].main.temp_max;
                        $(nextDay + "-temp").text("Temp: " + myTemp + "°F");
                        let myHumidity = response.list[i].main.humidity;
                        $(nextDay + "-humd").text("Humidity: " + myHumidity + "%");
                    }
                    //put icon next to date displayed on main page cards
                
                })
                .catch(function (error) {
                    console.log("OpenWeatherAPI error:", error);
                });
        }
    };
    
    // Examples of API calls:
    // By geographic coordinates
    // API call:
    // http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}

    // api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37
    //get location if no city entered
    function getLocation(foundYou) {
        if (navigator.geolocation) {
        let foundYou = navigator.geolocation.getCurrentPosition(showPosition);
        console.log("getLocation queryURL: ",foundYou);
        } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
        };
        console.log("In getLocation & returning foundYou: ", foundYou);
        return foundYou;
    }
    // get lat, lon - coordinates of the location of your interest (latitude/longitude)
    function showPosition(position) {
        var foundYou;
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log("in showPosition lat: ",lat,"Long: ", long);
        //build queryURL(foundYou) and pass it back out
        foundYou =  api.base + "forecast?lat=" + `${lat}` + "&lon=" + `${long}` + api.units + api.key;
        console.log("in showPosition: ", foundYou);
        return foundYou;  
        
    }
    
$(document).on("click", ".list-group-item", function(){
    var cityValue = $(this).text();
    console.log("li Clicked",cityValue);
    $(".alert").hide();
    $("#getCity").val("");
    buildURL(cityValue);
});    
       
$("#button-addon2").click(function(event) {
    event.preventDefault();
    var getCity = $("#getCity").val();
    console.log("Line 223 Got Input: ", getCity);
    //$(".city").html("<h1>" + getCity + " (" + currentDate + ") </h1");
    checkCity(getCity);
})

    //example of how to call openWeather by coordinates
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={your api key}
    // Parameters:
    // lat, lon coordinates of the location of your interest
    // Examples of API calls:
    // api.openweathermap.org/data/2.5/forecast?lat=35&lon=139

    //Current Weather
    //api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

    //example of how to call openWeatherAPI by City and State
    //api.openweathermap.org/data/2.5/forecast?q={city name},{state}&appid={your api key}
});
