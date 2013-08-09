/// <reference path="../_definitions.ts" />
/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/
var Phaser;
(function (Phaser) {
    var Sound = (function () {
        /**
        * Sound constructor
        * @param [volume] {number} volume of this sound when playing.
        * @param [loop] {boolean} loop this sound when playing? (Default to false)
        */
        function Sound(game, key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            /**
            * Reference to AudioContext instance.
            */
            this.context = null;
            /**
            * Decoded data buffer / Audio tag.
            */
            this._buffer = null;
            this._muted = false;
            this.usingWebAudio = false;
            this.usingAudioTag = false;
            this.name = '';
            this.autoplay = false;
            this.totalDuration = 0;
            this.startTime = 0;
            this.currentTime = 0;
            this.duration = 0;
            this.stopTime = 0;
            this.paused = false;
            this.loop = false;
            this.isPlaying = false;
            this.currentMarker = '';
            this.pendingPlayback = false;
            this.override = false;
            this.game = game;

            this.usingWebAudio = this.game.sound.usingWebAudio;
            this.usingAudioTag = this.game.sound.usingAudioTag;
            this.key = key;

            if (this.usingWebAudio) {
                this.context = this.game.sound.context;
                this.masterGainNode = this.game.sound.masterGain;

                if (typeof this.context.createGain === 'undefined') {
                    this.gainNode = this.context.createGainNode();
                } else {
                    this.gainNode = this.context.createGain();
                }

                this.gainNode.gain.value = volume * this.game.sound.volume;
                this.gainNode.connect(this.masterGainNode);
            } else {
                if (this.game.cache.getSound(key) && this.game.cache.getSound(key).locked == false) {
                    this._sound = this.game.cache.getSoundData(key);
                    this.totalDuration = this._sound.duration;
                } else {
                    this.game.cache.onSoundUnlock.add(this.soundHasUnlocked, this);
                }
            }

            this._volume = volume;
            this.loop = loop;
            this.markers = {};

            this.onDecoded = new Phaser.Signal();
            this.onPlay = new Phaser.Signal();
            this.onPause = new Phaser.Signal();
            this.onResume = new Phaser.Signal();
            this.onLoop = new Phaser.Signal();
            this.onStop = new Phaser.Signal();
            this.onMute = new Phaser.Signal();
            this.onMarkerComplete = new Phaser.Signal();
        }
        Sound.prototype.soundHasUnlocked = function (key) {
            if (key == this.key) {
                this._sound = this.game.cache.getSoundData(this.key);
                this.totalDuration = this._sound.duration;
                //console.log('sound has unlocked', this._sound);
            }
        };

        Object.defineProperty(Sound.prototype, "isDecoding", {
            get: function () {
                return this.game.cache.getSound(this.key).isDecoding;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Sound.prototype, "isDecoded", {
            get: function () {
                return this.game.cache.isSoundDecoded(this.key);
            },
            enumerable: true,
            configurable: true
        });

        Sound.prototype.addMarker = function (name, start, stop, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.markers[name] = { name: name, start: start, stop: stop, volume: volume, duration: stop - start, loop: loop };
        };

        Sound.prototype.removeMarker = function (name) {
            delete this.markers[name];
        };

        Sound.prototype.update = function () {
            if (this.pendingPlayback && this.game.cache.isSoundReady(this.key)) {
                this.pendingPlayback = false;
                this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
            }

            if (this.isPlaying) {
                this.currentTime = this.game.time.now - this.startTime;

                if (this.currentTime >= this.duration) {
                    if (this.usingWebAudio) {
                        if (this.loop) {
                            //console.log('loop1');
                            //  won't work with markers, needs to reset the position
                            this.onLoop.dispatch(this);

                            if (this.currentMarker == '') {
                                //console.log('loop2');
                                this.currentTime = 0;
                                this.startTime = this.game.time.now;
                            } else {
                                //console.log('loop3');
                                this.play(this.currentMarker, 0, this.volume, true, true);
                            }
                        } else {
                            //console.log('stopping, no loop for marker');
                            this.stop();
                        }
                    } else {
                        if (this.loop) {
                            this.onLoop.dispatch(this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        } else {
                            this.stop();
                        }
                    }
                }
            }
        };

        /**
        * Play this sound, or a marked section of it.
        * @param marker {string} Assets key of the sound you want to play.
        * @param [volume] {number} volume of the sound you want to play.
        * @param [loop] {boolean} loop when it finished playing? (Default to false)
        * @return {Sound} The playing sound object.
        */
        Sound.prototype.play = function (marker, position, volume, loop, forceRestart) {
            if (typeof marker === "undefined") { marker = ''; }
            if (typeof position === "undefined") { position = 0; }
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof forceRestart === "undefined") { forceRestart = false; }
            if (this.isPlaying == true && forceRestart == false && this.override == false) {
                //  Use Restart instead
                return;
            }

            if (this.isPlaying && this.override) {
                if (this.usingWebAudio) {
                    if (typeof this._sound.stop === 'undefined') {
                        this._sound.noteOff(0);
                    } else {
                        this._sound.stop(0);
                    }
                } else if (this.usingAudioTag) {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }

            this.currentMarker = marker;

            if (marker !== '' && this.markers[marker]) {
                this.position = this.markers[marker].start;
                this.volume = this.markers[marker].volume;
                this.loop = this.markers[marker].loop;
                this.duration = this.markers[marker].duration * 1000;

                //console.log('marker info loaded', this.loop, this.duration);
                this._tempMarker = marker;
                this._tempPosition = this.position;
                this._tempVolume = this.volume;
                this._tempLoop = this.loop;
            } else {
                this.position = position;
                this.volume = volume;
                this.loop = loop;
                this.duration = 0;

                this._tempMarker = marker;
                this._tempPosition = position;
                this._tempVolume = volume;
                this._tempLoop = loop;
            }

            if (this.usingWebAudio) {
                if (this.game.cache.isSoundDecoded(this.key)) {
                    if (this._buffer == null) {
                        this._buffer = this.game.cache.getSoundData(this.key);
                    }

                    //if (this._sound == null)
                    //{
                    this._sound = this.context.createBufferSource();
                    this._sound.buffer = this._buffer;
                    this._sound.connect(this.gainNode);
                    this.totalDuration = this._sound.buffer.duration;

                    if (this.duration == 0) {
                        this.duration = this.totalDuration * 1000;
                    }

                    if (this.loop && marker == '') {
                        this._sound.loop = true;
                    }

                    if (typeof this._sound.start === 'undefined') {
                        this._sound.noteGrainOn(0, this.position, this.duration / 1000);
                        //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                    } else {
                        this._sound.start(0, this.position, this.duration / 1000);
                    }

                    this.isPlaying = true;
                    this.startTime = this.game.time.now;
                    this.currentTime = 0;
                    this.stopTime = this.startTime + this.duration;
                    this.onPlay.dispatch(this);
                    //console.log('playing, start', this.startTime, 'stop');
                } else {
                    this.pendingPlayback = true;

                    if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding == false) {
                        this.game.sound.decode(this.key, this);
                    }
                }
            } else {
                if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked) {
                    //console.log('tried playing locked sound, pending set, reload started');
                    this.game.cache.reloadSound(this.key);
                    this.pendingPlayback = true;
                } else {
                    if (this._sound && this._sound.readyState == 4) {
                        if (this.duration == 0) {
                            this.duration = this.totalDuration * 1000;
                        }

                        //console.log('playing', this._sound);
                        this._sound.currentTime = this.position;
                        this._sound.muted = this._muted;

                        if (this._muted) {
                            this._sound.volume = 0;
                        } else {
                            this._sound.volume = this._volume;
                        }

                        this._sound.play();

                        this.isPlaying = true;
                        this.startTime = this.game.time.now;
                        this.currentTime = 0;
                        this.stopTime = this.startTime + this.duration;
                        this.onPlay.dispatch(this);
                    } else {
                        this.pendingPlayback = true;
                    }
                }
            }
        };

        Sound.prototype.restart = function (marker, position, volume, loop) {
            if (typeof marker === "undefined") { marker = ''; }
            if (typeof position === "undefined") { position = 0; }
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.play(marker, position, volume, loop, true);
        };

        Sound.prototype.pause = function () {
            if (this.isPlaying && this._sound) {
                this.stop();
                this.isPlaying = false;
                this.paused = true;
                this.onPause.dispatch(this);
            }
        };

        Sound.prototype.resume = function () {
            if (this.paused && this._sound) {
                if (this.usingWebAudio) {
                    if (typeof this._sound.start === 'undefined') {
                        this._sound.noteGrainOn(0, this.position, this.duration);
                        //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                    } else {
                        this._sound.start(0, this.position, this.duration);
                    }
                } else {
                    this._sound.play();
                }

                this.isPlaying = true;
                this.paused = false;
                this.onResume.dispatch(this);
            }
        };

        /**
        * Stop playing this sound.
        */
        Sound.prototype.stop = function () {
            if (this.isPlaying && this._sound) {
                if (this.usingWebAudio) {
                    if (typeof this._sound.stop === 'undefined') {
                        this._sound.noteOff(0);
                    } else {
                        this._sound.stop(0);
                    }
                } else if (this.usingAudioTag) {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }

            this.isPlaying = false;

            var prevMarker = this.currentMarker;

            this.currentMarker = '';

            this.onStop.dispatch(this, prevMarker);
        };

        Object.defineProperty(Sound.prototype, "mute", {
            get: /**
            * Mute sounds.
            */
            function () {
                return this._muted;
            },
            set: function (value) {
                if (value) {
                    this._muted = true;

                    if (this.usingWebAudio) {
                        this._muteVolume = this.gainNode.gain.value;
                        this.gainNode.gain.value = 0;
                    } else if (this.usingAudioTag && this._sound) {
                        this._muteVolume = this._sound.volume;
                        this._sound.volume = 0;
                    }
                } else {
                    this._muted = false;

                    if (this.usingWebAudio) {
                        this.gainNode.gain.value = this._muteVolume;
                    } else if (this.usingAudioTag && this._sound) {
                        this._sound.volume = this._muteVolume;
                    }
                }

                this.onMute.dispatch(this);
            },
            enumerable: true,
            configurable: true
        });



        Object.defineProperty(Sound.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;

                if (this.usingWebAudio) {
                    this.gainNode.gain.value = value;
                } else if (this.usingAudioTag && this._sound) {
                    this._sound.volume = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Sound;
    })();
    Phaser.Sound = Sound;
})(Phaser || (Phaser = {}));
