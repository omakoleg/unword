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
    cssmin: {
      add_banner: {
        options: {
          banner: '/* Unword minified css file */'
        },
        files: {
          'dist/styles/background.min.css': [
            'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'app/bower_components/angular/angular-csp.css',
            'app/styles/background.css'
          ],
          'dist/styles/popup.min.css': [
            'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'app/styles/popup.css'
          ]
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
      main: {
        files: {
          'dist/main.js': ['app/main.js'],
          'dist/js/models.js': ['app/js/models.js'],
          'dist/js/notification.js': ['app/js/notification.js'],
          'dist/js/storage.js': ['app/js/storage.js'],
          'dist/js/popup.min.js': [
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'app/js/storage.js',
            'app/js/notification.js',
            'app/js/models.js',
            'app/js/popup.js',
            'app/js/popup-page.js'
          ],
          'dist/js/background.min.js': [
            'app/bower_components/jquery/dist/jquery.min.js',
            'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-route/angular-route.js',
            // lib
            'app/lib/papaparse.js',
            'app/js/storage.js',
            'app/js/notification.js',
            'app/js/models.js',
            // angular
            'app/js/unword/app.js',
            'app/js/unword/routes.js',
            'app/js/unword/controllers/vocabularies.controller.js',
            'app/js/unword/controllers/questions.controller.js',
            'app/js/unword/controllers/config.controller.js',
            'app/js/unword/services/questions.service.js',
            'app/js/unword/services/vocabularies.service.js',
            'app/js/unword/services/dialogs.service.js',
          ]
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'app/html', src: ['unword/**'], dest: 'dist/html/'},
          {expand: true, cwd: 'app/images', src: ['**'], dest: 'dist/images/'},
          {expand: true, cwd: 'app/', src: 'manifest.json', dest: 'dist/'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin', 'processhtml']);

};