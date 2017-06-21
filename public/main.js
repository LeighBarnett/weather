var STORAGE_ID = 'weatherChat';

var saveToLocalStorage = function() {
    localStorage.setItem(STORAGE_ID, JSON.stringify(weatherPosts));
}

var getFromLocalStorage = function() {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}


var fetchWeather = function(city) {
    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d703871f861842b79c60988ccf3b17ec&units=metric",

        success: function(data) {
            var newCity = {
                name: data.name,
                temp: data.main.temp,
                comments: []
            };
            weatherPosts.push(newCity);
            displayWeather();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var weatherPosts = [];



var displayWeather = function() {
    $('.displayedWeather').empty();
    var source = $("#weather-template").html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < weatherPosts.length; i++) {
        var thisPostIndex = weatherPosts.indexOf(weatherPosts[i]);
        var newHTML = template(weatherPosts[i]);
        $('.displayedWeather').append(newHTML);
    };
};




$('.weatherButton').on("click", function() {
    var city = $('.weatherInput').val();
    fetchWeather(city);
    saveToLocalStorage();

});

$('.displayedWeather').on("click", ".commentButton", function() {
    var thisPostIndex = $(this).closest('.cityBlock').index();
    var thisComment = {};
    thisComment.text = $(this).closest('.comDiv').find(".commentInput").val();
    weatherPosts[thisPostIndex].comments.push(thisComment);
    displayWeather();
    $('.commentPost').show()

});


// $('.displayedWeather').on("click", ".trash", function() {

// })

getFromLocalStorage();
