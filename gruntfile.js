var properties = require("./src/js/game/properties.js");

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-cache-bust");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-stylus");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-open");
  grunt.loadNpmTasks("grunt-pngmin");
  grunt.loadNpmTasks("grunt-prettier");

  var productionBuild = !!(
    grunt.cli.tasks.length && grunt.cli.tasks[0] === "build"
  );

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    properties: properties,

    project: {
      src: "src/js",
      js: "<%= project.src %>/game/{,*/}*.js",
      dest: "build",
      bundle: "build/app.min.js",
      port: properties.port,
      banner:
        "/*\n" +
        " * <%= properties.title %>\n" +
        " * <%= pkg.description %>\n" +
        " *\n" +
        " * @author <%= pkg.author %>\n" +
        " * @version <%= pkg.version %>\n" +
        " * @copyright <%= pkg.author %>\n" +
        " * @license <%= pkg.license %> licensed\n" +
        " *\n" +
        " * Made using Phaser JS Boilerplate" +
        " <https://github.com/lukewilde/phaser-js-boilerplate>\n" +
        " */\n"
    },

    connect: {
      dev: {
        options: {
          port: "<%= project.port %>",
          base: "./build"
        }
      }
    },

    prettier: {
      files: {
        src: ["gruntfile.js", "<%= project.js %>", "src/images/*.json"]
      },
      options: {}
    },

    watch: {
      options: {
        livereload: productionBuild ? false : properties.liveReloadPort
      },
      js: {
        files: "<%= project.dest %>/**/*.js",
        tasks: ["jade"]
      },
      jade: {
        files: "src/templates/*.jade",
        tasks: ["jade"]
      },
      stylus: {
        files: "src/style/*.styl",
        tasks: ["stylus"]
      },
      images: {
        files: "src/images/**/*",
        tasks: ["copy:images"]
      },
      audio: {
        files: "src/audio/**/*",
        tasks: ["copy:audio"]
      }
    },

    browserify: {
      app: {
        src: ["<%= project.src %>/game/app.js"],
        dest: "<%= project.bundle %>",
        options: {
          transform: ["browserify-shim"],
          watch: true,
          browserifyOptions: {
            debug: !productionBuild
          }
        }
      }
    },

    open: {
      server: {
        path: "http://localhost:<%= project.port %>"
      }
    },

    cacheBust: {
      options: {
        assets: ["audio/**", "images/**", "style/**", "app.min.*", "phaser.js"],
        baseDir: "./build/",
        deleteOriginals: true,
        jsonOutput: true,
        length: 5
      },
      files: {
        src: [
          "./build/app.min.*",
          "./build/index.html",
          "./build/style/index.css"
        ]
      }
    },

    jade: {
      compile: {
        options: {
          pretty: !productionBuild,
          data: {
            properties: properties,
            productionBuild: productionBuild
          }
        },
        files: {
          "build/index.html": ["src/templates/index.jade"]
        }
      }
    },

    stylus: {
      compile: {
        files: { "build/style/index.css": ["src/style/index.styl"] },
        options: {
          sourcemaps: !productionBuild
        }
      }
    },

    clean: ["./build/"],

    pngmin: {
      options: {
        ext: ".png",
        force: true
      },
      compile: {
        files: [{ src: "src/images/*.png", dest: "src/images/" }]
      }
    },

    copy: {
      images: {
        files: [
          {
            expand: true,
            cwd: "src/images/",
            src: ["**"],
            dest: "build/images/"
          }
        ]
      },
      audio: {
        files: [
          { expand: true, cwd: "src/audio/", src: ["**"], dest: "build/audio/" }
        ]
      },
      phaserArcade: {
        files: [
          {
            src: [
              "node_modules/phaser-ce/build/custom/phaser-arcade-physics.js"
            ],
            dest: "build/phaser.js"
          }
        ]
      },
      phaserArcadeMin: {
        files: [
          {
            src: [
              "node_modules/phaser-ce/build/custom/phaser-arcade-physics.min.js"
            ],
            dest: "build/phaser.js"
          }
        ]
      },
      phaserP2: {
        files: [
          {
            src: ["node_modules/phaser-ce/build/phaser.js"],
            dest: "build/phaser.js"
          }
        ]
      },
      phaserP2Min: {
        files: [
          {
            src: ["node_modules/phaser-ce/build/phaser.min.js"],
            dest: "build/phaser.js"
          }
        ]
      }
    },

    uglify: {
      options: {
        banner: "<%= project.banner %>"
      },
      dist: {
        files: { "<%= project.bundle %>": "<%= project.bundle %>" }
      }
    },

    compress: {
      options: { archive: "<%= pkg.name %>.zip" },
      zip: {
        files: [
          {
            expand: true,
            cwd: "build/",
            src: ["**/*"],
            dest: "/"
          }
        ]
      }
    }
  });

  grunt.registerTask("default", [
    "clean",
    "browserify",
    "jade",
    "stylus",
    "copy:images",
    "copy:audio",
    "copy:phaserArcade",
    "connect",
    "open",
    "watch"
  ]);

  grunt.registerTask("build", [
    "clean",
    "browserify",
    "jade",
    "stylus",
    "uglify",
    "copy:images",
    "copy:audio",
    "copy:phaserArcadeMin",
    "cacheBust",
    "compress:zip"
  ]);

  grunt.registerTask("optimise", ["pngmin", "copy:images"]);
  grunt.registerTask("zip", ["compress:zip"]);
};
