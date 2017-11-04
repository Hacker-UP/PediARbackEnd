let https = require('https');
let fs = require('fs');
//let request = require('request');
let http = require('http');
let exp = require('express');
let app = exp();
let cheerio = require('cheerio');
let url = require('url');
let qs = require('querystring');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = 'bdf0fd11d2f2444dbd2db68f0f43aef4';

// Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
// search APIs.  In the future, regional endpoints may be available.  If you
// encounter unexpected authorization errors, double-check this host against
// the endpoint for your Bing Search instance in your Azure dashboard.
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/images/search';

let term = 'iPhone';

var fileSize = 0;
var fileData = [];

app.get('/', (req, res) => {
	var args = url.parse(req.url).query.split('=');
	console.log(url.parse(req.url).query);
	if (args == [] || args[0] == ' ') {
		res.end(100);
	}
	if (args[0] == 'word') {
		term = args[1];
		let response_handler = function (response) {
			let body = '';
			response.on('data', function (d) {
				body += d;
			});
			response.on('end', function () {
				console.log('\nRelevant Headers:\n');
				var contentUrl = [];
				var format = [];
				JSON.parse(body).value.forEach(function (element) {
					contentUrl.push(element.contentUrl);
					format.push(element.encodingFormat);
				}, this);
				var l = '';
				contentUrl.forEach((ele) => {
					l += ele + '\n';
				});
				res.end(l);
				console.log('success');
			});
			response.on('error', function (e) {
				console.log('Error: ' + e.message);
			});
		};

		let bing_image_search = function (search) {
			console.log('Searching images for: ' + term);
			let request_params = {
				method: 'GET',
				hostname: host,
				path: path + '?q=' + encodeURIComponent(search),
				headers: {
					'Ocp-Apim-Subscription-Key': subscriptionKey,
				}
			};

			let req = https.request(request_params, response_handler);
			req.end();
		}

		if (subscriptionKey.length === 32) {
			bing_image_search(term);
		} else {
			console.log('Invalid Bing Search API subscription key!');
			console.log('Please paste yours into the source code.');
		}
	}
	console.log('POST');
});

app.post('/', (req, res) => {
	//var args = url.parse(req.url).query.split('=');
	//console.log(url.parse(req.url).query);
	req.on('data', (chunk) => {
		console.log('data');
		fileData.push(chunk);
		fileSize += chunk.length;
	});
	req.on('end', () => {
		var buffer = Buffer.concat(fileData, fileSize);
		console.log('end');
		var a = new Date();
		a.getDate();
		var fileName = 'image/' + a.getTime().toString() + '.jpg';
		fs.writeFileSync('./' + fileName, buffer);
		//res.write(200);
		res.end('139.198.190.108:8086/' + fileName);
	});
	req.on('error', (err) => {
		console.log(err.message);
		res.writeHead(404);
		//res.end();
	});
});


console.log('OK');

var server = app.listen(8086, () => {

});

http.createServer((request, response) => {
	var pathName = url.parse(request.url).pathname;
	console.log("Request for " + pathName + " Received.");
	if (pathName.substr(1) == '') pathName = path.join(pathName, 'index.html');
	console.log("Repair " + pathName);
	fs.readFile(pathName.substr(1), (error, data) => {
		if (error) {
			console.log(error.message);
			response.writeHead(404, { 'Content-Type': 'text/html' });
		}
		else {
			response.writeHead(200);
			response.write(data);
		}
		response.end();
	});
}).listen(8087);
