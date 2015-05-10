angular.module('xatApp')
    .controller('NickController',function ($scope,SocketSrv,$location) {
    
    $scope.error= false;
        $scope.entrar = function(){
            console.log($scope.nick);
            SocketSrv.user($scope.nick);
            
        };
        $scope.$on('newUserOk', function() {
            $location.path('/xat');
        });
        $scope.$on('newUserKO',function() {
            $scope.$apply(function() {
                console.log("Error!!");
                $scope.error=true;
            });
    });
});