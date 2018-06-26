// var test = require('../demo/demo1.js');
var expect = require('chai').expect;
var Nightmare = require('nightmare');

// var WebEventRecorder = require('../lib/tools/web-event-recorder').default;
var WebEventRecorder = require('../lib').WebEventRecorder;



var recorderResult = [];
// var fs = require('fs'),
// 	path = require('path');

describe('CDN资源', function() {

	// beforeEach(function() {
	it('符合', function() {
		// 更多选项可参考 https://github.com/segmentio/nightmare#nightmareoptions
		var nightmare = Nightmare({
			show: true
		});
		var recorder = new WebEventRecorder(nightmare);

		// 执行
		// nightmare.goto('http://www.baidu.com')
		nightmare.goto('http://now.qq.com')
			// .type('form[action*="/s"] [name=f]', 'nightmare')
			// .click('form[action*="/s"] [type=submit]')
			// .wait('#content_left')
			.wait(3000)
			.evaluate(function() {
				return Array.from(document.querySelectorAll('#container'))
					.map(function(item) {
						console.log(item)
						return item;
					});
			})
			.end()
			.then(function(result) {
				// console.log(result);
				// console.log(recorder.toString());
				// it('符合', function() {
					recorderResult = JSON.parse(recorder.toString());
					// console.log(recorderResult[13])

					// fs.writeFile(__dirname + '/now.js', recorder.toString(), {flag: 'a'}, function (err) {
					//    	if(err) {
					//     	console.error(err);
					//     } else {
					//        	console.log('写入成功');
					//     }
					// });

					console.log('-----------------------------')
					console.log('----------非CDN域名----------')
					console.log('-----------------------------')
					for (var i = 0; i < recorderResult.length; i++) {
						if (recorderResult[i].eventName === 'did-get-response-details' && recorderResult[i].args[7] && recorderResult[i].args[7]['content-type'] && (recorderResult[i].args[7]['content-type'][0].indexOf('image') !== -1)) {
							if (recorderResult[i].args[3]) { // CDN判断
								try {
									expect(recorderResult[i].args[3]).to.match(/pic\.url\.cn|qpic\.url\.cn/) // pic.url.cn和qpic.url.cn为CDN域名，p.qlogo.cn和p.qpic.cn为非CDN域名
								} catch(e) {
									console.log('第', i, '条', recorderResult[i].args[3], '为非CDN域名')
								}
							} else {
								console.log('第', i, '条', recorderResult[i].args[3], '为非CDN域名')
							}
						}
					}
					console.log('--------------------------------')
					console.log('----------图片大小超限----------')
					console.log('--------------------------------')
					for (var i = 0; i < recorderResult.length; i++) {
						if (recorderResult[i].eventName === 'did-get-response-details') {
							if (recorderResult[i].args[7] && recorderResult[i].args[7]['content-type'] && (recorderResult[i].args[7]['content-type'][0].indexOf('image') !== -1)) { // 图片尺寸
								try {
									expect(parseInt(recorderResult[i].args[7]['content-length'][0])).to.be.at.most(80000)
								} catch(e) {
									console.log('第', i, '条', recorderResult[i].args[3], '图片大小超限')
								}
							}
						}
					}
				// });
			})
			.catch(function(error) {
				console.error('Search failed:', error);
			});
	});
});

