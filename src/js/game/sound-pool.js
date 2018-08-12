var SoundPool = function(sounds, volume) {
  this.sounds = sounds;
  this.cur = 0;
  this.volume = volume || 1;
};

SoundPool.prototype.next = function() {
  var r = this.sounds[this.cur];
  if (r.volume != this.volume) r.volume = this.volume;

  this.cur++;
  if (this.cur >= this.sounds.length) {
    this.cur = 0;
  }

  return r;
};

module.exports = SoundPool;
