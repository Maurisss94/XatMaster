angular.module('xatApp')
    .controller('XatControler', function($scope,SocketSrv) {
        $scope.missatges = [];
        $scope.contador = 0;
        $scope.usuaris = null;

        SocketSrv.getMessage(function(m) {
            $scope.missatges.push({'pos':$scope.contador++,'missatge':m});
            
        });
    $scope.enviar = function() {
            //console.log(SocketSrv.getNick());
            
            SocketSrv.sendMessage({"codi": "123", "nick":SocketSrv.getNick(), "missatge": $scope.missatge});
            $scope.missatge = "";
        };
    $scope.$on('usuarisNous', function(){
       $scope.usuaris = SocketSrv.getUsuaris();
        console.log($scope.usuaris);
        console.log("hola");
    });
        
    });