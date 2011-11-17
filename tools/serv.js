var ip = "127.0.0.1",
	port = 80,
	localPath = "../";

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
	io = require('socket.io'),
	requirejs = require("./r");

// function define(files, callBack) {
	// if(typeof(files)=="string") require(path + files + ".js");
	// else {
		// var f
		// for(f in files) {
			// require(path + f + ".js");
		// }
	// }
	// if(callBack) callBack();
// };

app = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
		if(uri=="/") uri = "/index.html";
    var filename = path.join(process.cwd(), localPath, uri);
    path.exists(filename, function(exists) {
    	if(!exists) {
    		response.writeHead(404, {"Content-Type": "text/plain"});
    		response.write("404 Not Found\n");
			console.log("file not found: "+filename);
    		response.end();
    		return;
    	}

    	fs.readFile(filename, "binary", function(err, file) {
    		if(err) {
    			response.writeHead(500, {"Content-Type": "text/plain"});
    			response.write(err + "\n");
    			response.end();
    			return;
    		};

        var fileEnd = filename.split(".").pop();
				switch(fileEnd) {
					case "js":
						response.writeHead(200, {"Content-Type": "text/javascript"});
						response.write(file);
						break;
					case "html":
						response.writeHead(200, {"Content-Type": "text/html"});
						response.write(file);
						break;
					case "css":
						response.writeHead(200, {"Content-Type": "text/css"});
						response.write(file);
						break;
					case "gif":
						response.writeHead(200, {"Content-Type": "image/gif"});
						response.write(file, "binary");
						break;
					case "ico":
						response.writeHead(200, {"Content-Type": "image/ico"});
						response.write(file, "binary");
						break;
				};
				response.end();
    	});
    });
});

requirejs.config({
	baseUrl: "../src"
});

requirejs(["tree/tree", "data/data", "process/process", "estim/estim", "copula/copula", "formal/formal", "ui/ui"]);

// plug the print function to console
sylv.ui.print = function(val, nl) {
	var txt = val?val.toString():"";
	console.log(txt);
};

// connect socket.io
sio = io.listen(app)
sio.set('log level', 1);
sio.sockets.on('connection', function (socket) {
	globalSync.setSocket(socket);
});

app.listen(port, ip);

console.log("Server running at http://"+ip+":"+port+"/");
