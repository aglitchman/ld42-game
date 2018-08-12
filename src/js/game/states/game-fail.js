var context = require("../context");
var mainMenu = require("./main-menu");

var gameFail = {};

gameFail.create = function() {
  this.game.stage.backgroundColor = "#000000";

  this.text = this.add.sprite(
    this.world.centerX,
    this.world.centerY,
    "text-ouch"
  );
  this.text.anchor.set(0.5);
  this.text.scale.set(2);

  this.text2 = this.add.bitmapText(
    this.world.centerX,
    290,
    "font1",
    "Try again!",
    12
  );
  this.text2.align = "center";
  this.text2.scale.set(2);
  this.text2.anchor.x = 0.5;

  mainMenu._fadeOut.call(this);

  this.time.events.add(1500, this._nextState, this);
};

gameFail.update = function() {};

gameFail._nextState = function() {
  this.state.start("gameMap");
};

module.exports = gameFail;
