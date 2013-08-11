/// <reference path="../Game.ts" />
/// <reference path="../SoundManager.ts" />
/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/
var Phaser;
(function (Phaser) {
    var Sound = (function () {
        function Sound(context, gainNode, data, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.loop = false;
            this.isPlaying = false;
            this.isDecoding = false;
            this._context = context;
            this._gainNode = gainNode;
            this._buffer = data;
            this._volume = volume;
            this.loop = loop;
            //  Local volume control
            if(this._context !== null) {
                this._localGainNode = this._context.createGainNode();
                this._localGainNode.connect(this._gainNode);
                this._localGainNode.gain.value = this._volume;
            }
            if(this._buffer === null) {
                this.isDecoding = true;
            } else {
                this.play();
            }
        }
        Sound.prototype.setDecodedBuffer = function (data) {
            this._buffer = data;
            this.isDecoding = false;
            //this.play();
                    };
        Sound.prototype.play = function () {
            if(this._buffer === null || this.isDecoding === true) {
                return;
            }
            this._sound = this._context.createBufferSource();
            this._sound.buffer = this._buffer;
            this._sound.connect(this._localGainNode);
            if(this.loop) {
                this._sound.loop = true;
            }
            this._sound.noteOn(0)// the zero is vitally important, crashes iOS6 without it
            ;
            this.duration = this._sound.buffer.duration;
            this.isPlaying = true;
        };
        Sound.prototype.stop = function () {
            if(this.isPlaying === true) {
                this.isPlaying = false;
                this._sound.noteOff(0);
            }
        };
        Sound.prototype.mute = function () {
            this._localGainNode.gain.value = 0;
        };
        Sound.prototype.unmute = function () {
            this._localGainNode.gain.value = this._volume;
        };
        Object.defineProperty(Sound.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                this._localGainNode.gain.value = this._volume;
            },
            enumerable: true,
            configurable: true
        });
        return Sound;
    })();
    Phaser.Sound = Sound;    
})(Phaser || (Phaser = {}));
