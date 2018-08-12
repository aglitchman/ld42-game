var context = require("../context");
var mainMenu = require("./main-menu");

var gameWin = {};

gameWin.create = function() {
  this.game.stage.backgroundColor = "#000000";

  // TODO - increase level in save data!

  this.text = this.add.sprite(
    this.game.width / 2,
    this.game.height / 2,
    "text-victory"
  );
  this.text.anchor.set(0.5);
  this.text.scale.set(2);

  this.text2 = this.add.bitmapText(
    this.game.width / 2,
    290,
    "font1",
    "Chicken Dinner!",
    12
  );
  this.text2.align = "center";
  this.text2.scale.set(2);
  this.text2.anchor.x = 0.5;

  mainMenu._fadeOut.call(this);

  this.time.events.add(2500, this._nextState, this);
};

gameWin.update = function() {};

gameWin._nextState = function() {
  this.state.start("gameMap");
};

module.exports = gameWin;
