const slider = document.querySelector('.slider');
M.Slider.init(slider, {
    indicators: false,
    height: 500,
    transition: 500,
    interval:4000
})
$(document).ready(function() { 
    $('audio#pop')[0].play();
    var foodButton= [];
    var foodYear= [];
//1 -----------------------------------------------------
    function arrayButtons() {
        console.log(1);
        console.log(foodYear)
        $("#button-view").empty();
        for (var i= 0; i < foodButton.length; i++) {
            var button = $("<button>");

            button.addClass("food-btn");
            button.attr("data-name", foodButton[i]);      
            button.attr("data-year", foodYear[i]);            
            button.text(foodButton[i]);

            $("#button-view").prepend(button);
        }
    } 
//2 -----------------------------------------------------        
    $("#food-input").keypress(function(event){ 
    // $("#search").on("click", function(event) {             
        if(event.which === 13){
            var newFood = $("#food-input").val().trim();
            foodButton.push(newFood);
            newFood.val = "";   
        }
        // newFood 를 블러야 실행이 되는 것인데 실행시키지 않았었던 것
        // --> It executes only when I call getBeerData(newFood), but I didn't
        // newFood 버튼을 설정하고, 부르고, api 기능으로 실행시키는 것
        // --> Set the newFood button, Call it, execute with API
        getBeerData(newFood);            
    });
//3 ------------------------------------------------------ 
    $(document).on("click", ".food-btn", function(){
        var newFood= ($(this).attr("data-name")); 
        console.log($(this).attr("data-year"));
        getBeerData(newFood);
    });
//4  ------------------------------------------------------ 
    function getBeerData(newFood) { 
        var userInput = newFood;
        var queryURL = "https://api.punkapi.com/v2/beers/?food=" + userInput;
        $.ajax({
            url: queryURL,
            method: "GET"         
        }).then(function(response) {
            //console.log(response);
            var random = Math.floor(Math.random()*response.length);
            var year = response[random].first_brewed.slice(3);

            foodYear.push(year);

            arrayButtons();  // year 를 받기 전에 콜을 불렀기 때문에 아무것도 안나왔던것.
                            // --> I didn't get anything, because I call arrayButtons(), before I get the year data
                            // --> Now I get the year data, because I call arrayButton after I get the year data from API 
            showBeerData(response, random);
            getMovieData(year);
            //  $("#beerOutput").text(JSON.stringify(response));                
        });
    }        
//5 ------------------------------------------------------ 
    function showBeerData(response,random) {
        console.log("random");
        $("#beer-view").empty();

        var beerDiv = $("<div class= 'beer-data'>");

        var name = response[random].name;            
        var firstBrewed = response[random].first_brewed.slice(3);            
        var description = response[random].description;
        var foodPairing = response[random].food_pairing;
        
        var pOne = $("<h5>").html("Beer Name :  " + name);
        var pTwo = $("<h6>").html("First-brewed Year :  " + firstBrewed);           
        var pThree = $("<h6>").html("Description : " +  '<br>' + description);
        var pFour = $("<h6>").html("Food Paring : " +  '<br>' + foodPairing);

        var imageURL = response[random].image_url;
        var img = $("<img>").attr("src", imageURL);
        img.addClass("beer-img");
        beerDiv.append(img);
        beerDiv.append(pOne,pTwo,pThree,pFour);
       
        $("#beer-view").append(beerDiv);
    }        
//6  ------------------------------------------------------ 
    function getMovieData(year) {            
        // var movie = $(this).attr("data-name");
        var queryURL = "http://www.omdbapi.com/?apikey=3f779744&t=beer&y=" + year;  
        $.ajax({
        url: queryURL,
        method: "GET",
        }).then(function(response) {             
            showMovieData(response);
        });
    }
//7 ------------------------------------------------------
    function showMovieData(response) {
        $("#movie-view").empty();
        var movieDiv = $("<div class='movie-data'>");          
        
        var title = response.Title;
        var plot = response.Plot;
        var director = response.Director;
        var actors = response.Actors;           
        var country = response.Country;

        var pOne = $("<p>").text("Title: " + title);
        var pTwo = $("<p>").text("Plot: " + plot);
        var pThree = $("<p>").text("Director: " + director);
        var pFour = $("<p>").text("Actors: " + actors);            
        var pFive = $("<p>").text("Country: " + country); 
        
        var imgURL = response.Poster;
        var image = $("<img>").attr("src", imgURL);  
        image.addClass("movie-poster");        
        movieDiv.append(image);
        
        movieDiv.append(pOne,pTwo,pThree,pFour,pFive);

        $("#movie-view").append(movieDiv);
    }      
arrayButtons();   
});