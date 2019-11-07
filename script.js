$(window).scroll(function(){
    if($(window).scrollTop()>300){
      $("nav").addClass("orange lighten-5");
    }else{
      $("nav").removeClass("orange lighten-5");
    }
});

const slider = document.querySelector('.slider');
M.Slider.init(slider, {
    indicators: false,
    height: 500,
    transition: 500,
    interval:3000
});
// -------------------------------------
var foodBtnEl= [];
var beerYear= [];

$("#search-btn").on("click", function(event){
    event.preventDefault();
    var newFood = $("#food-input").val().trim();
    foodBtnEl.push(newFood);
    getBeer(newFood);
});

function arrayButtons() {
    $("#button-view").empty();
    for (var i= 0; i < foodBtnEl.length; i++) {
        var buttonEl = $("<button>");

        buttonEl.addClass("food-btn");
        buttonEl.attr("data-name", foodBtnEl[i]);      
        buttonEl.attr("data-year", beerYear[i]);            
        buttonEl.text(foodBtnEl[i]);

        $("#button-view").prepend(buttonEl);
    }
}   
// google "attach event handler to a dynamic button"
$(document).on("click", ".food-btn", function(){ 
    var newFood= ($(this).attr("data-name")); 
    getBeer(newFood);
});

function getBeer(newFood) { 
    var userInput = newFood;
    var queryURL = "https://api.punkapi.com/v2/beers/?food=" + userInput;
    $.ajax({
        url: queryURL,
        method: "GET"         
    }).then(function(response) {
        var random = Math.floor(Math.random()*response.length);

        if (response[random].first_brewed.length === 7){
            var year = response[random].first_brewed.slice(3);
        } else{
            var year = response[random].first_brewed;
        }

        
        beerYear.push(year);

        arrayButtons(); 
        updateBeer(response, random);
        getMovie(year);            
    });
}        

function updateBeer(response,random) {
    $("#beer-view").empty();

    var beerDiv = $("<div class= 'beer-data'>");

    var name = response[random].name;                      
    var description = response[random].description;
    var foodPairing = response[random].food_pairing;
    var firstBrewedYear = response[random].first_brewed;
    if (firstBrewedYear.length === 7){
        firstBrewedYear = response[random].first_brewed.slice(3);
    } else{
        firstBrewedYear = response[random].first_brewed;
    }
    console.log(response);
    console.log(response[random].first_brewed);

    var pOne = $("<h5>").html("Beer Name :  " + name);
    var pTwo = $("<h6>").html("First-brewed Year :  " + firstBrewedYear);           
    var pThree = $("<h6>").html("Description : " +  '<br>' + description);
    var pFour = $("<h6>").html("Food Paring : " +  '<br>' + foodPairing);
    // null is a var not value
    var imgURL = response[random].image_url;
    if (imgURL === null){ 
        var image = $("<p>").text("Beer picture unavailable");
        image.addClass("no-poster");
    }else{
        var image = $("<img>").attr("src", imgURL);
        image.addClass("beer-img");
    }

    beerDiv.append(image);
    beerDiv.append(pOne,pTwo,pThree,pFour);
    $("#beer-view").append(beerDiv);
}        
// Where to see the year value that feeds into getMovie
function getMovie(year) {           
    var queryURL = "https://www.omdbapi.com/?apikey=3f779744&t=beer&y=" + year;  
    $.ajax({
    url: queryURL,
    method: "GET",
    }).then(function(response) {             
        updateMovie(response);
    });
}

function updateMovie(response) {
    $("#movie-view").empty();
    var movieDiv = $("<div class='movie-data'>");          
    console.log(response);
    var title = response.Title;
    var plot = response.Plot;
    var director = response.Director;
    var actors = response.Actors;           
    var country = response.Country;

    var pOne = $("<h5>").html("Title: " + title);
    var pTwo = $("<h6>").html("Plot: " + plot);
    var pThree = $("<h6>").html("Director: " + director);
    var pFour = $("<h6>").html("Actors: " + actors);            
    var pFive = $("<h6>").html("Country: " + country); 
    
    var imgURL = response.Poster;
    if (imgURL === "N/A"){
        var image = $("<p>").text("Movie Poster unavailable");
        image.addClass("no-poster");
    }else{
        var image = $("<img>").attr("src", imgURL);  
        image.addClass("movie-poster");  
    } 

    movieDiv.append(image);
    movieDiv.append(pOne,pTwo,pThree,pFour,pFive);

    $("#movie-view").append(movieDiv);
}      
arrayButtons();   