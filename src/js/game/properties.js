var npmProperties = require("../../../package.json");

module.exports = {
  title: "LD42 Game",
  description: npmProperties.description,
  port: 3017,
  liveReloadPort: 3018,
  mute: false,
  showStats: true,
  size: {
    x: 800,
    y: 500
  },
  analyticsId: "", // UA-123741756-1
  crisp: true,
  saveGameKey: "glitchman-ld42-game"
};
