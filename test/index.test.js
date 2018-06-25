// var test = require('../demo/demo1.js');
var expect = require('chai').expect;
var Nightmare = require('nightmare');

// var WebEventRecorder = require('../lib/tools/web-event-recorder').default;
var WebEventRecorder = require('../lib').WebEventRecorder;



var recorderResult = [];


describe('CDN资源', function() {
	it('符合', function() {
		// 更多选项可参考 https://github.com/segmentio/nightmare#nightmareoptions
		var nightmare = Nightmare({
			show: true
		});
		var recorder = new WebEventRecorder(nightmare);

		// 执行
		nightmare.goto('http://www.baidu.com')
			.type('form[action*="/s"] [name=f]', 'nightmare')
			.click('form[action*="/s"] [type=submit]')
			.wait('#content_left')
			.evaluate(function() {
				return Array.from(document.querySelectorAll('#content_left .c-container'))
					.map(function(item) {
						return item.querySelector('.t').innerText;
					});
			})
			.end()
			.then(function(result) {
				// console.log(result);
				// console.log(recorder.toString());
				recorderResult = JSON.parse(recorder.toString());
				console.log(recorderResult[3])
				// console.log(recorderResult[13])
				for (var i = 0; i < recorderResult.length; i++) {
					if (recorderResult[i].args[3]) { // CDN判断
						try {
							expect(recorderResult[i].args[3]).to.match(/pic\.url\.cn|qpic\.url\.cn/) // pic.url.cn和qpic.url.cn为CDN域名，p.qlogo.cn和p.qpic.cn为非CDN域名
						} catch(e) {
							// console.log('第', i, '条为非CDN域名')
						}
					} else {
						// console.log('第', i, '条为非CDN域名')
					}
					if (recorderResult[i].args[7] && (recorderResult[i].args[7]['content-type'][0].indexOf('image') !== -1)) { // 图片尺寸
						try {
							expect(parseInt(recorderResult[i].args[7]['content-length'][0])).to.be.at.most(80000)
						} catch(e) {
							console.log(recorderResult[i].args[3], '图片大小超限')
						}
					}
					
				}
			})
			.catch(function(error) {
				console.error('Search failed:', error);
			});
	});
});

