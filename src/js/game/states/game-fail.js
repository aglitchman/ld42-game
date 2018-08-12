var context = require("../context");
var mainMenu = require("./main-menu");

var gameFail = {};

gameFail.create = function() {
  this.game.stage.backgroundColor = "#000000";

  this.text = this.add.sprite(
    this.game.width / 2,
    this.game.height / 2,
    "text-ouch"
  );
  this.text.anchor.set(0.5);
  this.text.scale.set(2);

  this.text2 = this.add.bitmapText(
    this.game.width / 2,
    290,
    "font1",
    "Try again!",
    12
  );
  this.text2.align = "center";
  this.text2.scale.set(2);
  this.text2.anchor.x = 0.5;

  mainMenu._yoyoBounce.call(this, this.text);

  mainMenu._fadeOut.call(this);

  this.soundGameOver = this.add.audio("sound-gameover");
  this.soundGameOver.play();

  this.time.events.add(1800, this._nextState, this);
};

gameFail.update = function() {};

gameFail._nextState = function() {
  this.state.start("gameMap");
};

module.exports = gameFail;
