var context = require("../context");
var TextPrinter = require("../text-printer");

var gameIntro2 = {};

gameIntro2.create = function() {
  this.game.stage.backgroundColor = "#000000";

  this.map = this.add.sprite(this.world.centerX, 0, "citymap01");
  this.map.anchor.x = 0.5;
  this.map.scale.set(2);
  this.map.alpha = 0;

  this.msg = this.add.sprite(0, 0, "msg-gui-01");
  this.msg.scale.set(2);
  this.msg.y = this.game.height;

  this.msgText = this.add.bitmapText(126, 406, "font1", "", 12);
  this.msgText.align = "left";
  this.msgText.scale.set(2);

  this.continueBtn = this.add.button(
    this.world.centerX,
    472,
    "space-to-continue",
    this._continueNextState,
    this,
    0,
    0,
    0,
    0
  );
  this.continueBtn.scale.set(2);
  this.continueBtn.anchor.x = 0.5;
  this.continueBtn.alpha = 0;
  this.continueBtn.visible = false;

  this.printer = new TextPrinter(this.game, this.msgText);

  this.add
    .tween(this.msg)
    .to(
      {
        alpha: 1,
        y: this.game.height - this.msg.height
      },
      700,
      Phaser.Easing.Cubic.Out,
      true,
      2000
    )
    .onComplete.add(this._nextMsg1, this);

  this.add.tween(this.map).to(
    {
      alpha: 1
    },
    400,
    Phaser.Easing.Linear.None,
    true,
    1000
  );

  this.add.tween(this.map).to(
    {
      y: -100
    },
    10000,
    Phaser.Easing.Linear.None,
    true,
    1000
  );
};

gameIntro2.update = function() {
  this.printer.update();

  if (
    this.continueBtn.visible &&
    this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
  ) {
    this.continueBtn.visible = false;
    this._continueNextState();
  }
};

gameIntro2._nextMsg1 = function() {
  this.printer.printText(
    "Z city has sank into the mire of corruption and gang wars."
  );
  this.printer.onComplete.addOnce(this._nextMsg2, this);
  this.printer.onCompleteWait = 2500;
};

gameIntro2._nextMsg2 = function() {
  this.printer.printText(
    "It needs an invincible hero, a guardian for the weak and\noppressed."
  );
  this.printer.onComplete.addOnce(this._nextMsg3, this);
  this.printer.onCompleteWait = 2500;
};

gameIntro2._nextMsg3 = function() {
  this.printer.printText("A hero like me.");
  this.printer.onComplete.addOnce(this._showContinueBtn, this);
  this.printer.onCompleteWait = 1000;
};

gameIntro2._showContinueBtn = function() {
  var tween = this.add
    .tween(this.continueBtn)
    .to({ alpha: 1 }, 400, "Linear", true, 0, -1);
  tween.yoyo(true, 400);
  this.continueBtn.visible = true;
};

gameIntro2._continueNextState = function() {
  this.state.start("gameMap");
};

module.exports = gameIntro2;
