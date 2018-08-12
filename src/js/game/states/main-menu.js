var context = require("../context");
var saveData = require("../save-data");

var mainMenu = {};

mainMenu.create = function() {
  this.game.stage.backgroundColor = "#000000"; // "#222034";

  this.logo = this.add.sprite(this.world.centerX, 80, "game-logo");
  this.logo.anchor.set(0.5);
  this.logo.scale.set(2);
  // this.logo.angle += 5;

  this.credits1 = this.add.bitmapText(
    this.world.centerX,
    390,
    "font1",
    "The game has been developed by GLITCHMAN\nspecially for LD42 COMPO. © 2018\ntwitter.com/aglitchman",
    12
  );
  this.credits1.align = "center";
  this.credits1.scale.set(2);
  this.credits1.anchor.x = 0.5;

  this.btnStart = this.add.button(
    this.world.centerX,
    200,
    "btn-start",
    this._newGame,
    this,
    1,
    0,
    0,
    1
  );
  this.btnStart.scale.set(2);
  this.btnStart.anchor.x = 0.5;

  this.btnContinue = this.add.button(
    this.world.centerX,
    280,
    "btn-continue",
    this._continueGame,
    this,
    1,
    0,
    0,
    1
  );
  this.btnContinue.scale.set(2);
  this.btnContinue.anchor.x = 0.5;
};

mainMenu.update = function() {};

mainMenu._newGame = function() {
  saveData.reset();

  this.state.start("gameIntro1");
};

module.exports = mainMenu;
