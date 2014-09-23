/**
* @author       Jeremy Dowell <jeremy@codevinsky.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The AudioSprite class constructor.
*
* @class Phaser.AudioSprite
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
* @param {string} key - Asset key for the sound.
*/

Phaser.AudioSprite = function(game, key) {
  this.game = game;
  this.key = key;
  this.config = this.game.cache.getJSON(key + '-audioatlas');
  this.autoplayKey = null;
  this.autoplay = null;
  this.sounds = {};
  for(var k in this.config.spritemap) {
    var marker = this.config.spritemap[k];
    var s = this.game.add.sound(this.key);
    if(marker.loop) {
      s.addMarker(k, marker.start, (marker.end - marker.start), null, true);
    } else {
      s.addMarker(k, marker.start, (marker.end - marker.start), null, false);
    }
    this.sounds[k] = s;
  }
  if(this.config.autoplay) {
    this.autoplayKey = this.config.autoplay;
    this.play(this.autoplayKey);
    this.autoplay = this.sounds[this.autoplayKey];
  }
};

Phaser.AudioSprite.prototype = {
  /**
    * Play a sound with the given name
    * @method Phaser.AudioSprite#play
    * @param {string} [marker] - The name of sound to play
    * @param {number} [volume=1] - Volume of the sound you want to play. If none is given it will use the volume given to the Sound when it was created (which defaults to 1 if none was specified).
    * @return {Phaser.Sound} This sound instance.
    */
  play: function(marker, volume) {
    volume = typeof volume === 'undefined' ? 1 : volume;
    return this.sounds[marker].play(marker,null, volume);
  },
  /**
    * Play a sound with the given name
    * @method Phaser.AudioSprite#stop
    * @param {string} [marker=''] - The name of sound to stop. If none is given, stop all sounds in the audiosprite
    * @return {Phaser.Sound} This sound instance.
    */
  stop: function(marker) {
    if(!marker) {
      for(var key in this.sounds) {
        this.sounds[key].stop();
      }
    } else {
      this.sounds[marker].stop();
    }
  },
  /**
    * Get a sound with the given name
    * @method Phaser.AudioSprite#play
    * @param {string} [marker] - The name of sound to get
    * @return {Phaser.Sound} This sound instance.
    */
  get: function(marker) {
    return this.sounds[marker];
  }
};
