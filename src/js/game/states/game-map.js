var context = require("../context");
var mainMenu = require("./main-menu");

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

  this.logo = this.add.sprite(this.world.centerX, 46, "city-logo");
  this.logo.anchor.set(0.5);
  this.logo.scale.set(2);

  this.btnMenu = this.add.button(
    10,
    440,
    "btn-menu",
    this._gotoMenu,
    this,
    1,
    0,
    0,
    1
  );
  this.btnMenu.scale.set(2);

  mainMenu._fadeOut.call(this);
};

gameMap.update = function() {};

gameMap._gotoMenu = function() {
  this.state.start("mainMenu");
};

module.exports = gameMap;
