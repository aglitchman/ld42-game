var context = require("../context");
var TextPrinter = require("../text-printer");
var SoundPool = require("../sound-pool");
var mainMenu = require("./main-menu");

var gameCore = {};

var PState = {
  NORMAL: 0,
  DASHING: 1
};

var GState = {
  INTRO: 0,
  PLAYING: 1,
  FAILING: 2,
  WINNING: 3
};

gameCore.create = function() {
  this.game.stage.backgroundColor = "#000000";

  this.map = this.add.tilemap("map1");
  this.map.addTilesetImage("sprite01", "sprite01");

  this.background = this.map.createLayer("Background");
  this.background.scale.set(2);
  this.background.resizeWorld();

  // this.layer1 = this.map.createLayer("Layer1");
  // this.layer1.scale.set(2);
  // this.layer1.resizeWorld();
  // this.world.remove(this.layer1);
  // this.layer1.debug = true;
  // this.map.setCollisionBetween(3, 4, true, this.layer1);

  this._setupCollidables();

  this._setupSounds();

  // DEBUG
  window.map = this.map;

  //
  this.player1 = this.add.sprite(this.world.centerX - 100, -200, "hero04");
  this.player1.animations.add(
    "idle",
    Phaser.ArrayUtils.numberArray(0, 1),
    3,
    true
  );
  this.player1.animations.add(
    "dash",
    Phaser.ArrayUtils.numberArray(1, 1),
    3,
    true
  );
  this.player1.animations.add(
    "jump",
    Phaser.ArrayUtils.numberArray(2, 2),
    3,
    true
  );
  this.player1.animations.play("idle");
  this.player1.playerId = 1;
  this.player1.scale.set(2);
  this.player1.anchor.set(0.5);
  this.physics.enable(this.player1, Phaser.Physics.ARCADE);
  // this.player1.body.drag.x = 800;
  this.player1.body.gravity.y = 600;
  this.player1.body.maxVelocity.y = 500;
  this.player1.pstate = PState.NORMAL;
  this.player1.jumpTimer = 0;
  this.player1.lives = 3;

  this.player2 = this.add.sprite(this.world.centerX + 100, -500, "hero04");
  this.player2.animations.add(
    "idle",
    Phaser.ArrayUtils.numberArray(0, 1),
    3,
    true
  );
  this.player2.animations.add(
    "dash",
    Phaser.ArrayUtils.numberArray(1, 1),
    3,
    true
  );
  this.player2.animations.add(
    "jump",
    Phaser.ArrayUtils.numberArray(2, 2),
    3,
    true
  );
  this.player2.animations.play("idle");
  this.player2.playerId = 2;
  this.player2.scale.set(2);
  this.player2.anchor.set(0.5);
  this.physics.enable(this.player2, Phaser.Physics.ARCADE);
  this.player2.body.drag.x = 200;
  this.player2.body.drag.y = 200;
  // this.player2.body.collideWorldBounds = true;
  this.player2.body.gravity.y = 600;
  this.player2.body.maxVelocity.y = 500;
  this.player2.pstate = PState.NORMAL;
  this.player2.jumpTimer = 0;
  this.player2.lives = 3;

  this.fx01 = [];
  for (var k = 0; k < 10; k++) {
    this.fx01[k] = this.add.sprite(-100, -100, "fx01");
    this.fx01[k].animations.add("fire", null, 40);
    this.fx01[k].animations.play("fire");
    this.fx01[k].scale.set(2);
    this.fx01[k].anchor.set(0.5);
  }

  this.fx02 = [];
  for (var k = 0; k < 10; k++) {
    this.fx02[k] = this.add.sprite(-100, -100, "fx02");
    this.fx02[k].animations.add("fire", null, 40);
    this.fx02[k].animations.play("fire");
    this.fx02[k].scale.set(2);
    this.fx02[k].anchor.set(0.5);
  }

  this.fx03 = [];
  for (var k = 0; k < 10; k++) {
    this.fx03[k] = this.add.sprite(-100, -100, "fx03");
    this.fx03[k].animations.add("fire", null, 40);
    this.fx03[k].animations.play("fire");
    this.fx03[k].scale.set(2);
    this.fx03[k].anchor.set(0.5);
  }

  this.camera.focusOn(this.player1);
  this.camera.follow(this.player1, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);

  this.cursors = this.input.keyboard.createCursorKeys();

  this._addPlayerCursor(this.player1, 1);
  this._addPlayerCursor(this.player2, 2);

  this._addPlayerGui(this.player1, 1);
  this._addPlayerGui(this.player2, 2);

  this._addHelp();

  this._addMsgGui();

  this.gstate = GState.INTRO;

  mainMenu._fadeOut.call(this);
};

