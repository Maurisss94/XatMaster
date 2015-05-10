angular.module('xatApp')
    .controller('IniciController', function($scope,SocketSrv) {
       $scope.$on('connected', function() {
           $scope.connected = true;
       });
       $scope.$on('nick', function(nick) {
           $scope.nick = nick;
           
       });
    $scope.$on('newUserKO', function() {
           console.log("L'usuari ja existeix!");
       });
        
        $scope.$on('newUserKO', function() {
           console.log("L'usuari OK!");
       });

    });