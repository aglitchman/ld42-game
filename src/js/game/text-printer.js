var TextPrinter = function(game, bmpText) {
  this.game = game;
  this.bmpText = bmpText;
  this.printText("");
  this.onComplete = new Phaser.Signal();
  this.onCompleteWait = 0;
};

TextPrinter.prototype.printText = function(text) {
  this.text = text;
  this.bmpText.text = "";
  this.count = 0;
  this.time = 0;
  this.waitTime = 0;
};

TextPrinter.prototype.update = function() {
  this.time += this.game.time.physicsElapsedMS;
  if (this.time > 50) {
    this.time -= 50;
    if (this.count < this.text.length) {
      this.count++;
      this.bmpText.text = this.text.substr(0, this.count);

      if (this.count >= this.text.length) {
        this.waitTime = Math.max(1, this.onCompleteWait);
      }
    }
  }

  if (this.waitTime > 0) {
    this.waitTime -= this.game.time.physicsElapsedMS;
    if (this.waitTime <= 0) {
      this.onComplete.dispatch(this);
    }
  }
};

module.exports = TextPrinter;
