var context = require("../context");
var TextPrinter = require("../text-printer");
var SoundPool = require("../sound-pool");
var mainMenu = require("./main-menu");

var gameCore = {};

var PState = {
  NORMAL: 0,
  DASHING: 1,
  HURTING: 2,
  DIED: 3
};

var GState = {
  INTRO: 0,
  PLAYING: 1,
  FAILING: 2,
  WINNING: 3
};

var PConsts = {
  LIVES: 3,
  JUMP_VELY: -300,
  DJUMP_VELY: -300,
  MOVE_VELX: 170,
  HURT_VELX: 150,
  HURT_VELY: -250,
  GRAVITY_Y: 600,
  MAX_VELY: 500
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
  this.player1 = this.add.sprite(this.world.centerX - 100, -500, "hero04");
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
  this.player1.body.gravity.y = PConsts.GRAVITY_Y;
  this.player1.body.maxVelocity.y = PConsts.MAX_VELY;
  this.player1.pstate = PState.NORMAL;
  this.player1.jumpTimer = 0;
  this.player1.djumpCount = 0;
  this.player1.lives = 3;

  this.player2 = this.add.sprite(this.world.centerX + 100, -500, "hero05");
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
  this.player2.scale.x = -2;
  this.player2.anchor.set(0.5);
  this.physics.enable(this.player2, Phaser.Physics.ARCADE);
  // this.player2.body.drag.x = 200;
  // this.player2.body.drag.y = 200;
  this.player2.body.gravity.y = PConsts.GRAVITY_Y;
  this.player2.body.maxVelocity.y = PConsts.MAX_VELY;
  this.player2.pstate = PState.NORMAL;
  this.player2.jumpTimer = 0;
  this.player2.djumpCount = 0;
  this.player2.lives = 1;

  this._addFx1();
  this._addFx2();
  this._addFx3();
  this._addFx4();

  this.camera.focusOn(this.player1);
  this.camera.follow(this.player1, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);

  this.cursors = this.input.keyboard.addKeys({
    up: Phaser.KeyCode.UP,
    down: Phaser.KeyCode.DOWN,
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    up2: Phaser.KeyCode.W,
    down2: Phaser.KeyCode.S,
    left2: Phaser.KeyCode.A,
    right2: Phaser.KeyCode.D
  });

  this._addPlayerCursor(this.player1, 1);
  this._addPlayerCursor(this.player2, 2);

  this._addPlayerGui(this.player1, 1);
  this._addPlayerGui(this.player2, 2);

  this._addHelp();

  this._addMsgGui();

  // this.gstate = GState.INTRO;
  this.gstate = GState.PLAYING;

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

  this.soundJump = new SoundPool([
    this.add.audio("sound-jump2"),
    this.add.audio("sound-jump2"),
    this.add.audio("sound-jump2")
  ]);

  this.soundHit1 = new SoundPool([
    this.add.audio("sound-hit1"),
    this.add.audio("sound-hit1"),
    this.add.audio("sound-hit1")
  ]);

  this.soundVoice = this.add.audio("sound-voice");
};

gameCore._addFx1 = function() {
  this.fx01 = [];
  for (var k = 0; k < 10; k++) {
    this.fx01[k] = this.add.sprite(-100, -100, "fx01");
    this.fx01[k].animations.add("fire", null, 40);
    this.fx01[k].animations.play("fire");
    this.fx01[k].scale.set(2);
    this.fx01[k].anchor.set(0.5);
  }
};
gameCore._addFx2 = function() {
  this.fx02 = [];
  for (var k = 0; k < 10; k++) {
    this.fx02[k] = this.add.sprite(-100, -100, "fx02");
    this.fx02[k].animations.add("fire", null, 40);
    this.fx02[k].animations.play("fire");
    this.fx02[k].scale.set(2);
    this.fx02[k].anchor.set(0.5);
  }
};
gameCore._addFx3 = function() {
  this.fx03 = [];
  for (var k = 0; k < 10; k++) {
    this.fx03[k] = this.add.sprite(-100, -100, "fx03");
    this.fx03[k].animations.add("fire", null, 40);
    this.fx03[k].animations.play("fire");
    this.fx03[k].scale.set(2);
    this.fx03[k].anchor.set(0.5);
  }
};
gameCore._addFx4 = function() {
  this.fx04 = [];
  for (var k = 0; k < 10; k++) {
    this.fx04[k] = this.add.sprite(-100, -100, "fx04");
    this.fx04[k].animations.add("fire", null, 40);
    this.fx04[k].animations.play("fire");
    this.fx04[k].scale.set(2);
    this.fx04[k].anchor.set(0.5);
  }
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

  var tween = this.add.tween(this.msg.cameraOffset).to(
    {
      y: this.game.height - this.msg.height
    },
    700,
    Phaser.Easing.Cubic.Out,
    true,
    300
  );
  tween.onStart.addOnce(this._firstMsgSound, this);
  tween.onComplete.addOnce(this._firstMsg, this);
};

