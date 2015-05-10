module.exports = function(http) {
    var usuaris = {};  //usuaris contindrà tots els usuaris connectats al xat
    
    var io = require("socket.io")(http);  //sockect.io necessita http per funcionar
    
    io.on('connection', function(socket) {
        
        socket.on('disconnect', function(){
            /*
                Quan es disconnecta un usuari
                del xat, l'esborrem de la 
                variable usuaris i avisem
                a la resta d'usuaris del xat
            */
            
            io.emit('message', usuaris[socket.io] + ' ha marxat');
            delete usuaris[socket.id];
            io.emit('usuaris', usuaris);
            
        });
        socket.on('newUser', function(user) {
            /* Quan s'incorpora un nou usuari al xat
                l'afegim a la variable usuaris
                i enviem un missatge a la resta 
                d'usuaris avisam que hi ha un nou
                usuari
            */
            var repetit = false;
            
            for(x in usuaris) {
                if(usuaris[x] == user.nick){
                    repetit = true;
                }
            }
            
            if (!repetit) {
                usuaris[socket.id] = user.nick;
                socket.emit('newUserOk');
                io.emit('message', {"codi": "0", "nick": user.nick, "missatge": " s'ha afegit al xat"});
                io.emit('usuaris', usuaris);
            } else { 
                
                io.emit('message', {"codi": "0", "nick": user.nick, "missatge": " ha marxat"});
                socket.emit('newUserKO');             
                io.emit('usuaris', usuaris);
                
                
            }

            console.log(usuaris);
            
            
        });
        
        socket.on('message', function(msg) {
            // Quan un usuari envia un missatge l'enviem a la resta de usuaris en el xat
            io.emit('message', msg);
        });
      
    });
};
