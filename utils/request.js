// 导入http模块
var http = require('http');
var qs = require('querystring');

function get(uri, data) {
	return new Promise((resolve, reject) => {
		var params = qs.stringify(data);
		params = params ? ("?" + params) : params;
		http.get(uri + params, (res) => {
			res.setEncoding('utf8');
			var rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				try {
					var parsedData = JSON.parse(rawData.toString());
					resolve(parsedData);
				} catch (e) {
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject(e.message);
		});
	});
}

function post(uri, data, headers) {
	return new Promise((resolve, reject) => {
		const options = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: "POST"
		};
		if(headers) {
			options.headers["token"] = headers.token || "";
		}
		const postData = qs.stringify(data);
		const req = http.request(uri, options, (res) => {
			res.setEncoding('utf8');
			var rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				try {
					var parsedData = JSON.parse(rawData.toString());
					resolve(parsedData);
				} catch (e) {
					reject(e.message);
				}
			});
		});
		
		req.on('error', (e) => {
			reject(e.message);
		});
		
		// 将数据写入请求主体。
		req.write(postData);
		req.end();
	});
}

module.exports = {
	get,
	post
};
