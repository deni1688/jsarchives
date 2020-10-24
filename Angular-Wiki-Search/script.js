var api = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=";
var limit = "&limit=20";
/*if your're trying to figure out how to solve the 'Access Denied Error'
on your freecodecamp challenge make sure you add this bit, "origin=*", in the API URL.
*/

var app = angular.module("wikiApp", []);

app.controller("mainCtrl", function($scope, $http, $sce) {

  $scope.search = "";
  
  $scope.searchWiki = function() {
    $scope.url = api + $scope.search + limit;
    $scope.wikiData = [];
    /*jsonp (as opposed ot 'get') is good if you want this to work on
    iOS Safari and IE, otherwise they block the request for security reasons*/
    $http.jsonp($sce.trustAsResourceUrl($scope.url)).then(function(response) {
      /*the object returned by wikipedia api is unusually structured
      so I am doing some formatting here into a more logical object format*/
      for (var x in response.data[1]) {
        $scope.wikiData.push({
          title: response.data[1][x],
          description: response.data[2][x],
          link: response.data[3][x]
        });
      }
    });
    $scope.search = "";
  }

});