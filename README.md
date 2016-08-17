# grunt-artemplate-amd
> arttemplate compiler for amd

## Getting Started
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-artemplate-amd --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
//load task
grunt.loadNpmTasks('grunt-artemplate-amd');

//init task
grunt.initConfig({
	compileTemplate: {
		target: {
			files: [{
				expand: true,
				cwd: 'src',
				src: '*.tpl',
				dest: 'dist',
				ext: '.js'
			}]
		}
	}
});
```


