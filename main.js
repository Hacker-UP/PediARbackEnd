var exp = require('express');
var http = require('http');
var app = exp();
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var qs = require('querystring');
/*
http.get('http://www.runoob.com/wp-content/uploads/2015/09/expreqs2.jpg', (req) => {
	req.on('data', (chunk) => {
		console.log(String(chunk));
	});
	req.on('error', (err) => {
		console.log(err.message);
	});
});
*/
/*
app.get('/', (res, req) => {
	var url = "http://www.runoob.com/wp-content/uploads/2015/09/expreqs2.jpg"//res.url.substr(6, res.url.length - 1);
	http.get('http://image.baidu.com/pcdutu?queryImageUrl=' + url, (reqp) => {
		reqp.on('data', (chunk) => {
			//console.log(String(chunk));
			var imgUrl = [];
			cheerioLoad(imgUrl, String(chunk));
			//req.writeHead(200);
			//req.writeContinue();
			req.write(imgUrl.toString());
			return;
		});
		reqp.on('error', (err) => {
			console.log(err.message);
			//req.writeContinue();
			//req.writeHead(404);
			req.write(err.message);
			req.end();
			return;
		});
		reqp.setTimeout(3000, () => {
			console.log(123456);
			reqp.destroy();
			req.writeHead(555);
			return;
		});
	});
	//http.on('error', (err) => {
	//	console.log(err.message);
	//	req.write(err);
	//	return;
	//});
	console.log('Get!');
});
*/
var fileSize = 0;
var fileData = [];

app.get('/', (req, res) => {
	var args = url.parse(req.url).query.split('=');
	console.log(url.parse(req.url).query);
	if (args == '') {
		res.end(100);
	}
	if (args[0] == 'file') {
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
	}
	console.log('POST');
});

var server = app.listen(8086, () => {

});
console.log('OK');

http.createServer((request, response) => {
	var pathName = url.parse(request.url).pathname;
	console.log("Request for " + pathName + " Received.");
	if(pathName.substr(1)=='') pathName=path.join(pathName, 'index.html');
	console.log("Repair "+pathName);
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




function cheerioLoad(imgArray, testText) {
	var $ = cheerio.load(testText);
	$('.imglist-line').each(function (i, elem) {
		var img = $(this).find('img');
		img.each(function (i, elem) {
			imgArray.push($(this).attr('src'));
		})
	});
}
