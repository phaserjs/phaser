/// <reference path="../_definitions.ts" />
/**
* Phaser - SoundManager
*
*/
var Phaser;
(function (Phaser) {
    var SoundManager = (function () {
        /**
        * SoundManager constructor
        * Create a new <code>SoundManager</code>.
        */
        function SoundManager(game) {
            this.usingWebAudio = false;
            this.usingAudioTag = false;
            this.noAudio = false;
            /**
            * Reference to AudioContext instance.
            */
            this.context = null;
            this._muted = false;
            this.touchLocked = false;
            this._unlockSource = null;
            this.onSoundDecode = new Phaser.Signal();
            this.game = game;
            this._volume = 1;
            this._muted = false;
            this._sounds = [];
            if(this.game.device.iOS && this.game.device.webAudio == false) {
                this.channels = 1;
            }
            if(this.game.device.iOS || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock)) {
                this.game.input.touch.callbackContext = this;
                this.game.input.touch.touchStartCallback = this.unlock;
                this.game.input.mouse.callbackContext = this;
                this.game.input.mouse.mouseDownCallback = this.unlock;
                this.touchLocked = true;
            } else {
                //  What about iOS5?
                this.touchLocked = false;
            }
            if(window['PhaserGlobal']) {
                //  Check to see if all audio playback is disabled (i.e. handled by a 3rd party class)
                if(window['PhaserGlobal'].disableAudio == true) {
                    this.usingWebAudio = false;
                    this.noAudio = true;
                    return;
                }
                //  Check if the Web Audio API is disabled (for testing Audio Tag playback during development)
                if(window['PhaserGlobal'].disableWebAudio == true) {
                    this.usingWebAudio = false;
                    this.usingAudioTag = true;
                    this.noAudio = false;
                    return;
                }
            }
            this.usingWebAudio = true;
            this.noAudio = false;
            if(!!window['AudioContext']) {
                this.context = new window['AudioContext']();
            } else if(!!window['webkitAudioContext']) {
                this.context = new window['webkitAudioContext']();
            } else if(!!window['Audio']) {
                this.usingWebAudio = false;
                this.usingAudioTag = true;
            } else {
                this.usingWebAudio = false;
                this.noAudio = true;
            }
            if(this.context !== null) {
                if(typeof this.context.createGain === 'undefined') {
                    this.masterGain = this.context.createGainNode();
                } else {
                    this.masterGain = this.context.createGain();
                }
                this.masterGain.gain.value = 1;
                this.masterGain.connect(this.context.destination);
            }
        }
        SoundManager.prototype.unlock = function () {
            if(this.touchLocked == false) {
                return;
            }
            //console.log('SoundManager touch unlocked');
            if(this.game.device.webAudio && (window['PhaserGlobal'] && window['PhaserGlobal'].disableWebAudio == false)) {
                // Create empty buffer and play it
                var buffer = this.context.createBuffer(1, 1, 22050);
                this._unlockSource = this.context.createBufferSource();
                this._unlockSource.buffer = buffer;
                this._unlockSource.connect(this.context.destination);
                this._unlockSource.noteOn(0);
            } else {
                //  Create an Audio tag?
                this.touchLocked = false;
                this._unlockSource = null;
                this.game.input.touch.callbackContext = null;
                this.game.input.touch.touchStartCallback = null;
                this.game.input.mouse.callbackContext = null;
                this.game.input.mouse.mouseDownCallback = null;
            }
        };
        Object.defineProperty(SoundManager.prototype, "mute", {
            get: /**
            * A global audio mute toggle.
            */
            function () {
                return this._muted;
            },
            set: function (value) {
                if(value) {
                    if(this._muted) {
                        return;
                    }
                    this._muted = true;
                    if(this.usingWebAudio) {
                        this._muteVolume = this.masterGain.gain.value;
                        this.masterGain.gain.value = 0;
                    }
                    //  Loop through sounds
                    for(var i = 0; i < this._sounds.length; i++) {
                        if(this._sounds[i].usingAudioTag) {
                            this._sounds[i].mute = true;
                        }
                    }
                } else {
                    if(this._muted == false) {
                        return;
                    }
                    this._muted = false;
                    if(this.usingWebAudio) {
                        this.masterGain.gain.value = this._muteVolume;
                    }
                    //  Loop through sounds
                    for(var i = 0; i < this._sounds.length; i++) {
                        if(this._sounds[i].usingAudioTag) {
                            this._sounds[i].mute = false;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundManager.prototype, "volume", {
            get: function () {
                if(this.usingWebAudio) {
                    return this.masterGain.gain.value;
                } else {
                    return this._volume;
                }
            },
            set: /**
            * The global audio volume. A value between 0 (silence) and 1 (full volume)
            */
            function (value) {
                value = this.game.math.clamp(value, 1, 0);
                this._volume = value;
                if(this.usingWebAudio) {
                    this.masterGain.gain.value = value;
                }
                //  Loop through the sound cache and change the volume of all html audio tags
                for(var i = 0; i < this._sounds.length; i++) {
                    if(this._sounds[i].usingAudioTag) {
                        this._sounds[i].volume = this._sounds[i].volume * value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        SoundManager.prototype.stopAll = function () {
            for(var i = 0; i < this._sounds.length; i++) {
                if(this._sounds[i]) {
                    this._sounds[i].stop();
                }
            }
        };
        SoundManager.prototype.pauseAll = function () {
            for(var i = 0; i < this._sounds.length; i++) {
                if(this._sounds[i]) {
                    this._sounds[i].pause();
                }
            }
        };
        SoundManager.prototype.resumeAll = function () {
            for(var i = 0; i < this._sounds.length; i++) {
                if(this._sounds[i]) {
                    this._sounds[i].resume();
                }
            }
        };
        SoundManager.prototype.decode = /**
        * Decode a sound with its assets key.
        * @param key {string} Assets key of the sound to be decoded.
        * @param [sound] {Sound} its bufer will be set to decoded data.
        */
        function (key, sound) {
            if (typeof sound === "undefined") { sound = null; }
            var soundData = this.game.cache.getSoundData(key);
            if(soundData) {
                if(this.game.cache.isSoundDecoded(key) === false) {
                    this.game.cache.updateSound(key, 'isDecoding', true);
                    var that = this;
                    this.context.decodeAudioData(soundData, function (buffer) {
                        that.game.cache.decodedSound(key, buffer);
                        if(sound) {
                            that.onSoundDecode.dispatch(sound);
                        }
                    });
                }
            }
        };
        SoundManager.prototype.update = function () {
            if(this.touchLocked) {
                if(this.game.device.webAudio && this._unlockSource !== null) {
                    if((this._unlockSource.playbackState === this._unlockSource.PLAYING_STATE || this._unlockSource.playbackState === this._unlockSource.FINISHED_STATE)) {
                        this.touchLocked = false;
                        this._unlockSource = null;
                        this.game.input.touch.callbackContext = null;
                        this.game.input.touch.touchStartCallback = null;
                    }
                }
            }
            for(var i = 0; i < this._sounds.length; i++) {
                this._sounds[i].update();
            }
        };
        SoundManager.prototype.add = function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            var sound = new Phaser.Sound(this.game, key, volume, loop);
            this._sounds.push(sound);
            return sound;
        };
        return SoundManager;
    })();
    Phaser.SoundManager = SoundManager;    
})(Phaser || (Phaser = {}));
