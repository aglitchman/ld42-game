var context = require("../context");

var gameMap = {};

gameMap.create = function() {
  this.game.stage.backgroundColor = "#000000"; // "#222034";

  this.city = this.add.sprite(
    this.world.centerX,
    this.world.centerY,
    "citymap01"
  );
  this.city.anchor.set(0.5);
  this.city.scale.set(2);

  this.logo = this.add.sprite(
    this.world.centerX,
    46,
    "city-logo"
  );
  this.logo.anchor.set(0.5);
  this.logo.scale.set(2);

};

gameMap.update = function() {};

module.exports = gameMap;