gameCore._setupCollidables = function() {
  this.collidable = [];
  for (var i = 0; i < this.map.layers[1].data.length; i++) {
    for (var j = 0; j < this.map.layers[1].data[0].length; j++) {
      var elem = this.map.layers[1].data[i][j];
      if (elem.index < 0) continue;

      var tile = this.add.sprite(
        j * elem.width * 2 + elem.width * 0.5 * 2,
        i * elem.height * 2 + elem.height * 0.5 * 2,
        "sprite01-sheet",
        elem.index - 1
      );
      tile.anchor.set(0.5);
      tile.scale.set(2);
      this.physics.enable(tile, Phaser.Physics.ARCADE);
      tile.body.immovable = true;
      tile.body.checkCollision.up = true;
      tile.body.checkCollision.left = false;
      tile.body.checkCollision.right = false;
      tile.body.checkCollision.down = false;
      tile.mapElem = elem;

      elem.tile = tile;

      this.collidable.push(tile);
    }
  }

  this.flashTile = this.add.sprite(0, 0, "sprite01-sheet", 11);
  this.flashTile.alpha = 0;
  this.flashTween = null;
  this.flashTile.anchor.set(0.5);
  this.flashTile.scale.set(2);
};

gameCore._setupSounds = function() {
  this.soundExplosion = new SoundPool([
    this.add.audio("sound-explosion"),
    this.add.audio("sound-explosion")
  ]);
};

gameCore._addHelp = function() {
  this.helpKeys = this.add.sprite(0, 0, "help-keys");
  this.helpKeys.scale.set(2);
  this.helpKeys.fixedToCamera = true;

  this.helpKeys.cameraOffset.x = -this.helpKeys.width;
  this.helpKeys.cameraOffset.y = this.game.height - this.helpKeys.height - 10;
};

gameCore._addMsgGui = function() {
  this.msg = this.add.sprite(0, this.game.height, "msg-gui-01");
  this.msg.scale.set(2);
  this.msg.fixedToCamera = true;

  this.msgText = this.add.bitmapText(126, 406, "font1", "", 12);
  this.msgText.align = "left";
  this.msgText.scale.set(2);
  this.msgText.fixedToCamera = true;

  this.printer = new TextPrinter(this.game, this.msgText);

  this.add
    .tween(this.msg.cameraOffset)
    .to(
      {
        y: this.game.height - this.msg.height
      },
      700,
      Phaser.Easing.Cubic.Out,
      true,
      300
    )
    .onComplete.add(this._firstMsg, this);
};

gameCore._firstMsg = function() {
  var humour = [
    "Why are there so many abandoned factories in games?",
    "Couldn't you just rent a normal office space?",
    "Which workout routine do you follow?",
    "I like taking your mother for a walk!",
    "If you really wanna know about mistakes, ask your parents!",
    "Your house is so small that every time you order a big pizza\nyou have to eat it outside!",
    "You're so fat that your ass can be seen on Google Maps!",
    "You're so fat that you have your own postal code!",
    "By the way, your mom is great at cooking!"
  ];

  this.printer.printText(humour[(Math.random() * humour.length) | 0]);
  this.printer.onComplete.addOnce(this._hideMsgAndStartGame, this);
  this.printer.onCompleteWait = 2500;
};

gameCore._hideMsgAndStartGame = function() {
  this.msgText.visible = false;
  this.add.tween(this.msg.cameraOffset).to(
    {
      y: this.game.height
    },
    500,
    Phaser.Easing.Cubic.In,
    true,
    0
  );

  this.add
    .tween(this.helpKeys.cameraOffset)
    .to(
      {
        x: 10
      },
      500,
      Phaser.Easing.Cubic.Out,
      true,
      300
    )
    .onComplete.addOnce(this._hideHelp, this);

  this.gstate = GState.PLAYING;
};

gameCore._hideHelp = function() {
  this.add.tween(this.helpKeys.cameraOffset).to(
    {
      x: -this.helpKeys.width
    },
    500,
    Phaser.Easing.Cubic.In,
    true,
    5000
  );
};

gameCore._addPlayerCursor = function(player, pnum) {
  player.cursor = this.add.sprite(0, 0, "cursor-p" + pnum);
  player.cursor.scale.set(2);
  player.cursor.anchor.set(0.5);
  player.cursor.fixedToCamera = true;

  player.arrow = this.add.sprite(0, 0, "arrow1");
  player.arrow.scale.set(2);
  player.arrow.anchor.set(0.5);
  player.arrow.fixedToCamera = true;
};

