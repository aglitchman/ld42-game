var intro = {};

intro.create = function() {
  this.game.stage.backgroundColor = "#222034";

  this.logo1 = this.add.sprite(
    this.game.width / 2,
    this.game.height / 2,
    "ld-logo"
  );
  this.logo1.alpha = 0;
  this.logo1.anchor.set(0.5);
  this.logo1.scale.set(2);

  this.logo2 = this.add.sprite(
    this.game.width / 2,
    this.game.height / 2,
    "indiesoft-logo"
  );
  this.logo2.alpha = 0;
  this.logo2.anchor.set(0.5);
  this.logo2.scale.set(2);

  this.logo3 = this.add.sprite(
    this.game.width / 2,
    this.game.height / 2,
    "phaser-logo"
  );
  this.logo3.alpha = 0;
  this.logo3.anchor.set(0.5);
  this.logo3.scale.set(2);

  this.tt = 0;
  this.sm = 0;
};

intro._fadeInLogo = function(sprite) {
  this.add.tween(sprite).to(
    {
      alpha: 1
    },
    400,
    Phaser.Easing.Linear.None,
    true
  );
};

intro._fadeOutLogo = function(sprite) {
  this.add.tween(sprite).to(
    {
      alpha: 0
    },
    80,
    Phaser.Easing.Linear.None,
    true
  );
};

intro.update = function() {
  this.tt += this.time.physicsElapsedMS;

  if (this.sm == 0) {
    if (this.tt > 200) {
      this._fadeInLogo(this.logo1);

      this.tt = 0;
      this.sm++;
    }
  } else if (this.sm == 1) {
    if (this.tt > 1500) {
      this._fadeOutLogo(this.logo1);

      this.tt = 0;
      this.sm++;
    }
  } else if (this.sm == 2) {
    if (this.tt > 200) {
      this._fadeInLogo(this.logo2);

      this.tt = 0;
      this.sm++;
    }
  } else if (this.sm == 3) {
    if (this.tt > 1500) {
      this._fadeOutLogo(this.logo2);

      this.tt = 0;
      this.sm++;
    }
  } else if (this.sm == 4) {
    if (this.tt > 200) {
      this._fadeInLogo(this.logo3);

      this.tt = 0;
      this.sm++;
    }
  } else if (this.sm == 5) {
    if (this.tt > 1500) {
      this._fadeOutLogo(this.logo3);

      this.tt = 0;
      this.sm++;
    }
  } else if (this.sm == 6) {
    if (this.tt > 500) {
      this.state.start("mainMenu");

      this.tt = 0;
      this.sm++;
    }
  }
};

module.exports = intro;
