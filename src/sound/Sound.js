/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Sound class constructor.
*
* @class Phaser.Sound
* @classdesc The Sound class
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
* @param {string} key - Asset key for the sound.
* @param {number} [volume=1] - Default value for the volume, between 0 and 1.
* @param {boolean} [loop=false] - Whether or not the sound will loop.
*/
Phaser.Sound = function (game, key, volume, loop, connect) {

    if (typeof volume == 'undefined') { volume = 1; }
    if (typeof loop == 'undefined') { loop = false; }
    if (typeof connect === 'undefined') { connect = game.sound.connectToMaster; }

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    */
    this.game = game;

    /**
    * @property {string} name - Name of the sound.
    */
    this.name = key;

    /**
    * @property {string} key - Asset key for the sound.
    */
    this.key = key;

    /**
    * @property {boolean} loop - Whether or not the sound will loop.
    */
    this.loop = loop;

    /**
    * @property {number} _volume - The global audio volume. A value between 0 (silence) and 1 (full volume).
    * @private
    */
    this._volume = volume;

    /**
    * @property {object} markers - The sound markers.
    */
    this.markers = {};

    /**
    * @property {AudioContext} context - Reference to the AudioContext instance.
    */
    this.context = null;

    /**
    * @property {Description} _buffer - Decoded data buffer / Audio tag.
    * @private
    */
    this._buffer = null;

    /**
    * @property {boolean} _muted - Boolean indicating whether the sound is muted or not.
    * @private
    * @default
    */
    this._muted = false;

    /**
    * @property {boolean} autoplay - Boolean indicating whether the sound should start automatically.
    */
    this.autoplay = false;

    /**
    * @property {number} totalDuration - The total duration of the sound, in milliseconds
    */
    this.totalDuration = 0;

    /**
    * @property {number} startTime - The time the Sound starts at (typically 0 unless starting from a marker)
    * @default
    */
    this.startTime = 0;

    /**
    * @property {number} currentTime - The current time the sound is at.
    */
    this.currentTime = 0;

    /**
    * @property {number} duration - The duration of the sound.
    */
    this.duration = 0;

    /**
    * @property {number} stopTime - The time the sound stopped.
    */
    this.stopTime = 0;

    /**
    * @property {boolean} paused - true if the sound is paused, otherwise false.
    * @default
    */
    this.paused = false;

    /**
    * @property {number} pausedPosition - The position the sound had reached when it was paused.
    */
    this.pausedPosition = 0;

    /**
    * @property {number} pausedTime - The game time at which the sound was paused.
    */
    this.pausedTime = 0;

    /**
    * @property {boolean} isPlaying - true if the sound is currently playing, otherwise false.
    * @default
    */
    this.isPlaying = false;

    /**
    * @property {string} currentMarker - The string ID of the currently playing marker, if any.
    * @default
    */
    this.currentMarker = '';

    /**
    * @property {boolean} pendingPlayback - true if the sound file is pending playback
    * @readonly
    */
    this.pendingPlayback = false;

    /**
    * @property {boolean} override - if true when you play this sound it will always start from the beginning.
    * @default
    */
    this.override = false;

    /**
    * @property {boolean} usingWebAudio - true if this sound is being played with Web Audio.
    * @readonly
    */
    this.usingWebAudio = this.game.sound.usingWebAudio;

    /**
    * @property {boolean} usingAudioTag - true if the sound is being played via the Audio tag.
    */
    this.usingAudioTag = this.game.sound.usingAudioTag;

    /**
    * @property {object} externalNode - If defined this Sound won't connect to the SoundManager master gain node, but will instead connect to externalNode.input.
    */
    this.externalNode = null;

    if (this.usingWebAudio)
    {
        this.context = this.game.sound.context;
        this.masterGainNode = this.game.sound.masterGain;

        if (typeof this.context.createGain === 'undefined')
        {
            this.gainNode = this.context.createGainNode();
        }
        else
        {
            this.gainNode = this.context.createGain();
        }

        this.gainNode.gain.value = volume * this.game.sound.volume;

        if (connect)
        {
            this.gainNode.connect(this.masterGainNode);
        }
    }
    else
    {
        if (this.game.cache.getSound(key) && this.game.cache.isSoundReady(key))
        {
            this._sound = this.game.cache.getSoundData(key);
            this.totalDuration = 0;

            if (this._sound.duration)
            {
                this.totalDuration = this._sound.duration;
            }
        }
        else
        {
            this.game.cache.onSoundUnlock.add(this.soundHasUnlocked, this);
        }
    }

    /**
    * @property {Phaser.Signal} onDecoded - The onDecoded event is dispatched when the sound has finished decoding (typically for mp3 files)
    */
    this.onDecoded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onPlay - The onPlay event is dispatched each time this sound is played.
    */
    this.onPlay = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onPause - The onPause event is dispatched when this sound is paused.
    */
    this.onPause = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onResume - The onResume event is dispatched when this sound is resumed from a paused state.
    */
    this.onResume = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onLoop - The onLoop event is dispatched when this sound loops during playback.
    */
    this.onLoop = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onStop - The onStop event is dispatched when this sound stops playback.
    */
    this.onStop = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onMute - The onMouse event is dispatched when this sound is muted.
    */
    this.onMute = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onMarkerComplete - The onMarkerComplete event is dispatched when a marker within this sound completes playback.
    */
    this.onMarkerComplete = new Phaser.Signal();

};

