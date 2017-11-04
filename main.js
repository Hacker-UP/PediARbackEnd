var exp = require('express');
var http = require('http');
var app = exp();
/*
http.get('http://image.baidu.com/pcdutu?queryImageUrl=http%3A%2F%2Fd.hiphotos.baidu.com%2Fimage%2Fh%253D300%2Fsign%3Dbd3055ccc41b9d1695c79c61c3dfb4eb%2Fbba1cd11728b471072e43adfc9cec3fdfd0323de.jpg', (res) => {
	res.on('data', (chunk) => {
		console.log(String(chunk));
	});
	res.on('error', (err) => {
		console.log(err.message);
	});
});
*/
console.log('OK!');

app.get('/', (req, res) => {
	console.log('Get!');
	var url = req.url.substr(6, req.url.length - 1);
	http.get('http://image.baidu.com/pcdutu?queryImageUrl=' + url, (resp) => {
		resp.on('data', (chunk) => {
			console.log(String(chunk));
		});
		resp.on('error', (err) => {
			console.log(err.message);
			res.send(JSON.parse('{code:404}'));
		});
	});
});

var server = app.listen(8086, () => {
});
console.log('OK');