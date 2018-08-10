var Stats = require("../../lib/stats");
var properties = require("../properties");
var saveData = require("../save-data");

var boot = {};

boot.preload = function() {
  // Here we load the assets required for our preloader (in this case a background and a loading bar)
  this.load.image("preloader-bar", "images/preloader-bar.png");
  this.load.image("preloader-bar-bg", "images/preloader-bar-bg.png");
};

boot.create = function() {
  if (properties.showStats) {
    addStats(this.game);
  }

  saveData.reset();
  saveData.load();

  // Crisp pixels!
  this.game.renderer.renderSession.roundPixels = true;
  if (properties.crisp)
    this.game.renderer.renderSession.scaleMode = PIXI.scaleModes.NEAREST;

  //
  this.game.sound.mute = properties.mute;

  // ...
  this.tweens.frameBased = true;

  // Proportional scaling!
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.windowConstraints.bottom = "visual";
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;

  //
  if (this.game.device.desktop) {
    this.stage.disableVisibilityChange = true;
  } else {
    // this.scale.forceLandscape = true;
  }

  this.state.start("preloader");
};

function addStats(game) {
  var stats = new Stats();

  stats.setMode(0);

  stats.domElement.style.position = "absolute";
  stats.domElement.style.right = "0px";
  stats.domElement.style.top = "0px";

  document.body.appendChild(stats.domElement);

  // Monkey patch Phaser's update in order to correctly monitor FPS.
  var oldUpdate = game.update;
  game.update = function() {
    stats.begin();
    oldUpdate.apply(game, arguments);
    stats.end();
  };
}

module.exports = boot;
