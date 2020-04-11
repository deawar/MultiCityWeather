//MultiCityWeather App
$(document).ready(function() {
    console.log("I see my JS file.");
    var currentDate = moment().format("MMMM D, YYYY");
    console.log("Got date: ", currentDate);
    const api = {
        key: "&units=imperial&appid=ab222fde8a40e718d2b8f92721309596", 
        base: "https://api.openweathermap.org/data/2.5/"
    }
    var getCity = localStorage.getItem('city');
    //var state = localStorage.getItem('state');
    let body = document.getElementsByTagName('body')[0];
    var lat;
    var long;
    var queryURL;
    var queryURLUV;
    
    function uvIndex(currentLat,currentLon) {
        console.log("in uvIndex", currentLan, currentlLon);
        queryURLUV = api.base + api.key + "uvi?lat=" + currentLat + "&lon=" + currentLon;
        console.log("queryURLUV: ", queryURLUV);
        $.ajax({
            url: queryURLUV,
            method: "GET" 
            })
                .then(function (response) {
                    var uvIndex = response.value;
                    var uvBadge;
                    if (uvIndex > 10) { //greater than 11
                        uvBadge = "badge-inverse";
                    }
                    else if ((uvIndex >8) && (uvIndex < 10)) {//8-10
                        uvBadge = "badge badge-danger";    
                    }
                    else if ((uvIndex >6) && (uvIndex < 8)) {//6-8
                        uvBadge = "badge badge-info";    
                    }
                    else if ((uvIndex >3) && (uvIndex < 5)) {//3-5
                        uvBadge = "badge badge-warning";    
                    }
                    else if (uvIndex < 3) {
                        uvBadge = "badge badge-success";    
                    }

                    $("#search-city-uv").html("<h4 class='dark-text text-left' id='search-city-UV'>UV Idex: <span class='" + uvBadge + "'>" + response.value + "</span></h4>");
                    
                });
    }

    function checkCity(getCity){
        console.log("in checkCity: ", getCity);
        if (!getCity) {
            console.log("going to getLocation");
            queryURL = getLocation(getCity);
        } 
        else {
            console.log("going to buildURL");
            buildURL(getCity);
        }
    }
    
    
    function buildURL (getCity){
        if (getCity === ""){
            console.log("getCity emptystring", getCity);
            queryURL = getLocation();
            
        }
        else {
            queryURL = api.base + "forecast?q=" + `${getCity}` +  api.key;
        }
        


        
        $.ajax({
        url: queryURL,
        method: "GET" 
        })
            .then(function (response) {
                console.log("URL Sent: ", queryURL);
                console.log("response: ", response);
                console.log("response.name: ", response.city.name);
                var currentLat = response.city.coord.lat;
                var currentLon = response.city.coord.lon;
                console.log("Current Lat & Long: ", response.city.coord.lat, ",",response.city.coord.lon);
                getCity = response.city.name;
                var currentCoord = {"lat" : currentLat, "lon" : currentLon};
                var currrentIcon = response.list[0].weather.icon;
                $(".city").html("<h1>" + response.city.name + " (" + currentDate + ") </h1");
                $("#search-city-temp").html("<h4 class='dark-text text-left' id='search-city-temp'>" + "Temprature: " + response.list[0].main.temp + "°F</h4>");
                $("#search-city-humidity").html("<h4 class='dark-text text-left' id='search-city-humidity'>Humidity: " + response.list[0].main.humidity + "%</h4>");
                $("#search-city-wind").html("<h4 class='dark-text text-left' id='search-city-wind'>" + "Wind Speed: " + response.list[0].wind.speed + "MPH</h4>");
                console.log("currentLat: ", currentLat, "currentLon: ",currentLon);
                uvIndex(currentLat, currentLon);
                var cityListGroup = $("<ul class='list-group'>");
                var cityListGroupItem = $("<li class='list-group-item'>");
                var cityName = response.city.name;
                console.log("current city: ", cityName);
                var cityListItem =$(".list-group-item").html("<li>" + cityName + "</li>");
                cityListGroup.append($(".list-group-item").text("<li>" + cityName + "</li>"));
        });
        
    }


    function getLocation(foundYou) {
        if (navigator.geolocation) {
        let foundYou = navigator.geolocation.getCurrentPosition(showPosition);
        console.log("getLocation queryURL: ",foundYou);
        } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        var foundYou;
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log("in showPosition lat: ",lat,"Long: ", long);
        //build queryURL(foundYou) and pass it back out
        foundYou =  api.base + "forecast?lat=" + `${lat}` + "&lon=" + `${long}` + api.key;
        console.log("in showPosition: ", foundYou);
        return foundYou;  
    }

    
        
        // beforeSend: function() {
        //     $content.append('<div id="load">Loading</div>');
        // },
        // complete: function() {
        //     $("#search-city").html(getCity);
        // },
        // error: function() {
        //     $content.html('<div id="container">Please try again soon.</div>');
        // }


$("#button-addon2").on("click", function() {
    var getCity = $("#getCity").val();
    console.log("Got Input: ", getCity);
    checkCity(getCity);


})

    const searchbox = document.querySelector('#button-addon2');
    //searchbox.addEventListener('keypress', setQuery);

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

    // By geographic coordinates
    // API call:
    // http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
    // Parameters:

    // appid - personal API key

    // lat, lon - coordinates of the location of your interest (latitude/longitude)
    // Examples of API calls:

    // api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37

});