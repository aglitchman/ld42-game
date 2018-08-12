var _ = require("lodash");
var properties = require("./properties");

var states = {
  boot: require("./states/boot.js"),
  preloader: require("./states/preloader.js"),
  intro: require("./states/intro.js"),
  mainMenu: require("./states/main-menu.js"),
  gameFail: require("./states/game-fail.js"),
  gameFinal: require("./states/game-final.js"),
  gameMap: require("./states/game-map.js"),
  gameIntro1: require("./states/game-intro1.js"),
  gameIntro2: require("./states/game-intro2.js"),
  gameCore: require("./states/game-core.js")
};

var game = new Phaser.Game({
  width: properties.size.x,
  height: properties.size.y,
  renderer: Phaser.AUTO,
  parent: "game",
  transparent: false,
  antialias: !properties.crisp, // = stage.smoothed
  crisp: properties.crisp, // Crisp pixels!
  enableDebug: true
});

// Automatically register each state.
_.each(states, function(state, key) {
  game.state.add(key, state);
});

game.state.start("boot");
