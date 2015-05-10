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
    
