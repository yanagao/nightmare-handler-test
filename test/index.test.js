// var test = require('../demo/demo1.js');
var expect = require('chai').expect;
var Nightmare = require('nightmare');

// var WebEventRecorder = require('../lib/tools/web-event-recorder').default;
var WebEventRecorder = require('../lib').WebEventRecorder;



var recorderResult = [];


describe('resize-image', function() {
	it('hhhhhhhhhhh', function() {
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
				for (var i = 0; i < recorderResult.length; i++) {
					if (recorderResult[i].args[3]) {
						try{
							expect(recorderResult[i].args[3]).to.have.string('https://www.baidu.com/')
						} catch(e) {
							console.log('dddd', i)
						}
					}
					
				}
			})
			.catch(function(error) {
				console.error('Search failed:', error);
			});
	});
});

