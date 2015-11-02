module.exports = function(grunt) {
	var modRewrite = require('connect-modrewrite');
	
	grunt.initConfig({
		compass: {
			dist: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'www/css',
                    imagesDir: 'Visual Assets',
                    environment: 'development',
                    sourcemap: false
                }				
			}
		},
		watch: {
            scss: {
                files: [
                    'scss/**/*.scss','scss/*.scss'],
                tasks: ['compass:dist'],
                options: {
                    spawn: true,
                    interval: 1500
                }
            },
            scripts: {
                files: 'www/js/**/*.js',
                tasks: ['js'],
                options: {
                    spawn: true,
                    interval: 1500
                }
            },
            html: {
                files: 'www/templates/**/*.html',
                tasks: ['html'],
                options: {
                    spawn: true,
                    interval: 1500
                }
            },
            liveReload: {
                files: ['www/js/**/*.js', 'www/templates/**/*.html',
                    'www/css/**/*.css'
                ],
                options: {
                    livereload: 35729,
                    interval: 1500
                }
            }
        },
        instrument: {
            files: 'www/js/**/*.js',
            options: {
                lazy: true,
                basePath: "www/instrumented/"
            }
        },
        concurrent: {
            watcher: ['watch', 'connect:server'],
            options: {
                logConcurrentOutput: true
            }
        },
        // clean: {
        //     instrumented: ['www/instrumented'],
        //     webBower: [
        //         distPath + '/app.js',
        //         distPath + '/lib/**/*.{css,scss,js,html}'
        //     ],
        //     dist: [
        //         './dist'
        //     ]
        // },
        scsslint: {
            allFiles: ['scss/**/*.scss'],
            options: {
                config: '.scss-lint.yml',
                colorizeOutput: true,
                reporterOutput: null
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['www/js/{*,**/*}.js']
        },
        includeSource: {
            options: {
                basePath: 'www',
                baseUrl: '',
                templates: {
                    html: {
                        js: '<script src="{filePath}"></script>'
                    }
                }
            },
            dev: {
                files: {
                    'www/index.html': 'www/index.tmpl'
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: 'www',
                    open: true,
                    keepalive: true,
                    middleware: function(connect, options, middlewares) {
                        middlewares.unshift(function(req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', '*');
                            return next();
                        });

                        middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
                        options.base.forEach(function(base) {
                            middlewares.push(connect.static(base));
                        });

                        middlewares.push(require('connect-livereload')());
                        return middlewares;
                    }
                }
            }
        }
	});
	require('jit-grunt')(grunt);
	// grunt.registerTask('default', ['js', 'html', 'compass:dist', 'concurrent:watcher']);
	grunt.registerTask('default', ['js', 'html', 'compass:dist', 'concurrent:watcher']);
    grunt.registerTask('js', []);
    grunt.registerTask('html', []);
};