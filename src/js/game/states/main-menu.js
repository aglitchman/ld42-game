var context = require("../context");

var mainMenu = {};

mainMenu.create = function() {
  this.game.stage.backgroundColor = "#222034";

  this.logo = this.add.sprite(
    this.world.centerX,
    this.world.centerY - 50,
    "game-logo"
  );
  this.logo.anchor.set(0.5);
  this.logo.scale.set(2);
  // this.logo.angle += 5;

  this.credits1 = this.add.bitmapText(
    this.game.width / 2,
    350,
    "font1",
    "The game has been developed by GLITCHMAN\nspecially for LD42 COMPO. © 2018",
    12
  );
  this.credits1.align = "center";
  this.credits1.scale.set(2);
  this.credits1.anchor.x = 0.5;
  
};

mainMenu.update = function() {};

module.exports = mainMenu;
