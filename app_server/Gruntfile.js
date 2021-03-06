module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      all: {
        files: [{
          expand: true,
          cwd: './public/js',
          src: ['*.js'],
          dest: './public/js',
          ext: '.js'
        }]
      }
    },

    browserify: {
      options: {
        transform: [
          ['babelify', {
            presets: ['es2015'],
            plugins: ['transform-object-assign']
          }]
        ]
      },
      debug: {
        options: {
          browserifyOptions: {
            debug: true
          }
        },
        files: {
          './public/js/app.js': ['./public/src/js/modules/app.js']
        }
      },
      dist: {
        files: {
          './public/js/app.js': ['./public/src/js/modules/app.js']
        }
      }
    },

    sass: {
      options: {
        includePaths: ['./node_modules/materialize-css/sass/']
      },
      debug: {
        options: {
          outputStyle: 'expanded',
          sourceMap: true
        },
        files: {
          './public/css/style.css': './public/src/css/style.scss'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          './public/css/style.css': './public/src/css/style.scss'
        }
      }
    },
    
    copy: {
      main: {
        files: [
          {
            src: './node_modules/jquery/dist/jquery.min.js',
            dest: './public/js/jquery.js'
          },
          {
            src: './node_modules/materialize-css/dist/js/materialize.min.js',
            dest: './public/js/materialize.js'
          }
        ]
      }
    },
    
    connect: {
      server: {
        options: {
          port: 3001,
          base: 'public'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('debug', ['browserify:debug', 'copy', 'sass:debug']);
  grunt.registerTask('default', ['browserify:dist', 'copy', 'uglify', 'sass:dist']);
  grunt.registerTask('casperjs-test', function () {
    var done = this.async();
    
    grunt.util.spawn({
      cmd: 'casperjs',
      args: ['test', 'public/src/test/tests', '--root=http://localhost:3001/index.htm']
    }, function (err, res, code) {
      if (err) {
        grunt.fail.fatal('Tests failed!\n' + res.stdout, code);
      }
      
      grunt.log.writeln(res.stdout);
      done();
    });
  });
  grunt.registerTask('test', ['default', 'connect', 'casperjs-test']);
};
