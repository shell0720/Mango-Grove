// //***********   GRUNT NEEDS ***************//
// //  npm install grunt --save
// //  npm install grunt-contrib-copy --save
// //  npm install grunt-contrib-uglify --save
// //  npm install grunt-contrib-jshint --save
// //  npm install grunt-contrib-watch --save
// //
// //***********   GRUNT USES  ***************//
// //  vendors:  jquery, bootstrap
// //  client/app.js
// //
// //
//
// module.exports = function(grunt){
//   grunt.initConfig({
//     pkg:grunt.file.readJSON('package.json'),
//     uglify: {
//       options: {
//         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//       },
//       build: {
//         expand: true,
//         cwd: 'client/scripts/',
//         src: '*.js',
//         dest: 'server/public/assets/scripts/',
//         ext: '.min.js'
//       }
//     },
//     jshint:{
//       files:['client/scripts/*.js', 'server/app.js', 'server/modules/*.js', 'server/models/*.js']
//     },
//     watch: {
//       client:{
//         files:'client/scripts/*.js',
//         tasks: ['jshint', 'uglify'],
//         options:{
//           spawn: false
//         }
//       },
//       server:{
//         files:['server/app.js', 'server/modules/*.js', 'server/models/*.js'],
//         tasks: ['jshint'],
//         options:{
//           spawn: false
//         }
//       }
//     },
//     copy: {
//       jQuery: {
//         expand: true,
//         cwd: "node_modules/jquery/dist/",
//         src: [
//           "jquery.min.js",
//         ],
//         dest: "server/public/vendors/"
//       },
//       jQuery : {
//         expand: true,
//         cwd: 'node_modules',
//         src: [
//            "jquery/*/*/*/*"
//          ],
//          "dest": "server/public/vendors/"
//       },
//       bootstrap : {
//         expand: true,
//         cwd: 'node_modules',
//         src: [
//            "bootstrap/*/*/*"
//          ],
//          "dest": "server/public/vendors/"
//       },
//       html : {
//          expand: true,
//          cwd: 'client/views',
//          src: [
//             "*/*/*",  //four levels deep
//             "*/*",    //two levels deep
//             "*"       //one level deep
//
//           ],
//           "dest": "server/public/assets/views/"
//        }
//     }
//   });
//   grunt.loadNpmTasks('grunt-contrib-watch');
//   grunt.loadNpmTasks('grunt-contrib-jshint');
//   grunt.loadNpmTasks('grunt-contrib-copy');
//   grunt.loadNpmTasks('grunt-contrib-uglify');
//
//   grunt.registerTask('default', ['jshint','copy','uglify']);
//
// }
