var gcm = require('node-gcm');
var http = require('http');
var url = require('url');

var apiKey = "your_app_key"; 

var RETRY = 3;
http.createServer(function(request, response) {
	var sender = new gcm.Sender(apiKey);
	
    var message = new gcm.Message();
    message.collapseKey = 'your_name_space' + Math.floor((Math.random() * 1000000) + 1);
    message.delayWhileIdle = false;
    message.timeToLive = 3;
    message.dryRun = false;    

    var regIds = [];    
	try {	
        var query = url.parse(request.url, true).query;

        console.log('query', query);
        
        message.addData('title', 'Your App Name' );
        message.addData('message', query.message);	
        
        regIds.push(query.regId);

        sender.send(message, regIds, RETRY, function (err, result) {
            if (err) {
                console.log("Something has gone wrong! ", err);
            } else {
                console.log("Sent with message: ", result);
            }
        });

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('message= ' + query.message);

        console.log("success!!!");
	} catch(e) {
		console.log("error");
		console.log(e);
	}	
  
}).listen(52271, function() {
	console.log('Android Server running at port 52271');
});
