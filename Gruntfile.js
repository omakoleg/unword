module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["dist"],
    processhtml: {
      options: {
        // Task-specific options go here.
      },
      dist: {
        files: {
          "dist/assets/html/popup.html": ['assets/html/popup.html'],
          "dist/assets/html/background.html": ['assets/html/background.html']
        }
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        },
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          'dist/assets/js/popup.min.js': [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'assets/js/storage.js',
            'assets/js/notification.js',
            'assets/js/models.js',
            'assets/js/popup.js',
            'assets/js/popup-page.js'
          ]
        }
      }
    },
    copy: {
      main: {
        files: [
          { src: 'assets/html/unword/**', dest: 'dist/' },
          { src: 'assets/styles/**', dest: 'dist/' },
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'uglify', 'processhtml']);

};