gameCore._addPlayerGui = function(player, pnum) {
  player.gui = this.add.sprite(
    20 + (pnum - 1) * 150,
    20,
    "gui-p" + pnum + "-01"
  );
  var idleAnim = player.gui.animations.add(
    "idle",
    Phaser.ArrayUtils.numberArray(0, 11),
    15, // 3,
    false
  );
  idleAnim.onComplete.add(
    function() {
      player.gui.animations.play("dash");
    }.bind(this)
  );
  player.gui.animations.add(
    "dash",
    Phaser.ArrayUtils.numberArray(12, 13),
    30,
    true
  );
  player.gui.animations.play("idle");
  player.gui.scale.set(2);
  player.gui.fixedToCamera = true;

  player.guiHearts = this.add.sprite(64 + (pnum - 1) * 150, 50, "gui-hearts");
  player.guiHearts.animations.add(
    "lives",
    Phaser.ArrayUtils.numberArray(0, 2),
    1,
    false
  );
  player.guiHearts.animations.play("lives");
  player.guiHearts.scale.set(2);
  player.guiHearts.fixedToCamera = true;
};

gameCore._updatePlayerCursor = function(pnum) {
  var player = this["player" + pnum];

  if (!player) {
    return;
  }

  var cursor = player.cursor;
  var arrow = player.arrow;

  cursor.visible = true;
  arrow.visible = true;

  if (player.y < this.world.bounds.top) {
    cursor.cameraOffset.x = Math.max(
      24,
      Math.min(this.game.width - 24, player.x - this.camera.x)
    );
    cursor.cameraOffset.y = 40;

    arrow.cameraOffset.x = cursor.cameraOffset.x;
    arrow.cameraOffset.y = 10;
    arrow.angle = -90;
  } else if (player.y > this.world.bounds.bottom) {
    cursor.cameraOffset.x = Math.max(
      24,
      Math.min(this.game.width - 24, player.x - this.camera.x)
    );
    cursor.cameraOffset.y = this.game.height - 40;

    arrow.cameraOffset.x = cursor.cameraOffset.x;
    arrow.cameraOffset.y = this.game.height - 10;
    arrow.angle = 90;
  } else if (player.x < this.world.bounds.left) {
    cursor.cameraOffset.x = 40;
    cursor.cameraOffset.y = player.y - this.camera.y;

    arrow.cameraOffset.x = 10;
    arrow.cameraOffset.y = cursor.cameraOffset.y;
    arrow.angle = -180;
  } else if (player.x > this.world.bounds.right) {
    cursor.cameraOffset.x = this.game.width - 40;
    cursor.cameraOffset.y = player.y - this.camera.y;

    arrow.cameraOffset.x = this.game.width - 10;
    arrow.cameraOffset.y = cursor.cameraOffset.y;
    arrow.angle = 0;
  } else {
    cursor.visible = false;
    arrow.visible = false;
  }
};

gameCore.update = function() {
  // this.physics.arcade.collide(this.layer1, this.player1);
  // this.physics.arcade.collide(this.layer1, this.player2);
  // this.physics.arcade.collide(this.player2, this.player1);

  this.collidable.forEach(
    function(tile) {
      tile.justCollidePlayer1 = false;
      tile.justCollidePlayer2 = false;

      this.physics.arcade.collide(
        this.player1,
        tile,
        this._collideCallback.bind(this)
      );
      this.physics.arcade.collide(
        this.player2,
        tile,
        this._collideCallback.bind(this)
      );
    }.bind(this)
  );

  this.player1.body.velocity.x = 0;

  this.player1.jumpTimer += this.time.physicsElapsedMS;

  if (this.gstate == GState.PLAYING) {
    if (
      this.cursors.up.isDown &&
      (this.player1.body.touching.down || this.player1.body.onFloor()) &&
      this.player1.jumpTimer > 50
    ) {
      this.player1.body.velocity.y = -400;
      this.player1.jumpTimer = 0;

      this.player1.animations.play("jump");

      var fx01 = this.fx01[(this.fx01.length * Math.random()) | 0];
      fx01.x = this.player1.x;
      fx01.y = this.player1.y;
      fx01.animations.play("fire");
    }

    if (this.player1.pstate == PState.NORMAL) {
      if (this.cursors.left.isDown) {
        this.player1.body.velocity.x = -200;
        this.player1.scale.x = -2;
      } else if (this.cursors.right.isDown) {
        this.player1.body.velocity.x = 200;
        this.player1.scale.x = 2;
      }

      if (
        this.cursors.down.isDown &&
        !(this.player1.body.touching.down || this.player1.body.onFloor()) &&
        this.player1.gui.animations.name == "dash"
      ) {
        this._startDash(1);
      }
    } else if (this.player1.pstate == PState.DASHING) {
      this._updateDash(1);
    }

    this._updatePlayerCursor(1);
    this._updatePlayerCursor(2);
  }

  // if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
  //   this.state.start("mainMenu");
  // }

  this.printer.update();
};

