/* Notes: I initially only returned one page of movies that were currently popular
   and they were searchable. However, after doing some research I was inspired by this demo 
   http://stfdoboj.net/movie/#/movies on how to make the search a bit more dynamic.
   
   The key difference is that I am now using the $watch service to watch the search input and apply
   some conditional logic to choose which movies return. The only thing I don't like about this method
   is that it makes a new request every time the user types 2 or more characters. 
   
   I will probably reconfigure it to show a page at a time and allow the user to go through the pages
   using pagnation.*/


(function(){
var app = angular.module("moviesApp", []);

app.controller("searchMoviesCtrl", function($http, $scope) {

  $scope.search = "";
  $scope.$watch('search', function() {
    if ($scope.search.length >= 2) {
      searchAll();
    } else {   
      showPopular();
    }
  });

  $scope.listOfMovies;
  $scope.baseUrl = "http://image.tmdb.org/t/p/w300/";

  function searchAll() {
    $http.get('https://api.themoviedb.org/3/search/movie?api_key=3fcc4c18d6df53c06d2776ee56df1918&language=en-US&query=' + $scope.search + '&page=1&include_adult=false').then(function(response) {
      $scope.listOfMovies = response.data.results
    });
  }

   
  function showPopular() {
    $http.get('https://api.themoviedb.org/3/movie/popular?api_key=3fcc4c18d6df53c06d2776ee56df1918&language=en-US&page=1').then(function(response) {
      $scope.listOfMovies = response.data.results
    });
  }

});
  
}());//end of SIF
