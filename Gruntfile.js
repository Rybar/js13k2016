module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {

			scripts: {
				files: ['src/js/**/*.js'],
				tasks: ['concat:dist', 'uglify:development'],
			},
			css: {
				files: 'src/css/**/*.less',
				tasks: ['less:development']
			}

		},
		express:{
			all:{
				options:{
					port:3000,
					hostname:'localhost',
					bases:['./'],
					livereload:false
				}
			}
		},

		concat : {
			dist : {
				src  : [
					'src/js/first.js',
					'src/js/stats.js',
					'src/js/main.js',
					'src/js/statemachine.js',
					'src/js/states/states.js',
					'src/js/states/gameState.js',
					'src/js/states/menuState.js',

					'src/js/Player.js',
					'src/js/Enemy.js',
					'src/js/Glitchbox.js',
					'src/js/input.js',
					'src/js/assets.js',
					'src/js/text.js',
					'src/js/Particle.js',
					'src/js/Pool.js',
					'src/js/Entity.js',
					'src/js/sonantx.js',
					'src/js/last.js'
				],
				dest : 'build/concat.js'
			}
		},

		inline: {
			dist: {
				options:{
					tag: '',
					cssmin: true
				},
				src: 'build/index.html',
				dest: 'dist/index.html'
			}
		},

		uglify: {
			development: {
				options: {
					mangle: false,
				},
				files: {
					'build/game.js':
					[
						'build/concat.js'
					]
				}
			},
			compressed: {
				options: {
					mangle: true,
					compress: {
						//TODO: Optimize using compressor options (https://github.com/mishoo/UglifyJS2#compressor-options)
						dead_code: true,
						drop_debugger: true,
						sequences: true,
						properties: true,
						evaluate: true,
						loops: true,
						unused: true,
						screw_ie8: true,
						hoist_funs: false,
						unsafe: true,
						unsafe_comps: true,
						conditionals: true,

						//source-map:

					}
				},
				files: {
					'build/game.js':
						[
							'build/concat.js'
						]
				}
			}
		},
		less: {
			development: {
				files: {
					"build/style.css": "src/css/*.less"
				}
			},
			compressed: {
				files: {
					"build/style.css": "src/css/*.less"
				},
				compress: true,
			}
		},

		htmlmin: {
			development: {
				options: {
					removeComments: false,
					collapseWhitespace: false,
				},
				files: {
					'build/index.html': 'src/index.html'
				}
			},
			compressed: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
				},
				files: {
					'build/index.html': 'src/index.html'
				}
			}
		},

		compress: {
			main: {
				options: {
					archive: 'dist/game.zip',
					mode: 'zip',
					level: 9,
				},
				files: [{
					expand: true,
					flatten: true,
					cwd: './',
					src: ['dist/index.html'],
					dest: './'
				}]
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-inline');
	grunt.loadNpmTasks('grunt-closure-compiler');

	var fs = require('fs');
	grunt.registerTask('sizecheck', function() {
		var done = this.async();
		fs.stat('dist/game.zip', function(err, zip) {
			if (zip.size > 13312) {
				//If size in bytes greater than 13kb
				grunt.log.error("Zipped file greater than 13kb \x07 \n");
				grunt.log.error("Zip is " + zip.size + " bytes when js13k max is 13,312 bytes");
			}
			done();
		});
	});

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['concat:dist', 'less:development', 'htmlmin:development',] );
	grunt.registerTask('build-compress', ['concat:dist', 'less:compressed', 'htmlmin:compressed', 'uglify:compressed', 'inline:dist', 'compress:main', 'sizecheck']);
	//grunt.registerTask('build-compress', ['concat:dist','closure-compiler', 'less:compressed', 'htmlmin:compressed', 'inline:dist', 'compress:main', 'sizecheck']);
	grunt.registerTask('server', ['concat:dist','express','watch']);
};