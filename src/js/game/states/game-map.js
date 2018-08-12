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

  // this.point1 = this.add.sprite(this.world.centerX, this.world.centerY, "point01", 0);
  // this.point1.anchor.set(0.5);
  // this.point1.scale.set(2);

  // this.point2 = this.add.sprite(this.world.centerX, this.world.centerY + 40, "point01", 1);
  // this.point2.anchor.set(0.5);
  // this.point2.scale.set(2);

  this.point1 = this.add.button(
    this.world.centerX - 200,
    this.world.centerY + 80,
    "point01",
    null,
    this,
    2,
    1,
    1,
    2
  );
  this.point1.anchor.set(0.5);
  this.point1.scale.set(2);
  this.point1Text = this.make.bitmapText(0, 18, "font1", "LVL1", 12);
  this.point1Text.anchor.set(0.5);
  this.point1.addChild(this.point1Text);

  this.point2 = this.add.button(
    this.world.centerX - 100,
    this.world.centerY - 100,
    "point01",
    null,
    this,
    2,
    0,
    0,
    2
  );
  this.point2.anchor.set(0.5);
  this.point2.scale.set(2);
  this.point2Text = this.make.bitmapText(0, 18, "font1", "LVL2", 12);
  this.point2Text.anchor.set(0.5);
  this.point2.addChild(this.point2Text);

  this.point3 = this.add.button(
    this.world.centerX,
    this.world.centerY + 40,
    "point01",
    null,
    this,
    2,
    0,
    0,
    2
  );
  this.point3.anchor.set(0.5);
  this.point3.scale.set(2);
  this.point3Text = this.make.bitmapText(0, 18, "font1", "LVL3", 12);
  this.point3Text.anchor.set(0.5);
  this.point3.addChild(this.point3Text);

  mainMenu._fadeOut.call(this);
};

gameMap.update = function() {};

gameMap._gotoMenu = function() {
  this.state.start("mainMenu");
};

module.exports = gameMap;