Phaser.Sound.prototype = {

    /**
    * Called automatically when this sound is unlocked.
    * @method Phaser.Sound#soundHasUnlocked
    * @param {string} key - The Phaser.Cache key of the sound file to check for decoding.
    * @protected
    */
    soundHasUnlocked: function (key) {

        if (key == this.key)
        {
            this._sound = this.game.cache.getSoundData(this.key);
            this.totalDuration = this._sound.duration;
            // console.log('sound has unlocked' + this._sound);
        }

    },

    /**
     * Description.
     * @method Phaser.Sound#addMarker
     * @param {string} name - Description.
     * @param {Description} start - Description.
     * @param {Description} stop - Description.
     * @param {Description} volume - Description.
     * @param {Description} loop - Description.
    addMarker: function (name, start, stop, volume, loop) {

        volume = volume || 1;
        if (typeof loop == 'undefined') { loop = false; }

        this.markers[name] = {
            name: name,
            start: start,
            stop: stop,
            volume: volume,
            duration: stop - start,
            loop: loop
        };

    },
    */

    /**
    * Adds a marker into the current Sound. A marker is represented by a unique key and a start time and duration.
    * This allows you to bundle multiple sounds together into a single audio file and use markers to jump between them for playback.
    *
    * @method Phaser.Sound#addMarker
    * @param {string} name - A unique name for this marker, i.e. 'explosion', 'gunshot', etc.
    * @param {number} start - The start point of this marker in the audio file, given in seconds. 2.5 = 2500ms, 0.5 = 500ms, etc.
    * @param {number} duration - The duration of the marker in seconds. 2.5 = 2500ms, 0.5 = 500ms, etc.
    * @param {number} [volume=1] - The volume the sound will play back at, between 0 (silent) and 1 (full volume).
    * @param {boolean} [loop=false] - Sets if the sound will loop or not.
    */
    addMarker: function (name, start, duration, volume, loop) {

        if (typeof volume == 'undefined') { volume = 1; }
        if (typeof loop == 'undefined') { loop = false; }

        this.markers[name] = {
            name: name,
            start: start,
            stop: start + duration,
            volume: volume,
            duration: duration,
            durationMS: duration * 1000,
            loop: loop
        };

    },

    /**
    * Removes a marker from the sound.
    * @method Phaser.Sound#removeMarker
    * @param {string} name - The key of the marker to remove.
    */
    removeMarker: function (name) {

        delete this.markers[name];

    },

    /**
    * Called automatically by Phaser.SoundManager.
    * @method Phaser.Sound#update
    * @protected
    */
    update: function () {

        if (this.pendingPlayback && this.game.cache.isSoundReady(this.key))
        {
            this.pendingPlayback = false;
            this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
        }

        if (this.isPlaying)
        {
            this.currentTime = this.game.time.now - this.startTime;

            if (this.currentTime >= this.durationMS)
            {
                // console.log(this.currentMarker, 'has hit duration');
                if (this.usingWebAudio)
                {
                    if (this.loop)
                    {
                        // console.log('loop1');
                        //  won't work with markers, needs to reset the position
                        this.onLoop.dispatch(this);

                        if (this.currentMarker === '')
                        {
                            // console.log('loop2');
                            this.currentTime = 0;
                            this.startTime = this.game.time.now;
                        }
                        else
                        {
                            // console.log('loop3');
                            this.onMarkerComplete.dispatch(this.currentMarker, this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        }
                    }
                    else
                    {
                        // console.log('stopping, no loop for marker');
                        this.stop();
                    }
                }
                else
                {
                    if (this.loop)
                    {
                        this.onLoop.dispatch(this);
                        this.play(this.currentMarker, 0, this.volume, true, true);
                    }
                    else
                    {
                        this.stop();
                    }
                }
            }
        }
    },

    /**
    * Play this sound, or a marked section of it.
    * @method Phaser.Sound#play
    * @param {string} [marker=''] - If you want to play a marker then give the key here, otherwise leave blank to play the full sound.
    * @param {number} [position=0] - The starting position to play the sound from - this is ignored if you provide a marker.
    * @param {number} [volume=1] - Volume of the sound you want to play. If none is given it will use the volume given to the Sound when it was created (which defaults to 1 if none was specified).
    * @param {boolean} [loop=false] - Loop when it finished playing?
    * @param {boolean} [forceRestart=true] - If the sound is already playing you can set forceRestart to restart it from the beginning.
    * @return {Phaser.Sound} This sound instance.
    */
    play: function (marker, position, volume, loop, forceRestart) {

        if (typeof marker === 'undefined') { marker = ''; }
        if (typeof forceRestart === 'undefined') { forceRestart = true; }

        if (this.isPlaying === true && forceRestart === false && this.override === false)
        {
            //  Use Restart instead
            return;
        }

        if (this.isPlaying && this.override)
        {
            if (this.usingWebAudio)
            {
                if (typeof this._sound.stop === 'undefined')
                {
                    this._sound.noteOff(0);
                }
                else
                {
                    this._sound.stop(0);
                }
            }
            else if (this.usingAudioTag)
            {
                this._sound.pause();
                this._sound.currentTime = 0;
            }
        }

        this.currentMarker = marker;

        if (marker !== '')
        {
            if (this.markers[marker])
            {
                //  Playing a marker? Then we default to the marker values
                this.position = this.markers[marker].start;
                this.volume = this.markers[marker].volume;
                this.loop = this.markers[marker].loop;
                this.duration = this.markers[marker].duration;
                this.durationMS = this.markers[marker].durationMS;

                if (typeof volume !== 'undefined')
                {
                    this.volume = volume;
                }

                if (typeof loop !== 'undefined')
                {
                    this.loop = loop;
                }

                this._tempMarker = marker;
                this._tempPosition = this.position;
                this._tempVolume = this.volume;
                this._tempLoop = this.loop;
            }
            else
            {
                console.warn("Phaser.Sound.play: audio marker " + marker + " doesn't exist");
                return;
            }
        }
        else
        {
            position = position || 0;

            if (typeof volume === 'undefined') { volume = this._volume; }
            if (typeof loop === 'undefined') { loop = this.loop; }

            this.position = position;
            this.volume = volume;
            this.loop = loop;
            this.duration = 0;
            this.durationMS = 0;

            this._tempMarker = marker;
            this._tempPosition = position;
            this._tempVolume = volume;
            this._tempLoop = loop;
        }

        if (this.usingWebAudio)
        {
            //  Does the sound need decoding?
            if (this.game.cache.isSoundDecoded(this.key))
            {
                //  Do we need to do this every time we play? How about just if the buffer is empty?
                if (this._buffer == null)
                {
                    this._buffer = this.game.cache.getSoundData(this.key);
                }

                this._sound = this.context.createBufferSource();
                this._sound.buffer = this._buffer;

                if (this.externalNode)
                {
                    this._sound.connect(this.externalNode.input);
                }
                else
                {
                    this._sound.connect(this.gainNode);
                }

                this.totalDuration = this._sound.buffer.duration;

                if (this.duration === 0)
                {
                    // console.log('duration reset');
                    this.duration = this.totalDuration;
                    this.durationMS = this.totalDuration * 1000;
                }

                if (this.loop && marker === '')
                {
                    this._sound.loop = true;
                }

                //  Useful to cache this somewhere perhaps?
                if (typeof this._sound.start === 'undefined')
                {
                    this._sound.noteGrainOn(0, this.position, this.duration);
                    // this._sound.noteGrainOn(0, this.position, this.duration / 1000);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                }
                else
                {
                    // this._sound.start(0, this.position, this.duration / 1000);
                    this._sound.start(0, this.position, this.duration);
                }

                this.isPlaying = true;
                this.startTime = this.game.time.now;
                this.currentTime = 0;
                this.stopTime = this.startTime + this.durationMS;
                this.onPlay.dispatch(this);
            }
            else
            {
                this.pendingPlayback = true;

                if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding === false)
                {
                    this.game.sound.decode(this.key, this);
                }
            }
        }
        else
        {
            // console.log('Sound play Audio');
            if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked)
            {
                // console.log('tried playing locked sound, pending set, reload started');
                this.game.cache.reloadSound(this.key);
                this.pendingPlayback = true;
            }
            else
            {
                // console.log('sound not locked, state?', this._sound.readyState);
                if (this._sound && (this.game.device.cocoonJS || this._sound.readyState === 4))
                {
                    this._sound.play();
                    //  This doesn't become available until you call play(), wonderful ...
                    this.totalDuration = this._sound.duration;

                    if (this.duration === 0)
                    {
                        this.duration = this.totalDuration;
                        this.durationMS = this.totalDuration * 1000;
                    }

                    // console.log('playing', this._sound);
                    this._sound.currentTime = this.position;
                    this._sound.muted = this._muted;

                    if (this._muted)
                    {
                        this._sound.volume = 0;
                    }
                    else
                    {
                        this._sound.volume = this._volume;
                    }

                    this.isPlaying = true;
                    this.startTime = this.game.time.now;
                    this.currentTime = 0;
                    this.stopTime = this.startTime + this.durationMS;
                    this.onPlay.dispatch(this);
                }
                else
                {
                    this.pendingPlayback = true;
                }
            }
        }
    },

    /**
    * Restart the sound, or a marked section of it.
    * @method Phaser.Sound#restart
    * @param {string} [marker=''] - If you want to play a marker then give the key here, otherwise leave blank to play the full sound.
    * @param {number} [position=0] - The starting position to play the sound from - this is ignored if you provide a marker.
    * @param {number} [volume=1] - Volume of the sound you want to play.
    * @param {boolean} [loop=false] - Loop when it finished playing?
    */
    restart: function (marker, position, volume, loop) {

        marker = marker || '';
        position = position || 0;
        volume = volume || 1;
        if (typeof loop == 'undefined') { loop = false; }

        this.play(marker, position, volume, loop, true);

    },

    /**
    * Pauses the sound
    * @method Phaser.Sound#pause
    */
    pause: function () {

        if (this.isPlaying && this._sound)
        {
            this.stop();
            this.isPlaying = false;
            this.paused = true;
            this.pausedPosition = this.currentTime;
            this.pausedTime = this.game.time.now;
            this.onPause.dispatch(this);
        }

    },

    /**
    * Resumes the sound
    * @method Phaser.Sound#resume
    */
    resume: function () {

        if (this.paused && this._sound)
        {
            if (this.usingWebAudio)
            {
                var p = this.position + (this.pausedPosition / 1000);

                this._sound = this.context.createBufferSource();
                this._sound.buffer = this._buffer;

                if (this.externalNode)
                {
                    this._sound.connect(this.externalNode.input);
                }
                else
                {
                    this._sound.connect(this.gainNode);
                }

                if (this.loop)
                {
                    this._sound.loop = true;
                }

                if (typeof this._sound.start === 'undefined')
                {
                    this._sound.noteGrainOn(0, p, this.duration);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                }
                else
                {
                    this._sound.start(0, p, this.duration);
                }
            }
            else
            {
                this._sound.play();
            }

            this.isPlaying = true;
            this.paused = false;
            this.startTime += (this.game.time.now - this.pausedTime);
            this.onResume.dispatch(this);
        }

    },

    /**
    * Stop playing this sound.
    * @method Phaser.Sound#stop
    */
    stop: function () {

        if (this.isPlaying && this._sound)
        {
            if (this.usingWebAudio)
            {
                if (typeof this._sound.stop === 'undefined')
                {
                    this._sound.noteOff(0);
                }
                else
                {
                    this._sound.stop(0);
                }
            }
            else if (this.usingAudioTag)
            {
                this._sound.pause();
                this._sound.currentTime = 0;
            }
        }

        this.isPlaying = false;
        var prevMarker = this.currentMarker;

        if (this.currentMarker !== '')
        {
            this.onMarkerComplete.dispatch(this.currentMarker, this);
        }

        this.currentMarker = '';
        this.onStop.dispatch(this, prevMarker);

    }

};

