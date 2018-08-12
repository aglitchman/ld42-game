var context = require("../context");
var TextPrinter = require("../text-printer");

var gameFinal = {};

gameFinal.create = function() {
  this.game.stage.backgroundColor = "#222034";

  this.finalImg = this.add.sprite(this.game.width / 2, 100, "finalcity");
  this.finalImg.anchor.x = 0.5;
  this.finalImg.scale.set(2);
  this.finalImg.alpha = 0;

  this.msg = this.add.sprite(0, 0, "msg-gui-01");
  this.msg.scale.set(2);
  this.msg.y = this.game.height;

  this.msgText = this.add.bitmapText(126, 406, "font1", "", 12);
  this.msgText.align = "left";
  this.msgText.scale.set(2);

  this.soundVoice = this.add.audio("sound-voice");

  this.continueBtn = this.add.button(
    this.game.width / 2,
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

  this.add.tween(this.finalImg).to(
    {
      alpha: 1
    },
    400,
    Phaser.Easing.Linear.None,
    true,
    1000
  );

  this.add.tween(this.finalImg).to(
    {
      y: 0
    },
    10000,
    Phaser.Easing.Linear.None,
    true,
    1000
  );
};

gameFinal.update = function() {
  this.printer.update();

  if (
    this.continueBtn.visible &&
    this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
  ) {
    this.continueBtn.visible = false;
    this._continueNextState();
  }
};

gameFinal._nextMsg1 = function() {
  this.printer.printText("This city has changed.");
  this.printer.onComplete.addOnce(this._nextMsg2, this);
  this.printer.onCompleteWait = 2500;
  this.soundVoice.play();
};

gameFinal._nextMsg2 = function() {
  this.printer.printText("It's mine now.");
  this.printer.onComplete.addOnce(this._nextMsg3, this);
  this.printer.onCompleteWait = 2500;
  this.soundVoice.play();
};

gameFinal._nextMsg3 = function() {
  this.printer.printText("Thank you.");
  this.printer.onComplete.addOnce(this._showContinueBtn, this);
  this.printer.onCompleteWait = 2500;
  this.soundVoice.play();
};

gameFinal._showContinueBtn = function() {
  var tween = this.add
    .tween(this.continueBtn)
    .to({ alpha: 1 }, 400, "Linear", true, 0, -1);
  tween.yoyo(true, 400);
  this.continueBtn.visible = true;
};

gameFinal._continueNextState = function() {
  this.state.start("gameMap");
};

module.exports = gameFinal;
