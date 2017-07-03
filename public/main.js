var weatherPosts = [];

var weatherChatApp = function() {
    var STORAGE_ID = 'weatherChat';


    var saveToLocalStorage = function() {
        localStorage.setItem(STORAGE_ID, JSON.stringify(weatherPosts));

    }

    var getFromLocalStorage = function() {
        return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    }

    var looper = function() {
        weatherPosts = getFromLocalStorage();
        for (var i = 0; i < weatherPosts.length; i++) {
            fetchCurrentWeather(i);
        };
    }

    var fetchCurrentWeather = function(i) {
        var city = weatherPosts[i].name;
        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d703871f861842b79c60988ccf3b17ec&units=metric",

            success: function(data) {
                var time = new Date(data.dt * 1000);
                weatherPosts[i].time = time.toLocaleString();
                weatherPosts[i].temp = data.main.temp;
                weatherPosts[i].lowTemp = data.main.temp_min;
                weatherPosts[i].highTemp = data.main.temp_max;
                saveToLocalStorage();
                displayWeather();


            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Please enter the name of a city.");
            }

        });
    };



    var fetchWeather = function(city) {
        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d703871f861842b79c60988ccf3b17ec&units=metric",

            success: function(data) {

                var time = new Date(data.dt * 1000)

                var newCity = {
                    time: time.toLocaleString(),
                    name: data.name,
                    temp: data.main.temp,
                    lowTemp: data.main.temp_min,
                    highTemp: data.main.temp_max,
                    comments: []
                };
                weatherPosts.unshift(newCity);
                saveToLocalStorage();
                displayWeather();

            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Please enter the name of a city.");
            }
        });
    };





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


    var removeComment = function(commentToDelete, commentToDeleteIndex, postWithCommentToDeleteIndex) {
        weatherPosts[postWithCommentToDeleteIndex].comments.splice(commentToDeleteIndex, 1);
        saveToLocalStorage();
        $(commentToDelete).remove();
    }

    var removeWeatherPost = function(thisPostIndex, thisWeatherPost) {
        weatherPosts.splice(thisPostIndex, 1);
        saveToLocalStorage();
        $(thisWeatherPost).remove();
    }

    return {
        saveToLocalStorage: saveToLocalStorage,
        getFromLocalStorage: getFromLocalStorage,
        fetchWeather: fetchWeather,
        displayWeather: displayWeather,
        removeComment: removeComment,
        removeWeatherPost: removeWeatherPost,
        weatherPosts: weatherPosts,
        looper: looper
    }
}

var app = weatherChatApp();
app.looper();

//Add Weather Post

$('#postForm').on("submit", function() {
    var checkIfCityExists = 0;
    var city = $('.weatherInput').val();
    for (var i = 0; i < weatherPosts.length; i++) {
        if (weatherPosts[i].name.toUpperCase() == city.toUpperCase()) {
            checkIfCityExists++
            alert("Scroll down! You've already got that city. Try another!")
        }
    }
    if (checkIfCityExists == 0) {
        app.fetchWeather(city);

    }

    return false;

});

//Add Comments
$('.displayedWeather').on("click", ".commentButton", function() {
    var thisPostIndex = $(this).closest('.cityBlock').index();
    var thisComment = {};
    thisComment.text = $(this).closest('.comDiv').find(".commentInput").val();
    var fullYear= new Date();
    var date= fullYear.getDate()+ "/" +(fullYear.getMonth()+1) + "/" + fullYear.getFullYear() ;
    thisComment.time = date;
    weatherPosts[thisPostIndex].comments.push(thisComment);
    app.saveToLocalStorage();
    app.displayWeather();
    


});

//Remove Comment
$('.displayedWeather').on("click", ".trashComments", function() {
    var commentToDelete = $(this).closest('.commentListItem');
    var commentToDeleteIndex = $(commentToDelete).index();
    var postWithCommentToDelete = $(commentToDelete).closest('.cityBlock');
    var postWithCommentToDeleteIndex = $(postWithCommentToDelete).index();
    app.removeComment(commentToDelete, commentToDeleteIndex, postWithCommentToDeleteIndex);
})

//Remove Post
$('.displayedWeather').on("click", ".trashPost", function() {
    var thisPostIndex = $(this).closest('.cityBlock').index();
    var thisWeatherPost = $(this).closest('.cityBlock');
    app.removeWeatherPost(thisPostIndex, thisWeatherPost);
})

//Sort by name (alphabetical)

$('.sortButton').click(function(){
    weatherPosts.sort(function(a,b){
        var nameA= a.name.toUpperCase();
        var nameB= b.name.toUpperCase();
        if (nameA<nameB){
            return -1;
        }
        if (nameA>nameB){
            return 1;
        }
        return 0;
    })
    console.log(weatherPosts)
    app.displayWeather();
})

$('.sortHighTempButton').click(function(){
    weatherPosts.sort(function(a,b){
        return b.temp-a.temp;
    })
        app.displayWeather();

})

$('.sortLowTempButton').click(function(){
    weatherPosts.sort(function(a,b){
        return a.temp-b.temp;
    })
        app.displayWeather();

})