module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["dist"],
    processhtml: {
      options: {
      },
      dist: {
        files: {
          "dist/html/popup.html": ['app/html/popup.html'],
          "dist/html/background.html": ['app/html/background.html']
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
          'dist/js/popup.min.js': [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'app/js/storage.js',
            'app/js/notification.js',
            'app/js/models.js',
            'app/js/popup.js',
            'app/js/popup-page.js'
          ]
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'app/html', src: ['unword/**'], dest: 'dist/html/'},
          {expand: true, cwd: 'app/styles', src: ['**'], dest: 'dist/styles/'}
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