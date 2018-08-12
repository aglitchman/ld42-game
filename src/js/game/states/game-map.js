var context = require("../context");
var saveData = require("../save-data");
var mainMenu = require("./main-menu");

var gameMap = {};

gameMap.create = function() {
  this.game.stage.backgroundColor = "#000000"; // "#222034";

  if (saveData.tutorial) {
    saveData.tutorial = false;
    saveData.save();
  }

  // saveData.maxLevel

  this.city = this.add.sprite(
    this.game.width / 2,
    this.game.height / 2,
    "citymap01"
  );
  this.city.anchor.set(0.5);
  this.city.scale.set(2);

  this.logo = this.add.sprite(this.game.width / 2, 46, "city-logo");
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

  // this.point1 = this.add.sprite(this.game.width / 2, this.game.height / 2, "point01", 0);
  // this.point1.anchor.set(0.5);
  // this.point1.scale.set(2);

  // this.point2 = this.add.sprite(this.game.width / 2, this.game.height / 2 + 40, "point01", 1);
  // this.point2.anchor.set(0.5);
  // this.point2.scale.set(2);

  this.point1 = this.add.button(
    this.game.width / 2 - 200,
    this.game.height / 2 + 80,
    "point01",
    this._startLevel1,
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
    this.game.width / 2 - 100,
    this.game.height / 2 - 100,
    "point01",
    this._startLevel2,
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
    this.game.width / 2,
    this.game.height / 2 + 40,
    "point01",
    this._startLevel3,
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
  
  this.point4 = this.add.button(
    this.game.width / 2 + 150,
    this.game.height / 2 - 40,
    "point01",
    this._startLevel4,
    this,
    2,
    0,
    0,
    2
  );
  this.point4.anchor.set(0.5);
  this.point4.scale.set(2);
  this.point4Text = this.make.bitmapText(0, 18, "font1", "LVL4", 12);
  this.point4Text.anchor.set(0.5);
  this.point4.addChild(this.point4Text);

  this.point5 = this.add.button(
    this.game.width / 2 + 220,
    this.game.height / 2 - 120,
    "point01",
    this._startLevel5,
    this,
    2,
    0,
    0,
    2
  );
  this.point5.anchor.set(0.5);
  this.point5.scale.set(2);
  this.point5Text = this.make.bitmapText(0, 18, "font1", "LVL5", 12);
  this.point5Text.anchor.set(0.5);
  this.point5.addChild(this.point5Text);

  mainMenu._yoyoBounce.call(this, this.logo);

  mainMenu._fadeOut.call(this);
};

gameMap.update = function() {};

gameMap._gotoMenu = function() {
  this.state.start("mainMenu");
};

gameMap._startLevel1 = function() {
  context.playedLevelNum = 1;
  this.state.start("gameCore");
};

gameMap._startLevel2 = function() {
  context.playedLevelNum = 2;
  this.state.start("gameCore");
};

gameMap._startLevel3 = function() {
  context.playedLevelNum = 3;
  this.state.start("gameCore");
};

gameMap._startLevel4 = function() {
  context.playedLevelNum = 4;
  this.state.start("gameCore");
};

gameMap._startLevel5 = function() {
  context.playedLevelNum = 5;
  this.state.start("gameCore");
};

module.exports = gameMap;
