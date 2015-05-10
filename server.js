var app = require('express')();
var http = require("http").Server(app);  //necessitem http per treballar amb socket.io
var port = process.env.PORT || 8080;
app.use('/',require("./controllers/static"));

require("./controllers/xat")(http);


http.listen(port, process.env.IP,function() {
    console.log('listening on host '+process.env.IP+':'+port);
});
