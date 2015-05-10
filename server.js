var app = require('express')();
var http = require("http").Server(app);  //necessitem http per treballar amb socket.io

app.use('/',require("./controllers/static"));

require("./controllers/xat")(http);


http.listen(8000, process.env.IP,function() {
    console.log('listening on host '+process.env.IP+':'+8000);
});
