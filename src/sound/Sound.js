/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Sound class constructor.
*
* @class Phaser.Sound
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
* @param {string} key - Asset key for the sound.
* @param {number} [volume=1] - Default value for the volume, between 0 and 1.
* @param {boolean} [loop=false] - Whether or not the sound will loop.
*/
Phaser.Sound = function (game, key, volume, loop, connect) {

    if (volume === undefined) { volume = 1; }
    if (loop === undefined) { loop = false; }
    if (connect === undefined) { connect = game.sound.connectToMaster; }

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
    * @property {boolean} loop - Whether or not the sound or current sound marker will loop.
    */
    this.loop = loop;

    /**
    * @property {number} volume - The sound or sound marker volume. A value between 0 (silence) and 1 (full volume).
    */
    this.volume = volume;

    /**
    * @property {object} markers - The sound markers.
    */
    this.markers = {};

    /**
    * @property {AudioContext} context - Reference to the AudioContext instance.
    */
    this.context = null;

    /**
    * @property {boolean} autoplay - Boolean indicating whether the sound should start automatically.
    */
    this.autoplay = false;

    /**
    * @property {number} totalDuration - The total duration of the sound in seconds.
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
    * @property {number} duration - The duration of the current sound marker in seconds.
    */
    this.duration = 0;

    /**
    * @property {number} durationMS - The duration of the current sound marker in ms.
    */
    this.durationMS = 0;

    /**
    * @property {number} position - The position of the current sound marker.
    */
    this.position = 0;

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
    * @property {Phaser.Tween} fadeTween - The tween that fades the audio, set via Sound.fadeIn and Sound.fadeOut.
    */
    this.fadeTween = null;

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
    * @property {boolean} allowMultiple - This will allow you to have multiple instances of this Sound playing at once. This is only useful when running under Web Audio, and we recommend you implement a local pooling system to not flood the sound channels.
    * @default
    */
    this.allowMultiple = false;

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
    * @property {object} externalNode - If defined this Sound won't connect to the SoundManager master gain node, but will instead connect to externalNode.
    */
    this.externalNode = null;

    /**
    * @property {object} masterGainNode - The master gain node in a Web Audio system.
    */
    this.masterGainNode = null;

    /**
    * @property {object} gainNode - The gain node in a Web Audio system.
    */
    this.gainNode = null;

    /**
    * @property {object} _sound - Internal var.
    * @private
    */
    this._sound = null;

    if (this.usingWebAudio)
    {
        this.context = this.game.sound.context;
        this.masterGainNode = this.game.sound.masterGain;

        if (this.context.createGain === undefined)
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
    else if (this.usingAudioTag)
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
    * @property {Phaser.Signal} onMute - The onMute event is dispatched when this sound is muted.
    */
    this.onMute = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onMarkerComplete - The onMarkerComplete event is dispatched when a marker within this sound completes playback.
    */
    this.onMarkerComplete = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onFadeComplete - The onFadeComplete event is dispatched when this sound finishes fading either in or out.
    */
    this.onFadeComplete = new Phaser.Signal();

    /**
    * @property {number} _volume - The global audio volume. A value between 0 (silence) and 1 (full volume).
    * @private
    */
    this._volume = volume;

    /**
    * @property {any} _buffer - Decoded data buffer / Audio tag.
    * @private
    */
    this._buffer = null;

    /**
    * @property {boolean} _muted - Boolean indicating whether the sound is muted or not.
    * @private
    */
    this._muted = false;

    /**
    * @property {number} _tempMarker - Internal marker var.
    * @private
    */
    this._tempMarker = 0;

    /**
    * @property {number} _tempPosition - Internal marker var.
    * @private
    */
    this._tempPosition = 0;

    /**
    * @property {number} _tempVolume - Internal marker var.
    * @private
    */
    this._tempVolume = 0;

    /**
    * @property {number} _tempPause - Internal marker var.
    * @private
    */
    this._tempPause = 0;

    /**
    * @property {number} _muteVolume - Internal cache var.
    * @private
    */
    this._muteVolume = 0;

    /**
    * @property {boolean} _tempLoop - Internal cache var.
    * @private
    */
    this._tempLoop = 0;

    /**
    * @property {boolean} _paused - Was this sound paused via code or a game event?
    * @private
    */
    this._paused = false;

    /**
    * @property {boolean} _onDecodedEventDispatched - Was the onDecoded event dispatched?
    * @private
    */
    this._onDecodedEventDispatched = false;

};

Phaser.Sound.prototype = {

    /**
    * Called automatically when this sound is unlocked.
    * @method Phaser.Sound#soundHasUnlocked
    * @param {string} key - The Phaser.Cache key of the sound file to check for decoding.
    * @protected
    */
    soundHasUnlocked: function (key) {

        if (key === this.key)
        {
            this._sound = this.game.cache.getSoundData(this.key);
            this.totalDuration = this._sound.duration;
        }

    },

    /**
    * Adds a marker into the current Sound. A marker is represented by a unique key and a start time and duration.
    * This allows you to bundle multiple sounds together into a single audio file and use markers to jump between them for playback.
    *
    * @method Phaser.Sound#addMarker
    * @param {string} name - A unique name for this marker, i.e. 'explosion', 'gunshot', etc.
    * @param {number} start - The start point of this marker in the audio file, given in seconds. 2.5 = 2500ms, 0.5 = 500ms, etc.
    * @param {number} [duration=1] - The duration of the marker in seconds. 2.5 = 2500ms, 0.5 = 500ms, etc.
    * @param {number} [volume=1] - The volume the sound will play back at, between 0 (silent) and 1 (full volume).
    * @param {boolean} [loop=false] - Sets if the sound will loop or not.
    */
    addMarker: function (name, start, duration, volume, loop) {

        if (duration === undefined || duration === null) { duration = 1; }
        if (volume === undefined || volume === null) { volume = 1; }
        if (loop === undefined) { loop = false; }

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
    * Called automatically by the AudioContext when the sound stops playing.
    * Doesn't get called if the sound is set to loop or is a section of an Audio Sprite.
    * 
    * @method Phaser.Sound#onEndedHandler
    * @protected
    */
    onEndedHandler: function () {

        this._sound.onended = null;
        this.isPlaying = false;
        this.currentTime = this.durationMS;
        this.stop();

    },

    /**
    * Called automatically by Phaser.SoundManager.
    * @method Phaser.Sound#update
    * @protected
    */
    update: function () {

        if (!this.game.cache.checkSoundKey(this.key))
        {
            this.destroy();
            return;
        }

        if (this.isDecoded && !this._onDecodedEventDispatched)
        {
            this.onDecoded.dispatch(this);
            this._onDecodedEventDispatched = true;
        }

        if (this.pendingPlayback && this.game.cache.isSoundReady(this.key))
        {
            this.pendingPlayback = false;
            this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
        }

        if (this.isPlaying)
        {
            this.currentTime = this.game.time.time - this.startTime;

            if (this.currentTime >= this.durationMS)
            {
                if (this.usingWebAudio)
                {
                    if (this.loop)
                    {
                        //  won't work with markers, needs to reset the position
                        this.onLoop.dispatch(this);

                        //  Gets reset by the play function
                        this.isPlaying = false;

                        if (this.currentMarker === '')
                        {
                            this.currentTime = 0;
                            this.startTime = this.game.time.time;
                            this.isPlaying = true; // play not called again in this case
                        }
                        else
                        {
                            this.onMarkerComplete.dispatch(this.currentMarker, this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        }
                    }
                    else
                    {
                        //  Stop if we're using an audio marker, otherwise we let onended handle it
                        if (this.currentMarker !== '')
                        {
                            this.stop();
                        }
                    }
                }
                else
                {
                    if (this.loop)
                    {
                        this.onLoop.dispatch(this);

                        if (this.currentMarker === '')
                        {
                            this.currentTime = 0;
                            this.startTime = this.game.time.time;
                        }

                        //  Gets reset by the play function
                        this.isPlaying = false;

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
     * Loops this entire sound. If you need to loop a section of it then use Sound.play and the marker and loop parameters.
     *
     * @method Phaser.Sound#loopFull
     * @param {number} [volume=1] - Volume of the sound you want to play. If none is given it will use the volume given to the Sound when it was created (which defaults to 1 if none was specified).
     * @return {Phaser.Sound} This sound instance.
     */
    loopFull: function (volume) {

        this.play(null, 0, volume, true);

    },

    /**
    * Play this sound, or a marked section of it.
    * 
    * @method Phaser.Sound#play
    * @param {string} [marker=''] - If you want to play a marker then give the key here, otherwise leave blank to play the full sound.
    * @param {number} [position=0] - The starting position to play the sound from - this is ignored if you provide a marker.
    * @param {number} [volume=1] - Volume of the sound you want to play. If none is given it will use the volume given to the Sound when it was created (which defaults to 1 if none was specified).
    * @param {boolean} [loop=false] - Loop when finished playing? If not using a marker / audio sprite the looping will be done via the WebAudio loop property, otherwise it's time based.
    * @param {boolean} [forceRestart=true] - If the sound is already playing you can set forceRestart to restart it from the beginning.
    * @return {Phaser.Sound} This sound instance.
    */
    play: function (marker, position, volume, loop, forceRestart) {

        if (marker === undefined || marker === false || marker === null) { marker = ''; }
        if (forceRestart === undefined) { forceRestart = true; }

        if (this.isPlaying && !this.allowMultiple && !forceRestart && !this.override)
        {
            //  Use Restart instead
            return this;
        }

        if (this._sound && this.isPlaying && !this.allowMultiple && (this.override || forceRestart))
        {
            if (this.usingWebAudio)
            {
                if (this._sound.stop === undefined)
                {
                    this._sound.noteOff(0);
                }
                else
                {
                    try {
                        this._sound.stop(0);
                    }
                    catch (e) {
                    }
                }

                if (this.externalNode)
                {
                    this._sound.disconnect(this.externalNode);
                }
                else
                {
                    this._sound.disconnect(this.gainNode);
                }
            }
            else if (this.usingAudioTag)
            {
                this._sound.pause();
                this._sound.currentTime = 0;
            }
        }

        if (marker === '' && Object.keys(this.markers).length > 0)
        {
            //  If they didn't specify a marker but this is an audio sprite, 
            //  we should never play the entire thing
            return this;
        }

        if (marker !== '')
        {
            this.currentMarker = marker;

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
                // console.warn("Phaser.Sound.play: audio marker " + marker + " doesn't exist");
                return this;
            }
        }
        else
        {
            position = position || 0;

            if (volume === undefined) { volume = this._volume; }
            if (loop === undefined) { loop = this.loop; }

            this.position = Math.max(0, position);
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
                this._sound = this.context.createBufferSource();

                if (this.externalNode)
                {
                    this._sound.connect(this.externalNode);
                }
                else
                {
                    this._sound.connect(this.gainNode);
                }

                this._buffer = this.game.cache.getSoundData(this.key);
                this._sound.buffer = this._buffer;

                if (this.loop && marker === '')
                {
                    this._sound.loop = true;
                }

                if (!this.loop && marker === '')
                {
                    this._sound.onended = this.onEndedHandler.bind(this);
                }

                this.totalDuration = this._sound.buffer.duration;

                if (this.duration === 0)
                {
                    this.duration = this.totalDuration;
                    this.durationMS = Math.ceil(this.totalDuration * 1000);
                }

                //  Useful to cache this somewhere perhaps?
                if (this._sound.start === undefined)
                {
                    this._sound.noteGrainOn(0, this.position, this.duration);
                }
                else
                {
                    if (this.loop && marker === '')
                    {
                        this._sound.start(0, 0);
                    }
                    else
                    {
                        this._sound.start(0, this.position, this.duration);
                    }
                }

                this.isPlaying = true;
                this.startTime = this.game.time.time;
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
            if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked)
            {
                this.game.cache.reloadSound(this.key);
                this.pendingPlayback = true;
            }
            else
            {
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

                    this._sound.currentTime = this.position;
                    this._sound.muted = this._muted;

                    if (this._muted || this.game.sound.mute)
                    {
                        this._sound.volume = 0;
                    }
                    else
                    {
                        this._sound.volume = this._volume;
                    }

                    this.isPlaying = true;
                    this.startTime = this.game.time.time;
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

        return this;

    },

    /**
    * Restart the sound, or a marked section of it.
    *
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
        if (loop === undefined) { loop = false; }

        this.play(marker, position, volume, loop, true);

    },

    /**
    * Pauses the sound.
    *
    * @method Phaser.Sound#pause
    */
    pause: function () {

        if (this.isPlaying && this._sound)
        {
            this.paused = true;
            this.pausedPosition = this.currentTime;
            this.pausedTime = this.game.time.time;
            this._tempPause = this._sound.currentTime;
            this.onPause.dispatch(this);
            this.stop();
        }

    },

    /**
    * Resumes the sound.
    *
    * @method Phaser.Sound#resume
    */
    resume: function () {

        if (this.paused && this._sound)
        {
            if (this.usingWebAudio)
            {
                var p = Math.max(0, this.position + (this.pausedPosition / 1000));

                this._sound = this.context.createBufferSource();
                this._sound.buffer = this._buffer;

                if (this.externalNode)
                {
                    this._sound.connect(this.externalNode);
                }
                else
                {
                    this._sound.connect(this.gainNode);
                }

                if (this.loop)
                {
                    this._sound.loop = true;
                }

                if (!this.loop && this.currentMarker === '')
                {
                    this._sound.onended = this.onEndedHandler.bind(this);
                }

                var duration = this.duration - (this.pausedPosition / 1000);

                if (this._sound.start === undefined)
                {
                    this._sound.noteGrainOn(0, p, duration);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                }
                else
                {
                    if (this.loop && this.game.device.chrome)
                    {
                        //  Handle chrome bug: https://code.google.com/p/chromium/issues/detail?id=457099
                        if (this.game.device.chromeVersion === 42)
                        {
                            this._sound.start(0);
                        }
                        else
                        {
                            this._sound.start(0, p);
                        }
                    }
                    else
                    {
                        this._sound.start(0, p, duration);
                    }
                }
            }
            else
            {
                this._sound.currentTime = this._tempPause;
                this._sound.play();
            }

            this.isPlaying = true;
            this.paused = false;
            this.startTime += (this.game.time.time - this.pausedTime);
            this.onResume.dispatch(this);
        }

    },

    /**
    * Stop playing this sound.
    *
    * @method Phaser.Sound#stop
    */
    stop: function () {

        if (this.isPlaying && this._sound)
        {
            if (this.usingWebAudio)
            {
                if (this._sound.stop === undefined)
                {
                    this._sound.noteOff(0);
                }
                else
                {
                    try {
                        this._sound.stop(0);
                    }
                    catch (e)
                    {
                        //  Thanks Android 4.4
                    }
                }

                if (this.externalNode)
                {
                    this._sound.disconnect(this.externalNode);
                }
                else
                {
                    this._sound.disconnect(this.gainNode);
                }
            }
            else if (this.usingAudioTag)
            {
                this._sound.pause();
                this._sound.currentTime = 0;
            }
        }

        this.pendingPlayback = false;
        this.isPlaying = false;

        if (!this.paused)
        {
            var prevMarker = this.currentMarker;

            if (this.currentMarker !== '')
            {
                this.onMarkerComplete.dispatch(this.currentMarker, this);
            }

            this.currentMarker = '';

            if (this.fadeTween !== null)
            {
                this.fadeTween.stop();
            }

            this.onStop.dispatch(this, prevMarker);
        }

    },

    /**
    * Starts this sound playing (or restarts it if already doing so) and sets the volume to zero.
    * Then increases the volume from 0 to 1 over the duration specified.
    *
    * At the end of the fade Sound.onFadeComplete is dispatched with this Sound object as the first parameter,
    * and the final volume (1) as the second parameter.
    *
    * @method Phaser.Sound#fadeIn
    * @param {number} [duration=1000] - The time in milliseconds over which the Sound should fade in.
    * @param {boolean} [loop=false] - Should the Sound be set to loop? Note that this doesn't cause the fade to repeat.
    * @param {string} [marker=(current marker)] - The marker to start at; defaults to the current (last played) marker. To start playing from the beginning specify specify a marker of `''`.
    */
    fadeIn: function (duration, loop, marker) {

        if (loop === undefined) { loop = false; }
        if (marker === undefined) { marker = this.currentMarker; }

        if (this.paused)
        {
            return;
        }

        this.play(marker, 0, 0, loop);

        this.fadeTo(duration, 1);

    },
    
    /**
    * Decreases the volume of this Sound from its current value to 0 over the duration specified.
    * At the end of the fade Sound.onFadeComplete is dispatched with this Sound object as the first parameter,
    * and the final volume (0) as the second parameter.
    *
    * @method Phaser.Sound#fadeOut
    * @param {number} [duration=1000] - The time in milliseconds over which the Sound should fade out.
    */
    fadeOut: function (duration) {

        this.fadeTo(duration, 0);

    },

    /**
    * Fades the volume of this Sound from its current value to the given volume over the duration specified.
    * At the end of the fade Sound.onFadeComplete is dispatched with this Sound object as the first parameter, 
    * and the final volume (volume) as the second parameter.
    *
    * @method Phaser.Sound#fadeTo
    * @param {number} [duration=1000] - The time in milliseconds during which the Sound should fade out.
    * @param {number} [volume] - The volume which the Sound should fade to. This is a value between 0 and 1.
    */
    fadeTo: function (duration, volume) {

        if (!this.isPlaying || this.paused || volume === this.volume)
        {
            return;
        }

        if (duration === undefined) { duration = 1000; }

        if (volume === undefined)
        {
            console.warn("Phaser.Sound.fadeTo: No Volume Specified.");
            return;
        }

        this.fadeTween = this.game.add.tween(this).to( { volume: volume }, duration, Phaser.Easing.Linear.None, true);

        this.fadeTween.onComplete.add(this.fadeComplete, this);

    },

    /**
    * Internal handler for Sound.fadeIn, Sound.fadeOut and Sound.fadeTo.
    *
    * @method Phaser.Sound#fadeComplete
    * @private
    */
    fadeComplete: function () {

        this.onFadeComplete.dispatch(this, this.volume);

        if (this.volume === 0)
        {
            this.stop();
        }

    },

    /**
    * Called automatically by SoundManager.volume.
    *
    * Sets the volume of AudioTag Sounds as a percentage of the Global Volume.
    *
    * You should not normally call this directly.
    *
    * @method Phaser.Sound#updateGlobalVolume
    * @protected
    * @param {float} globalVolume - The global SoundManager volume.
    */
    updateGlobalVolume: function (globalVolume) {

        //  this._volume is the % of the global volume this sound should be played at

        if (this.usingAudioTag && this._sound)
        {
            this._sound.volume = globalVolume * this._volume;
        }

    },

    /**
    * Destroys this sound and all associated events and removes it from the SoundManager.
    *
    * @method Phaser.Sound#destroy
    * @param {boolean} [remove=true] - If true this Sound is automatically removed from the SoundManager.
    */
    destroy: function (remove) {

        if (remove === undefined) { remove = true; }

        this.stop();

        if (remove)
        {
            this.game.sound.remove(this);
        }
        else
        {
            this.markers = {};
            this.context = null;
            this._buffer = null;
            this.externalNode = null;

            this.onDecoded.dispose();
            this.onPlay.dispose();
            this.onPause.dispose();
            this.onResume.dispose();
            this.onLoop.dispose();
            this.onStop.dispose();
            this.onMute.dispose();
            this.onMarkerComplete.dispose();
        }

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

        return (this._muted || this.game.sound.mute);

    },

    set: function (value) {

        value = value || false;

        if (value === this._muted)
        {
            return;
        }

        if (value)
        {
            this._muted = true;
            this._muteVolume = this._tempVolume;

            if (this.usingWebAudio)
            {
                this.gainNode.gain.value = 0;
            }
            else if (this.usingAudioTag && this._sound)
            {
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

        //  Causes an Index size error in Firefox if you don't clamp the value
        if (this.game.device.firefox && this.usingAudioTag)
        {
            value = this.game.math.clamp(value, 0, 1);
        }

        if (this._muted)
        {
            this._muteVolume = value;
            return;
        }

        this._tempVolume = value;
        this._volume = value;

        if (this.usingWebAudio)
        {
            this.gainNode.gain.value = value;
        }
        else if (this.usingAudioTag && this._sound)
        {
            this._sound.volume = value;
        }
    }

});
