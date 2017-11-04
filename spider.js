let https = require('https');
let fs = require('fs');
//let request = require('request');
let http = require('http');

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

let response_handler = function (response) {
	let body = '';
	response.on('data', function (d) {
		body += d;
	});
	response.on('end', function () {
		console.log('\nRelevant Headers:\n');
		//for (var header in response.headers)
		// header keys are lower-cased by Node.js
		//if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
		//	 console.log(header + ": " + response.headers[header]);
		var contentUrl = [];
		var format = [];
		JSON.parse(body).value.forEach(function (element) {
			contentUrl.push(element.contentUrl);
			format.push(element.encodingFormat);
		}, this);
		/*contentUrl.forEach((ele) => {
			fs.appendFileSync(term + '_url.txt', ele + '\n');
		});
		format.forEach((ele) => {
			fs.appendFileSync(term + '_format.txt', ele + '\n');
		});*/
		for (let i = 0; i < contentUrl.length; i++) {
			//console.log(contentUrl[i]);
			var fileSize = 0;
			var fileData = [];
			if (contentUrl[i][4] == 's') {
				https.get(contentUrl[i], (res) => {
					res.setEncoding('binary');
					res.on('data', (chunk) => {
						fileSize += chunk.length;
						fileData.push(chunk);
					});
					res.on('end', () => {
						let a = new Date();
						var fileName = './image/' + term + a.getTime().toString() + '.' + format[i].toString();
						fs.writeFileSync(fileName, fileData, 'binary');
					});
					res.on('error', (err) => {
						console.log(err.message);
						return;
					});
				}).on('error', (err) => {
					console.log(err.message);
					return;
				});
			}
			else {
				http.get(contentUrl[i], (res) => {
					res.setEncoding('binary');
					res.on('data', (chunk) => {
						fileSize += chunk.length;
						fileData.push(chunk);
					});
					res.on('end', () => {
						let a = new Date();
						var fileName = './image/' + term + a.getTime().toString() + '.' + format[i].toString();
						fs.writeFileSync(fileName, fileData, 'binary');
					});
					res.on('error', (err) => {
						console.log(err.message);
						return;
					});
				}).on('error', (err) => {
					console.log(err.message);
					return;
				});
			}
		}
		//console.log('\nJSON Response:\n');
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