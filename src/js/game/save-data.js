var properties = require("./properties");

var saveData = {};

saveData = function() {
  this.reset();
};

// SOUND/MUSIC switching is not implemented!

saveData.load = function() {
  var s = window.localStorage.getItem(properties.saveGameKey);
  if (!s) return;

  s = JSON.parse(s);
  if (!s) return;

  this.saved = true;

  this.maxLevel = s.maxLevel;
  this.tutorial = s.tutorial;
  this.finished = s.finished;
  this.music = s.music || this.music;
  this.sounds = s.sounds || this.sounds;
};

saveData.save = function() {
  this.saved = true;

  var m = {};
  m.maxLevel = this.maxLevel;
  m.tutorial = this.tutorial;
  m.finished = this.finished;
  m.music = this.music;
  m.sounds = this.sounds;
  m.version = 1;

  try {
    window.localStorage.setItem(properties.saveGameKey, JSON.stringify(m));
  } catch (e) {
    console.log("Can't save the game", e);
  }
};

saveData.reset = function(cleanSave) {
  this.saved = false;

  this.maxLevel = 1;
  this.tutorial = true;
  this.finished = false;
  this.music = true;
  this.sounds = true;

  if (cleanSave) {
    try {
      window.localStorage.setItem(properties.saveGameKey, null);
    } catch (e) {
      console.log("Can't reset the game", e);
    }
  }
};

module.exports = saveData;