Phaser.Sound.prototype.constructor = Phaser.Sound;

/**
* @name Phaser.Sound#isDecoding
* @property {boolean} isDecoding - Returns true if the sound file is still decoding.
* @readonly
*/
Object.defineProperty(Phaser.Sound.prototype, "isDecoding", {

    get: function () {
        return this.game.cache.getSound(this.key).isDecoding;
    }

});

/**
* @name Phaser.Sound#isDecoded
* @property {boolean} isDecoded - Returns true if the sound file has decoded.
* @readonly
*/
Object.defineProperty(Phaser.Sound.prototype, "isDecoded", {

    get: function () {
        return this.game.cache.isSoundDecoded(this.key);
    }

});

/**
* @name Phaser.Sound#mute
* @property {boolean} mute - Gets or sets the muted state of this sound.
*/
Object.defineProperty(Phaser.Sound.prototype, "mute", {

    get: function () {
        return this._muted;
    },

    set: function (value) {

        value = value || null;

        if (value)
        {
            this._muted = true;

            if (this.usingWebAudio)
            {
                this._muteVolume = this.gainNode.gain.value;
                this.gainNode.gain.value = 0;
            }
            else if (this.usingAudioTag && this._sound)
            {
                this._muteVolume = this._sound.volume;
                this._sound.volume = 0;
            }
        }
        else
        {
            this._muted = false;

            if (this.usingWebAudio)
            {
                this.gainNode.gain.value = this._muteVolume;
            }
            else if (this.usingAudioTag && this._sound)
            {
                this._sound.volume = this._muteVolume;
            }
        }

        this.onMute.dispatch(this);

    }

});

/**
* @name Phaser.Sound#volume
* @property {number} volume - Gets or sets the volume of this sound, a value between 0 and 1.
* @readonly
*/
Object.defineProperty(Phaser.Sound.prototype, "volume", {

    get: function () {
        return this._volume;
    },

    set: function (value) {

        if (this.usingWebAudio)
        {
            this._volume = value;
            this.gainNode.gain.value = value;
        }
        else if (this.usingAudioTag && this._sound)
        {
            //  Causes an Index size error in Firefox if you don't clamp the value
            if (value >= 0 && value <= 1)
            {
                this._volume = value;
                this._sound.volume = value;
            }
        }
    }

});
