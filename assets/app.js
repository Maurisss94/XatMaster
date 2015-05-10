angular.module('xatApp',['ngRoute']);
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
angular.module('xatApp')
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: 'inici.html',
                autoritzat: false
            })
            .when("/user", {
                controller: "NickController",
                templateUrl: 'user.html',
                autoritzat: false
            })
            .when("/xat", {
                controller: "XatControler",
                templateUrl: 'xat.html',
                autoritzat: true
            })
            .otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode({
                          enabled: true,
                          requireBase: false
            });
    })
    .run(function($rootScope,SocketSrv) {
        $rootScope.$on('$routeChangeStart', function(event, next) {
           if (next)
                if (!SocketSrv.getAuth() & next.autoritzat) 
                    event.preventDefault();
        });
    });
angular.module('xatApp')
    .factory('SocketSrv', function($rootScope) {
        var socket = io().connect();
        var usuaris = null;
        socket.on('connect',function(s) {

            $rootScope.$broadcast('connected');
            $rootScope.$apply(); //This tells AngularJS that it needs to check the state of the application and update the templates
        });
    socket.on('usuaris', function(users){
       usuaris = users; 
        $rootScope.$broadcast('usuarisNous');
    });
        var nick;
        var auth = false;
        return {
            user: function(name) {
                socket.emit('newUser',{codi: "0", nick: name, missatge:""});
                
                socket.on('newUserOk', function() {
                    nick = name;
                    auth = true;
                    $rootScope.$broadcast('newUserOk');
                    $rootScope.$apply();
                });
                socket.on('newUserKO', function(){
                    nick=name;
                    auth=true;
                    $rootScope.$broadcast('newUserKO');
                     $rootScope.$apply();
                });
                
                
                
            },
            getNick: function() {
                return nick;
            },
            getAuth: function(){
                return auth;
            },
            disconnect: function(callback) {
                socket.disconnec();
                $rootScope.$apply(function() {
                    callback.apply(socket); 
                });
                auth = false;
            },
            sendMessage: function(msg) {
                socket.emit('message', msg);
            },
            getMessage: function(callback) {
                socket.on('message',function(m) {
                    $rootScope.$apply(function() {
                        callback(m);
                    });
                    
                });
            },
            connected: function() {
                return socket.connected;
            },
            getUsuaris: function(){
                return usuaris;
            }

        };
    });
    

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