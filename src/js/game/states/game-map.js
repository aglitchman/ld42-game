var context = require("../context");

var gameMap = {};

gameMap.create = function() {
  this.game.stage.backgroundColor = "#000000"; // "#222034";

  this.logo = this.add.sprite(
    this.world.centerX,
    this.world.centerY - 50,
    "game-logo"
  );
  this.logo.anchor.set(0.5);
  this.logo.scale.set(2);
};

gameMap.update = function() {};

module.exports = gameMap;
