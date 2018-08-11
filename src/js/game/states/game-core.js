var context = require("../context");

var gameCore = {};

gameCore.create = function() {
  this.game.stage.backgroundColor = "#000000"; // "#222034";

  // this.text1 = this.add.bitmapText(
  //   this.game.width / 2,
  //   350,
  //   "font1",
  //   "Hm...........",
  //   12
  // );
  // this.text1.align = "center";
  // this.text1.scale.set(2);
  // this.text1.anchor.x = 0.5;
  // this.text1.fixedToCamera = true;

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

      this.collidable.push(tile);
    }
  }

  // DEBUG
  window.map = this.map;

  this.player1 = this.add.sprite(
    this.world.centerX + 100,
    this.world.centerY,
    "hero01"
  );
  this.player1.scale.set(2);
  this.player1.anchor.set(0.5);
  this.physics.enable(this.player1, Phaser.Physics.ARCADE);
  // this.player1.body.collideWorldBounds = true;
  this.player1.body.gravity.y = 600;
  this.player1.body.maxVelocity.y = 500;
  this.player1.jumpTimer = 0;

  this.player2 = this.add.sprite(
    this.world.centerX + 150,
    this.world.centerY,
    "hero01"
  );
  this.player2.scale.set(2);
  this.player2.anchor.set(0.5);
  this.physics.enable(this.player2, Phaser.Physics.ARCADE);
  this.player2.body.drag.x = 200;
  this.player2.body.drag.y = 200;
  // this.player2.body.collideWorldBounds = true;
  this.player2.body.gravity.y = 600;

  this.camera.focusOn(this.player1);
  this.camera.follow(this.player1, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);

  this.cursors = this.input.keyboard.createCursorKeys();
};

gameCore.update = function() {
  // this.physics.arcade.collide(this.layer1, this.player1);
  // this.physics.arcade.collide(this.layer1, this.player2);
  this.physics.arcade.collide(this.player2, this.player1);

  this.collidable.forEach(
    function(tile) {
      this.physics.arcade.collide(this.player1, tile);
      this.physics.arcade.collide(this.player2, tile);
    }.bind(this)
  );

  this.player1.body.velocity.x = 0;

  if (this.cursors.left.isDown) {
    this.player1.body.velocity.x = -200;
  } else if (this.cursors.right.isDown) {
    this.player1.body.velocity.x = 200;
  }

  this.player1.jumpTimer += this.time.physicsElapsedMS;
  if (
    this.cursors.up.isDown &&
    (this.player1.body.touching.down || this.player1.body.onFloor()) &&
    this.player1.jumpTimer > 50
  ) {
    this.player1.body.velocity.y = -400;
    this.player1.jumpTimer = 0;
  }

  if (this.cursors.down.justReleased()) {
    var r = Math.random() * this.collidable.length | 0;
    // console.log(r);

    var tile = this.collidable.splice(r, 1)[0];
    tile.body.immovable = false;
    tile.body.gravity.y = 600;
    tile.body.maxVelocity.y = 500;
    // tile.body.velocity.x = 100;
    tile.body.velocity.y = 100;
    // tile.body.angularVelocity = 1500;

    this.camera.shake(0.005, 80);

    console.log("wtf");
  }
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

module.exports = gameCore;