gameCore._firstMsgSound = function() {};

gameCore._firstMsg = function() {
  var humour = [
    "Why are there so many abandoned factories in games?",
    "Couldn't you just rent a normal office space?",
    "Which workout routine do you follow?",
    // "I like taking your mother for a walk!",
    "If you really wanna know about mistakes, ask your parents!",
    "Your house is so small that every time you order a big pizza\nyou have to eat it outside!",
    "You're so fat that your ass can be seen on Google Maps!",
    "You're so fat that you have your own postal code!"
    // "By the way, your mom is great at cooking!"
  ];

  this.printer.printText(humour[(Math.random() * humour.length) | 0]);
  this.printer.onComplete.addOnce(this._hideMsgAndStartGame, this);
  this.printer.onCompleteWait = 2500;

  this.soundVoice.play();
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

gameCore._initGameFail = function() {
  this.msgText.visible = true;
  this.printer.printText("");

  var tween = this.add.tween(this.msg.cameraOffset).to(
    {
      y: this.game.height - this.msg.height
    },
    700,
    Phaser.Easing.Cubic.Out,
    true,
    300
  );
  tween.onComplete.addOnce(this._initGameFailStep2, this);
};

gameCore._initGameFailStep2 = function() {
  this.printer.printText("I'll be back!!");
  this.printer.onComplete.addOnce(this._initGameFailStep3, this);
  this.printer.onCompleteWait = 2500;

  this.soundVoice.play();
};

gameCore._initGameFailStep3 = function() {
  this.state.start("gameFail");
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
  player.guiHearts.animations.frame = player.lives;
  player.guiHearts.scale.set(2);
  player.guiHearts.fixedToCamera = true;
};

gameCore._killPlayer = function(player) {
  player.pstate = PState.DIED;

  this.soundExplosion.next().play();

  if (player.playerId == 1) {
    this._initGameFail();
  } else {
    this.time.events.add(1500, this._initGameWin, this);
  }
};

gameCore._initGameWin = function() {
  this.state.start("gameWin");
};

gameCore._revivePlayer = function(player) {
  player.pstate = PState.NORMAL;
  player.animations.play("idle");
  player.gui.animations.play("idle");
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.body.acceleration.x = 0;
  player.body.acceleration.y = 0;
  player.jumpTimer = 0;
  player.djumpCount = 0;
  player.x = this.world.centerX;
  player.y = -300;

  this.soundExplosion.next().play();
  // this.camera.shake(0.005, 150);
};

gameCore._updatePlayerGui = function(player) {
  player.guiHearts.animations.frame = player.lives;
};

gameCore._updatePlayerCursor = function(player) {
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

gameCore._playFx01 = function(player, dx, dy) {
  var fx01 = this.fx01[(this.fx01.length * Math.random()) | 0];
  fx01.x = player.x + (dx | 0);
  fx01.y = player.y + (dy | 0);
  fx01.animations.play("fire");
};

gameCore._playFx02 = function(player, dx, dy) {
  var fx02 = this.fx02[(this.fx02.length * Math.random()) | 0];
  fx02.x = player.x + (dx | 0);
  fx02.y = player.y + (dy | 0);
  fx02.animations.play("fire");
};

gameCore._playFx03 = function(player, dx, dy) {
  var fx03 = this.fx03[(this.fx03.length * Math.random()) | 0];
  fx03.x = player.x + (dx | 0);
  fx03.y = player.y + (dy | 0);
  fx03.animations.play("fire");
};

gameCore._playFx04 = function(player, dx, dy) {
  var fx04 = this.fx04[(this.fx04.length * Math.random()) | 0];
  fx04.x = player.x + (dx | 0);
  fx04.y = player.y + (dy | 0);
  fx04.animations.play("fire");
};

gameCore._updatePlayer = function(player) {
  if (player.pstate == PState.NORMAL) {
    player.body.velocity.x = 0;
    player.jumpTimer += this.time.physicsElapsedMS;

    var yd = Phaser.Math.distance(
      0,
      player.position.y,
      0,
      player.previousPosition.y
    );

    if (yd > 0.05) {
      player.animations.play("jump");
    } else if (player.body.touching.down) {
      if (player.animations.name == "jump") {
        this.soundHit1.next().play();
        this._playFx04(player, 0, -2);
      }
      player.animations.play("idle");
      player.djumpCount = 0;
    }

    if (player == this.player1) {
      if (
        (this.cursors.up.isDown || this.cursors.up2.isDown) &&
        player.jumpTimer > 50
      ) {
        if (player.body.touching.down) {
          player.body.velocity.y = PConsts.JUMP_VELY;
          player.jumpTimer = 0;
          player.djumpCount = 0;

          player.animations.play("jump");
          this.soundJump.next().play();

          this._playFx01(player, 0, -2);
        } else if (player.djumpCount < 1 && player.body.velocity.y > -5) {
          player.body.velocity.y = PConsts.DJUMP_VELY;
          player.jumpTimer = 0;
          player.djumpCount++;

          player.animations.play("jump");
          this.soundJump.next().play();

          this._playFx01(player, 0, -2);
        }
      }

      if (this.cursors.left.isDown || this.cursors.left2.isDown) {
        player.body.velocity.x = -1 * PConsts.MOVE_VELX;
        player.scale.x = -2;
      } else if (this.cursors.right.isDown || this.cursors.right2.isDown) {
        player.body.velocity.x = 1 * PConsts.MOVE_VELX;
        player.scale.x = 2;
      }

      if (
        (this.cursors.down.isDown || this.cursors.down2.isDown) &&
        player.animations.name == "jump" &&
        player.gui.animations.name == "dash"
      ) {
        this._startDash(player);
      }
    }
  } else if (player.pstate == PState.HURTING) {
    if (player.hurtingSide < 0) {
      player.body.velocity.x = -1 * PConsts.HURT_VELX;
      player.scale.x = -2;
    } else {
      player.body.velocity.x = 1 * PConsts.HURT_VELX;
      player.scale.x = 2;
    }

    this._playFx03(player, 0, -2);

    if (player.body.velocity.y > -5) {
      player.pstate = PState.NORMAL;
    }
  } else if (player.pstate == PState.DASHING) {
    this._updateDash(player);
  }

  if (player.pstate == PState.DIED) {
    //
  } else {
    if (
      player.y > this.world.bounds.bottom + 200 ||
      player.x < this.world.bounds.left - 400 ||
      player.x > this.world.bounds.right + 400
    ) {
      player.lives--;
      if (player.lives == 0) {
        this._killPlayer(player);
      } else {
        this._revivePlayer(player);
      }
    }
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

  if (this.gstate == GState.PLAYING) {
    this._updatePlayer(this.player1);
    this._updatePlayer(this.player2);
  }

  this._updatePlayerGui(this.player1);
  this._updatePlayerGui(this.player2);

  this._updatePlayerCursor(this.player1);
  this._updatePlayerCursor(this.player2);

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

gameCore._updateDash = function(player) {
  player.x = player.dashingPosX;

  if (player.body.touching.down) {
    player.pstate = PState.NORMAL;
    player.y += 6;

    player.animations.play("idle");
    player.gui.animations.play("idle");

    this._destroyTile(player);
  } else {
    var fx03 = this.fx03[(this.fx03.length * Math.random()) | 0];
    fx03.x = this.player1.x;
    fx03.y = this.player1.y;
    fx03.animations.play("fire");
  }
};

gameCore._startDash = function(player) {
  player.pstate = PState.DASHING;
  player.body.velocity.y = 400;

  player.animations.play("dash");

  player.gui.animations.play("idle");
  player.gui.animations.stop("idle");

  player.x = Math.round((player.x - 16) / 32) * 32 + 16;
  player.dashingPosX = player.x;
};

gameCore._collideCallback = function(player, tile) {
  tile["justCollidePlayer" + player.playerId] = true;

  // player.animations.play("idle");
};

gameCore._destroyTile = function(player) {
  var r = -1;
  for (var i = 0; i < this.collidable.length; i++) {
    var elem = this.collidable[i];
    if (
      (player.playerId == 1 && elem.justCollidePlayer1) ||
      (player.playerId == 2 && elem.justCollidePlayer2)
    ) {
      // console.log("YES!");
      r = i;
      break;
    }
  }

  if (r < 0) return;

  var player2 = null;
  if (player == this.player1) {
    player2 = this.player2;
  } else {
    player2 = this.player1;
  }

  if (Phaser.Math.distance(player2.x, 0, player.x, 0) < 60) {
    var side = -1;
    if (player2.x > player.x) side = 1;

    if (player2.pstate == PState.NORMAL) {
      player2.body.velocity.y = PConsts.HURT_VELY;
      player2.pstate = PState.HURTING;
      player2.hurtingSide = side;
      player2.animations.play("idle");

      this._playFx02(player2, 0, -2);
    }
  }

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

  // this.camera.shake(0.005, 80);

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