gameCore.render = function() {
  // this.game.debug.body(this.player1);
  // this.game.debug.body(this.player2);
  // this.collidable.forEach(
  //   function(tile) {
  //     this.game.debug.body(tile);
  //   }.bind(this)
  // );
};

gameCore._updateDash = function(pnum) {
  var player = this["player" + pnum];

  player.x = player.dashingPosX;

  if (player.body.touching.down) {
    player.pstate = PState.NORMAL;
    player.y += 6;

    player.gui.animations.play("idle");

    this._destroyTile();
  } else {
    var fx03 = this.fx03[(this.fx03.length * Math.random()) | 0];
    fx03.x = this.player1.x;
    fx03.y = this.player1.y;
    fx03.animations.play("fire");
  }
};

gameCore._startDash = function(pnum) {
  var player = this["player" + pnum];

  player.pstate = PState.DASHING;
  player.body.velocity.y = 400;

  player.gui.animations.play("idle");
  player.gui.animations.stop("idle");

  player.x = Math.round((player.x - 16) / 32) * 32 + 16;
  player.dashingPosX = player.x;
};

gameCore._collideCallback = function(player, tile) {
  tile["justCollidePlayer" + player.playerId] = true;

  player.animations.play("idle");
};

gameCore._destroyTile = function(pnum) {
  var r = -1;
  var player = this["player" + pnum];
  for (var i = 0; i < this.collidable.length; i++) {
    var elem = this.collidable[i];
    if (elem.justCollidePlayer1) {
      console.log("YES!");
      r = i;
      break;
    }
  }

  if (r < 0) return;

  this.soundExplosion.next().play();

  // var r = (Math.random() * this.collidable.length) | 0;
  // console.log(r);

  var tile = this.collidable.splice(r, 1)[0];
  tile.body.immovable = false;
  tile.body.gravity.y = 600;
  tile.body.maxVelocity.y = 500;
  // tile.body.velocity.x = 100;
  tile.body.velocity.y = 200;
  // tile.body.angularVelocity = 1500;

  this.camera.shake(0.005, 80);

  // Wow, so shitty! :)
  var prevX = tile.x;
  var i1 = r;
  while (
    i1 < this.collidable.length &&
    this.collidable[i1].y == tile.y &&
    this.collidable[i1].x <= prevX + tile.width
  ) {
    prevX = this.collidable[i1].x;
    i1++;
  }
  prevX = tile.x;
  var i2 = r - 1;
  while (
    i2 >= 0 &&
    this.collidable[i2].y == tile.y &&
    this.collidable[i2].x >= prevX - tile.width
  ) {
    prevX = this.collidable[i2].x;
    i2--;
  }
  i2++;

  if (r - i2 < i1 - r) {
    var prevX = tile.x;
    var i = r - 1;
    while (
      i >= 0 &&
      this.collidable[i].y == tile.y &&
      this.collidable[i].x >= prevX - tile.width
    ) {
      this.add.tween(this.collidable[i]).to(
        {
          x: this.collidable[i].x + tile.width
        },
        350,
        Phaser.Easing.Cubic.Out,
        true
      );

      prevX = this.collidable[i].x;
      i--;
    }
  } else {
    var prevX = tile.x;
    var i = r;
    while (
      i < this.collidable.length &&
      this.collidable[i].y == tile.y &&
      this.collidable[i].x <= prevX + tile.width
    ) {
      this.add.tween(this.collidable[i]).to(
        {
          x: this.collidable[i].x - tile.width
        },
        350,
        Phaser.Easing.Cubic.Out,
        true
      );

      prevX = this.collidable[i].x;
      i++;
    }
  }
  //

  // TODO - Almost invisible, should be very noticeable!
  this.flashTile.alpha = 1;
  this.flashTile.x = tile.x;
  this.flashTile.y = tile.y;
  if (this.flashTween) this.flashTween.stop();
  this.flashTween = this.add.tween(this.flashTile);
  this.flashTween.to(
    {
      alpha: 0
    },
    400,
    Phaser.Easing.Cubic.Out,
    true
  );
};

module.exports = gameCore;
