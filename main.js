var exp = require('express');
var http = require('http');
var app = exp();
var fs = require('fs');
var cheerio = require('cheerio');
/*
http.get('http://www.runoob.com/wp-content/uploads/2015/09/express2.jpg', (res) => {
	res.on('data', (chunk) => {
		console.log(String(chunk));
	});
	res.on('error', (err) => {
		console.log(err.message);
	});
});
*/

app.get('/', (req, res) => {
	var url = "http://www.runoob.com/wp-content/uploads/2015/09/express2.jpg"//req.url.substr(6, req.url.length - 1);
	http.get('http://image.baidu.com/pcdutu?queryImageUrl=' + url, (resp) => {
		resp.on('data', (chunk) => {
			console.log(String(chunk));
			var imgUrl = [];
			cheerioLoad(imgUrl, String(chunk));
			//res.writeHead(200);
			//res.writeContinue();
			res.write(imgUrl.toString());
			return;
		});
		resp.on('error', (err) => {
			console.log(err.message);
			//res.writeContinue();
			//res.writeHead(404);
			res.write(err.message);
			res.end();
			return;
		});
		resp.setTimeout(3000, () => {
			console.log(123456);
			resp.destroy();
			res.writeHead(555);
			return;
		});
	});
	//http.on('error', (err) => {
	//	console.log(err.message);
	//	res.write(err);
	//	return;
	//});
	console.log('Get!');
});

var fileSize = 0;
var fileData = [];

app.post('/', (res, req) => {
	res.on('data', (chunk) => {
		fileData.push(chunk);
		fileSize += chunk.length;
	});
	res.on('end', () => {
		var buffer = Buffer.concat(fileData, fileSize);
		var a = new Date();
		a.getDate();
		fs.writeFileSync('/image/' + a.getDate().toString() + '.png', buffer);
		req.writeHead(200);
		//req.end();
	});
	res.on('error', (err) => {
		console.log(err.message);
		req.writeHead(404);
		//req.end();
	});
});

var server = app.listen(8086, () => {

});
console.log('OK');




function cheerioLoad(imgArray, testText) {
	var $ = cheerio.load(testText);
	$('.imglist-line').each(function (i, elem) {
		var img = $(this).find('img');
		img.each(function (i, elem) {
			imgArray.push($(this).attr('src'));
		})
	});
}
