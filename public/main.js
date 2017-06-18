var STORAGE_ID = 'weatherApp';

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
            allData.push(data);
            for (var i = 0; i < allData.length; i++) {
                var thisCity = {};
                thisCity.cityName = allData[i].name;
                thisCity.cityTemp = allData[i].main.temp;
                thisCity.cityComments = [];
            };
            weatherPosts.push(thisCity);
            //console.log(weatherPosts);
            displayWeather(thisCity);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var allData = [];
var weatherPosts = [];



var displayWeather = function(thisCity) {
    var source = $("#weather-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(thisCity);
    $('.displayedWeather').append(newHTML);
};

var storeComments = function(thisPostIndex, thisComment) {
    for (var i = 0; i < weatherPosts.length; i++) {
        if (thisPostIndex == weatherPosts.indexOf(weatherPosts[i])) {
            weatherPosts[i].cityComments.push(thisComment);
            console.log(weatherPosts);

        };
    };
}

var printComment = function(thisPost, thisComment) {
    $(thisPost).append('<p class="commentText">' + thisComment + '</p>');
};


$('.weatherButton').on("click", function() {
    var city = $('.weatherInput').val();
    fetchWeather(city);
    saveToLocalStorage();

});

$('.displayedWeather').on("click", ".commentButton", function() {
    $('.commentPost').show();
    var thisPost = $(this).closest('.cityBlock');
    var thisPostIndex = $(this).closest('.cityBlock').index();
    var thisComment = $(this).closest('.comDiv').find(".commentInput").val();
    storeComments(thisPostIndex, thisComment);
    printComment(thisPost, thisComment);
    saveToLocalStorage();

});

getFromLocalStorage();

