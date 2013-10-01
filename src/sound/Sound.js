
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Sound
*/

/**
* The Sound class constructor.
*
* @class Phaser.Sound
* @classdesc The Sound class
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
* @param {string} key - Asset key for the sound.
* @param {number} volume - Default value for the volume.
* @param {bool} loop - Whether or not the sound will loop.
*/
Phaser.Sound = function (game, key, volume, loop) {
	
	volume = volume || 1;
	if (typeof loop == 'undefined') { loop = false; }

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    */
    this.game = game;

    /**
    * Name of the sound.
    * @property {string} name
    * @default
    */
    this.name = key;

    /**
    * Asset key for the sound.
    * @property {string} key
    */
    this.key = key;

    /**
    * Whether or not the sound will loop.
    * @property {bool} loop
    */
    this.loop = loop;

    /**
    * The global audio volume. A value between 0 (silence) and 1 (full volume).
    * @property {number} _volume
    * @private
    */
    this._volume = volume;

    /**
    * The sound markers, empty by default.
    * @property {object} markers
    */
    this.markers = {};

    
    /**
    * Reference to AudioContext instance.
    * @property {AudioContext} context
    * @default
    */
    this.context = null;

    /**
    * Decoded data buffer / Audio tag.
    * @property {Description} _buffer
    * @private
    */
    this._buffer = null;

    /**
    * Boolean indicating whether the game is on "mute". 
    * @property {bool} _muted
    * @private
    * @default
    */
    this._muted = false;

    /**
    * Boolean indicating whether the sound should start automatically.
    * @property {bool} autoplay
    * @private
    */
    this.autoplay = false;

    /**
    * The total duration of the sound, in milliseconds
    * @property {number} totalDuration
    * @default
    */
    this.totalDuration = 0;
   
    /**
    * Description.
    * @property {number} startTime
    * @default
    */
    this.startTime = 0;
    
    /**
    * Description.
    * @property {number} currentTime
    * @default
    */
    this.currentTime = 0;
    
    /**
    * Description.
    * @property {number} duration
    * @default
    */
    this.duration = 0;
    
    /**
    * Description.
    * @property {number} autoplay
    * @default
    */
    this.stopTime = 0;
    
    /**
    * Description.
    * @property {bool} paused
    * @default
    */
    this.paused = false;
    
    /**
    * Description.
    * @property {bool} isPlaying
    * @default
    */
    this.isPlaying = false;
    
    /**
    * Description.
    * @property {string} currentMarker
    * @default
    */
    this.currentMarker = '';
    
    /**
    * Description.
    * @property {bool} pendingPlayback
    * @default
    */
    this.pendingPlayback = false;
    
    /**
    * Description.
    * @property {bool} override
    * @default
    */
    this.override = false;
    
    /**
    * Description.
    * @property {bool} usingWebAudio
    */
    this.usingWebAudio = this.game.sound.usingWebAudio;
    
    /**
    * Description.
    * @property {Description} usingAudioTag
    */
    this.usingAudioTag = this.game.sound.usingAudioTag;

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
        this.gainNode.connect(this.masterGainNode);
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
    * Description.
    * @property {Phaser.Signal} onDecoded
    */
    this.onDecoded = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onPlay
    */
    this.onPlay = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onPause
    */
    this.onPause = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onResume
    */
    this.onResume = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onLoop
    */
    this.onLoop = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onStop
    */
    this.onStop = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onMute
    */
    this.onMute = new Phaser.Signal;
    
    /**
    * Description.
    * @property {Phaser.Signal} onMarkerComplete
    */
    this.onMarkerComplete = new Phaser.Signal;

};

