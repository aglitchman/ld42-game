var context = require("../context");
var saveData = require("../save-data");
var mainMenu = require("./main-menu");

var gameWin = {};

gameWin.create = function() {
  this.game.stage.backgroundColor = "#000000";

  if (context.playedLevelNum >= saveData.maxLevel) {
    saveData.maxLevel = context.playedLevelNum + 1;
  }

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

  mainMenu._yoyoBounce.call(this, this.text);

  mainMenu._fadeOut.call(this);

  this.time.events.add(4000, this._nextState, this);
};

gameWin.update = function() {};

gameWin._nextState = function() {
  this.state.start("gameMap");
};

module.exports = gameWin;
