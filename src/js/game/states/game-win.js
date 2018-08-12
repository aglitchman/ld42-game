var context = require("../context");
var saveData = require("../save-data");
var mainMenu = require("./main-menu");

var gameWin = {};

gameWin.create = function() {
  this.game.stage.backgroundColor = "#000000";

  if (!context.twoPlayerMode) {
    if (context.playedLevelNum >= saveData.maxLevel) {
      saveData.maxLevel = context.playedLevelNum + 1;
    }

    saveData.save();
  }

  this.text = this.add.sprite(
    this.game.width / 2,
    this.game.height / 2,
    "text-victory"
  );
  this.text.anchor.set(0.5);
  this.text.scale.set(2);

  var descText = "Chicken Dinner!";
  if (context.twoPlayerMode) {
    descText =
      context.twoPlayerModeWinner == 1
        ? "Chicken Dinner for Player 1!"
        : "Chicken Dinner for Player 2!";
  }

  this.text2 = this.add.bitmapText(
    this.game.width / 2,
    290,
    "font1",
    descText,
    12
  );
  this.text2.align = "center";
  this.text2.scale.set(2);
  this.text2.anchor.x = 0.5;

  mainMenu._yoyoBounce.call(this, this.text);

  mainMenu._fadeOut.call(this);

  this.soundGameOver = this.add.audio("sound-victory");
  this.soundGameOver.play();

  this.time.events.add(4000, this._nextState, this);
};

gameWin.update = function() {};

gameWin._nextState = function() {
  if (context.twoPlayerMode) {
    this.state.start("mainMenu");
  } else {
    if (context.playedLevelNum == 5) {
      this.state.start("gameFinal");
    } else {
      this.state.start("gameMap");
    }
  }
};

module.exports = gameWin;
