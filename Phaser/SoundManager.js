/// <reference path="Game.ts" />
/// <reference path="system/Sound.ts" />
/**
* Phaser - SoundManager
*
* This is an embroyonic web audio sound management class. There is a lot of work still to do here.
*/
var Phaser;
(function (Phaser) {
    var SoundManager = (function () {
        function SoundManager(game) {
            this._context = null;
            this._game = game;
            if(game.device.webaudio == true) {
                if(!!window['AudioContext']) {
                    this._context = new window['AudioContext']();
                } else if(!!window['webkitAudioContext']) {
                    this._context = new window['webkitAudioContext']();
                }
                if(this._context !== null) {
                    this._gainNode = this._context.createGainNode();
                    this._gainNode.connect(this._context.destination);
                    this._volume = 1;
                }
            }
        }
        SoundManager.prototype.mute = function () {
            this._gainNode.gain.value = 0;
        };
        SoundManager.prototype.unmute = function () {
            this._gainNode.gain.value = this._volume;
        };
        Object.defineProperty(SoundManager.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                this._gainNode.gain.value = this._volume;
            },
            enumerable: true,
            configurable: true
        });
        SoundManager.prototype.decode = function (key, callback, sound) {
            if (typeof callback === "undefined") { callback = null; }
            if (typeof sound === "undefined") { sound = null; }
            var soundData = this._game.cache.getSound(key);
            if(soundData) {
                if(this._game.cache.isSoundDecoded(key) === false) {
                    var that = this;
                    this._context.decodeAudioData(soundData, function (buffer) {
                        that._game.cache.decodedSound(key, buffer);
                        if(sound) {
                            sound.setDecodedBuffer(buffer);
                        }
                        callback();
                    });
                }
            }
        };
        SoundManager.prototype.play = function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            if(this._context === null) {
                return;
            }
            var soundData = this._game.cache.getSound(key);
            if(soundData) {
                //  Does the sound need decoding?
                if(this._game.cache.isSoundDecoded(key) === true) {
                    return new Phaser.Sound(this._context, this._gainNode, soundData, volume, loop);
                } else {
                    var tempSound = new Phaser.Sound(this._context, this._gainNode, null, volume, loop);
                    //  this is an async process, so we can return the Sound object anyway, it just won't be playing yet
                    this.decode(key, function () {
                        return tempSound.play();
                    }, tempSound);
                    return tempSound;
                }
            }
        };
        return SoundManager;
    })();
    Phaser.SoundManager = SoundManager;    
})(Phaser || (Phaser = {}));
