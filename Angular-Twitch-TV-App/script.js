

var app = angular.module('twitchApp', []);

app.controller('mainController', function($scope, $http) {
  $scope.search = '';
  
  //empty stream arrays for 'all', 'online', and 'offline' channels
  $scope.all = [];
  $scope.online = [];
  $scope.offline = [];
  //streams
  var channels = ['freecodecamp',
                  'ESL_SC2',
                  'OgamingSC2',
                  'xMattGaming',
                  'Adobe',
                  'VoidStriker1523',
                  'denaesketch',
                  'PETERDRAWS',
                  'cretetion',
                  'RobotCaleb',
                  'noobs2ninjas',
                  'comster404'];
  
  //url base
  var apiUrl = 'https://api.twitch.tv/kraken/';
  var callback = '?client_id=nwrvv9tvyp82s907mn7z19bbajoeze';
  
  
  channels.forEach(function(channel) {
    //empty object to be pushed into the all channels array
    var dataObj = {};
      $.getJSON(apiUrl + 'streams/' + channel + callback, function(data) {
        var userIsStreaming = false; 
        if(data.stream !== null){
          userIsStreaming = true;
        }
        //checking for active stream and setting channel obejct accordingly
        if(data.stream !== null){
          dataObj.stream = data.stream.channel.status;
          dataObj.link = data.stream.channel.url;
        }else{
          dataObj.stream = 'Offline';
        }
        //second request needed to get standard channel info such as the logo and name
        //this is info we could get from the first http response but only if the channel
        //is currently streaming content
        $.getJSON(apiUrl + 'channels/' + channel + callback, function(data) {
          dataObj.name = data.name;
          dataObj.icon = data.logo;
          $scope.$apply()
      }).fail(function(err) {
      dataObj.name = channel;
            dataObj.icon = 'http://placehold.it/300x300';
            dataObj.stream = 'This channel is no longer available';
   });
        //this is the main block of code to filter the online and offline channels into their respective arrays
        $scope.all.push(dataObj);
     $scope.$apply()
        if(userIsStreaming){
          $scope.online.push(dataObj);
        }else{
          $scope.offline.push(dataObj);
        }
      });
     
  });
 
});

