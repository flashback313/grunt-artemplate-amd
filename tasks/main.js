'use strict';

module.exports = function(grunt) {
	var path = require('path');

	grunt.registerMultiTask('compileTemplate', 'compile Template', function() {
		var options = this.options({
			openTag: '<%',
			closeTag: '%>',
			tag: /<script([^>]*?)>([\w\W]*?)<\/script>/ig,
			type: /type=("|')text\/html\1/i,
			id: /id=("|')([^"]+?)\1/i
		});
		/** 模板合并 */
		var combine = function(code) {
			var $config = options;
			var rtag = $config.tag;
			var rtype = $config.type;
			var rid = $config.id;
			var string = [];
			var val;
			// 提取模板片段
			while ((val = rtag.exec(code)) !== null) {
				if (rtype.test(val[1])) {
					string.push(compress(val[1].match(rid)[2], val[2], $config));
				}
			}
			string = string.join('\r\n')
			if (!string) {
				string = compress('{id}', code, $config);
			}

			return string;
		};
		/** 压缩模板 */
		var compress = function(id, code, $config) {
			var openTag = $config.openTag;
			var closeTag = $config.closeTag;
			if (typeof template !== 'undefined') {
				openTag = template.openTag;
				closeTag = template.closeTag
			}

			function html(text) {
				return text
					// 多个空格合并
					.replace(/\s+/g, ' ')
					// 反斜杠转义
					.replace(/\\/g, "\\\\")
					// "'" 转义
					.replace(/'/g, "\\'")
					// 去除 HTML 注释
					.replace(/<!--(.|\n)*?-->/g, '')
					// 去除多余制表符、TAB符、回车符
					.replace(/\n/g, '')
					.replace(/[\r\t]/g, ' ');
			};

			function logic(text) {
				text = text
					// 去除 js 注释
					.replace(/\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$/g, '')
					// "'" 转义
					.replace(/'/g, "\\'")
					// 去除多余制表符、TAB符、回车符
					.replace(/\n/g, '')
					.replace(/[\r\t]/g, ' ');
				return openTag + text.trim() + closeTag;
			};
			// 语法分析
			var strings = '';
			code.split(openTag).forEach(function(text, i) {
				text = text.split(closeTag);
				var $0 = text[0];
				var $1 = text[1];
				// text: [html]
				if (text.length === 1) {
					strings += html($0);
					// text: [logic, html]
				} else {
					strings += logic($0);
					if ($1) {
						strings += html($1);
					}
				}
			});
			code = strings;
			// ANSI 转义
			var unicode = [],
				ansi;
			for (var i = 0; i < code.length; i++) {
				ansi = code.charCodeAt(i);
				if (ansi > 255) {
					unicode.push('\\u' + ansi.toString(16));
				} else {
					unicode.push(code.charAt(i));
				}
			}
			code = unicode.join('').trim();
			code = "define(function(){return '" + code + "'});";
			return code;
		};
		this.files.forEach(function(f) {
			var contents = f.src.filter(function(filepath) {
				// Remove nonexistent files (it's up to you to filter or warn here).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				// Read and return the file's source.
				return combine(grunt.file.read(filepath));
			}).join('\n');
			// Write joined contents to destination filepath.
			grunt.file.write(f.dest, contents);
			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
			return false;
		});
	});
}