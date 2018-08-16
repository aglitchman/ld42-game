var mainMenu = require("./main-menu");

var intro = {};

var LState = {
  FADE_IN: 0,
  FADE_OUT: 1,
  NEXT_STATE: 2
};

intro.create = function() {
  this.game.stage.backgroundColor = "#222034";

  this._sprites = [];

  ["ld-logo", "indiesoft-logo", "phaser-logo"].forEach(
    function(name) {
      var logo = this.add.sprite(
        this.game.width / 2,
        this.game.height / 2,
        name
      );
      logo.alpha = 0;
      logo.anchor.set(0.5);
      logo.scale.set(2);

      this._sprites.push(logo);
    }.bind(this)
  );

  this._skip = false;
  this._time = 0;
  this._state = LState.FADE_IN;
  this._logo = this._sprites.shift();

  this.input.onUp.add(this._mouseClicked, this);

  mainMenu._fadeOut.call(this);
};

intro._fadeInLogo = function(sprite) {
  this._lastTween = this.add.tween(sprite).to(
    {
      alpha: 1
    },
    400,
    Phaser.Easing.Linear.None,
    true
  );
};

intro._fadeOutLogo = function(sprite) {
  this._lastTween = this.add.tween(sprite).to(
    {
      alpha: 0
    },
    80,
    Phaser.Easing.Linear.None,
    true
  );
};

intro._mouseClicked = function() {
  this._skip = true;
};

intro.update = function() {
  this._time += this.time.physicsElapsedMS;

  if (this._skip) {
    this._skip = false;
    this._time += 100000;
    if (this._lastTween) {
      this._lastTween.stop(true);
    }
  }

  if (this._state == LState.FADE_IN) {
    if (this._time > 200) {
      this._fadeInLogo(this._logo);

      this._time = 0;
      this._state = LState.FADE_OUT;
    }
  } else if (this._state == LState.FADE_OUT) {
    if (this._time > 1500) {
      this._fadeOutLogo(this._logo);

      this._time = 0;
      if (this._sprites.length) {
        this._logo = this._sprites.shift();
        this._state = LState.FADE_IN;
      } else {
        this._state = LState.NEXT_STATE;
      }
    }
  } else if (this._state == LState.NEXT_STATE) {
    if (this._time > 500) {
      this.state.start("mainMenu");
    }
  }
};

module.exports = intro;
