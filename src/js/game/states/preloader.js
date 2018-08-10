var context = require("../context");

var preloader = {};

preloader.preload = function() {
  this.game.stage.backgroundColor = "#000000";

  this.add
    .sprite(
      this.game.width / 2 - (150 / 2) * 2,
      this.game.height - 100,
      "preloader-bar-bg"
    )
    .scale.set(2);

  // this.video = this.add.video('preloaderMovie');
  // this.video.createVideoFromURL('assets/preloader-movie.mp4', true);
  // this.video.loop = true;
  // this.video.play(true);
  // this.video.addToWorld(-20, -20, 0, 0, 940 / 160, 640 / 112);

  this.preloadBar = this.add.sprite(
    this.game.width / 2 - (150 / 2) * 2,
    this.game.height - 100,
    "preloader-bar"
  );
  this.preloadBar.scale.set(2);

  // var logo = this.add.sprite(
  //   this.game.width / 2,
  //   this.game.height - 150,
  //   "preloader-logo"
  // );
  // logo.anchor.set(0.5);
  // logo.scale.set(2);

  //	This sets the preloadBar sprite as a loader sprite.
  //	What that does is automatically crop the sprite from 0 to full-width
  //	as the files below are loaded in.
  this.load.setPreloadSprite(this.preloadBar);

  //
  this.load.image("phaser-logo", "images/phaser-retro.png");
  this.load.image("indiesoft-logo", "images/indiesoft-retro.png");
  this.load.image("ld-logo", "images/ld-logo.png");
  this.load.image("game-logo", "images/game-logo.png");
  this.load.bitmapFont("font1", "images/font1_0.png", "images/font1.fnt");
};

preloader.create = function() {
  // this.state.start("intro");
  this.state.start("mainMenu");
};

module.exports = preloader;