Phaser.Sound.prototype = {

	/**
	 * @method soundHasUnlocked
	 * @param {string} key - Description.
	 */
    soundHasUnlocked: function (key) {

        if (key == this.key)
        {
            this._sound = this.game.cache.getSoundData(this.key);
            this.totalDuration = this._sound.duration;
            console.log('sound has unlocked' + this._sound);
	    }

	},

	/**
	 * Description.
	 * @method addMarker
	 * @param {string} name - Description.
	 * @param {Description} start - Description.
	 * @param {Description} stop - Description.
	 * @param {Description} volume - Description.
	 * @param {Description} loop - Description.
	 */
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

    //  start and stop are in SECONDS.MS (2.5 = 2500ms, 0.5 = 500ms, etc)
    //  volume is between 0 and 1
    addMarker: function (name, start, duration, volume, loop) {

        volume = volume || 1;
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
	 * Description.
	 * @method removeMarker
	 * @param {string} name - Description.
	 */
    removeMarker: function (name) {

        delete this.markers[name];

    },

	/**
	 * Description.
	 * @method update
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
                //console.log(this.currentMarker, 'has hit duration');
                if (this.usingWebAudio)
                {
                    if (this.loop)
                    {
                        //console.log('loop1');
                        //  won't work with markers, needs to reset the position
                        this.onLoop.dispatch(this);

                        if (this.currentMarker == '')
                        {
                            //console.log('loop2');
                            this.currentTime = 0;
                            this.startTime = this.game.time.now;
                        }
                        else
                        {
                            //console.log('loop3');
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        }
                    }
                    else
                    {
                        //console.log('stopping, no loop for marker');
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
    * @method play
    * @param {string} marker - Assets key of the sound you want to play.
    * @param {number} position - The starting position.
    * @param {number} [volume] - Volume of the sound you want to play.
    * @param {bool} [loop] - Loop when it finished playing? (Default to false)
    * @param {Description} forceRestart - Description.
    * @return {Sound} The playing sound object.
    */
    play: function (marker, position, volume, loop, forceRestart) {

    	marker = marker || '';
    	position = position || 0;
    	volume = volume || 1;
    	if (typeof loop == 'undefined') { loop = false; }
    	if (typeof forceRestart == 'undefined') { forceRestart = true; }

        // console.log(this.name + ' play ' + marker + ' position ' + position + ' volume ' + volume + ' loop ' + loop, 'force', forceRestart);

        if (this.isPlaying == true && forceRestart == false && this.override == false)
        {
            //  Use Restart instead
            return;
        }

        if (this.isPlaying && this.override)
        {
            // console.log('asked to play ' + marker + ' but already playing ' + this.currentMarker);
        
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
                this.position = this.markers[marker].start;
                this.volume = this.markers[marker].volume;
                this.loop = this.markers[marker].loop;
                this.duration = this.markers[marker].duration;
                this.durationMS = this.markers[marker].durationMS;

                // console.log('Marker Loaded: ', marker, 'start:', this.position, 'end: ', this.duration, 'loop', this.loop);

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
            // console.log('no marker info loaded', marker);

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
                this._sound.connect(this.gainNode);
                this.totalDuration = this._sound.buffer.duration;

                if (this.duration == 0)
                {
                    // console.log('duration reset');
                    this.duration = this.totalDuration;
                    this.durationMS = this.totalDuration * 1000;
                }

                if (this.loop && marker == '')
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

                if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding == false)
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
                if (this._sound && this._sound.readyState == 4)
                {
                    this._sound.play();
                    //  This doesn't become available until you call play(), wonderful ...
                    this.totalDuration = this._sound.duration;

                    if (this.duration == 0)
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
    * @method restart
    * @param {string} marker - Assets key of the sound you want to play.
    * @param {number} position - The starting position.
    * @param {number} [volume] - Volume of the sound you want to play.
    * @param {bool} [loop] - Loop when it finished playing? (Default to false)
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
    * @method pause
    */
    pause: function () {

        if (this.isPlaying && this._sound)
        {
            this.stop();
            this.isPlaying = false;
            this.paused = true;
            this.onPause.dispatch(this);
        }

    },
    /**
    * Resumes the sound
    * @method resume
    */
    resume: function () {

        if (this.paused && this._sound)
        {
            if (this.usingWebAudio)
            {
                if (typeof this._sound.start === 'undefined')
                {
                    this._sound.noteGrainOn(0, this.position, this.duration);
                    //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
				}
				else
				{
                    this._sound.start(0, this.position, this.duration);
                }
            }
            else
            {
                this._sound.play();
            }

            this.isPlaying = true;
            this.paused = false;
            this.onResume.dispatch(this);
        }

    },

	/**
    * Stop playing this sound.
    * @method stop
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
        
        this.currentMarker = '';
        this.onStop.dispatch(this, prevMarker);

    }

};

/**
* Get
* @return {bool} Description.
*/
Object.defineProperty(Phaser.Sound.prototype, "isDecoding", {

    get: function () {
        return this.game.cache.getSound(this.key).isDecoding;
    }

});

/**
* Get
* @return {bool} Description.
*/
Object.defineProperty(Phaser.Sound.prototype, "isDecoded", {

    get: function () {
        return this.game.cache.isSoundDecoded(this.key);
    }

});

/**
* Get
* @return {bool} Whether or not the sound is muted.
*//**
* Mutes sound.
* @param {bool} value - Whether or not the sound is muted.
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
* Get the current volume. A value between 0 (silence) and 1 (full volume).
* @return {number}
*//**
* Set
* @param {number} value - Sets the current volume. A value between 0 (silence) and 1 (full volume).
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
