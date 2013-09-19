/**
* Phaser - SoundManager
*
* @class SoundManager
* @constructor
* @param {Phaser.Game} game reference to the current game instance.
*/
Phaser.SoundManager = function (game) {

    /**
    * A reference to the currently running Game.
    * @property game
    * @public
    * @type {Phaser.Game}
    */
	this.game = game;

	this.onSoundDecode = new Phaser.Signal;


    /**
    * Boolean indicating whether the game is on "mute" 
    * @property _muted
    * @private
    * @type {bool} 
    */
    this._muted = false;
    this._unlockSource = null;

    /**
    * The global audio volume. A value between 0 (silence) and 1 (full volume)
    * @property _volume
    * @private
    * @type {number} 
    */
    this._volume = 1;

    /**
    * An array containing all the sounds 
    * @property _sounds
    * @private
    * @type {array} 
    */
    this._sounds = [];


    this.context = null;
    this.usingWebAudio = true;
    this.usingAudioTag = false;
    this.noAudio = false;

    this.touchLocked = false;

    this.channels = 32;
	
};

Phaser.SoundManager.prototype = {

    /**
    * Initialises the sound manager
    * @method boot
    */
    boot: function () {

        if (this.game.device.iOS && this.game.device.webAudio == false)
        {
            this.channels = 1;
        }

        if (this.game.device.iOS || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock))
        {
            this.game.input.touch.callbackContext = this;
            this.game.input.touch.touchStartCallback = this.unlock;
            this.game.input.mouse.callbackContext = this;
            this.game.input.mouse.mouseDownCallback = this.unlock;
            this.touchLocked = true;
        }
        else
        {
            //  What about iOS5?
            this.touchLocked = false;
        }

        if (window['PhaserGlobal'])
        {
            //  Check to see if all audio playback is disabled (i.e. handled by a 3rd party class)
            if (window['PhaserGlobal'].disableAudio == true)
            {
                this.usingWebAudio = false;
                this.noAudio = true;
                return;
            }

            //  Check if the Web Audio API is disabled (for testing Audio Tag playback during development)
            if (window['PhaserGlobal'].disableWebAudio == true)
            {
                this.usingWebAudio = false;
                this.usingAudioTag = true;
                this.noAudio = false;
                return;
            }
        }

        if (!!window['AudioContext'])
        {
            this.context = new window['AudioContext']();
        }
        else if (!!window['webkitAudioContext'])
        {
            this.context = new window['webkitAudioContext']();
        }
        else if (!!window['Audio'])
        {
            this.usingWebAudio = false;
            this.usingAudioTag = true;
        }
        else
        {
            this.usingWebAudio = false;
            this.noAudio = true;
        }

        if (this.context !== null)
        {
            if (typeof this.context.createGain === 'undefined')
            {
                this.masterGain = this.context.createGainNode();
            }
            else
            {
                this.masterGain = this.context.createGain();
            }

            this.masterGain.gain.value = 1;
            this.masterGain.connect(this.context.destination);
        }


    },

    /**
    * Enables the audio, usually after the first touch
    * @method unlock
    */
    unlock: function () {

        if (this.touchLocked == false)
        {
            return;
        }

        //  Global override (mostly for Audio Tag testing)
        if (this.game.device.webAudio == false || (window['PhaserGlobal'] && window['PhaserGlobal'].disableWebAudio == true))
        {
            //  Create an Audio tag?
            this.touchLocked = false;
            this._unlockSource = null;
            this.game.input.touch.callbackContext = null;
            this.game.input.touch.touchStartCallback = null;
            this.game.input.mouse.callbackContext = null;
            this.game.input.mouse.mouseDownCallback = null;
        }
        else
        {
            // Create empty buffer and play it
            var buffer = this.context.createBuffer(1, 1, 22050);
            this._unlockSource = this.context.createBufferSource();
            this._unlockSource.buffer = buffer;
            this._unlockSource.connect(this.context.destination);
            this._unlockSource.noteOn(0);
        }

    },

    /**
    * Stops all the sounds in the game
    * @method stopAll
    */
    stopAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].stop();
            }
        }

    },

    /**
    * Pauses all the sounds in the game
    * @method pauseAll
    */
    pauseAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].pause();
            }
        }

    },

    /**
    * resumes every sound in the game
    * @method resumeAll
    */
    resumeAll: function () {

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].resume();
            }
        }
   
	},

	/**
    * Decode a sound with its assets key.
    * @method decode
    * @param key {string} Assets key of the sound to be decoded.
    * @param [sound] {Phaser.Sound} its bufer will be set to decoded data.
    */
    decode: function (key, sound) {

        sound = sound || null;

        var soundData = this.game.cache.getSoundData(key);

        if (soundData)
        {
            if (this.game.cache.isSoundDecoded(key) === false)
            {
                this.game.cache.updateSound(key, 'isDecoding', true);

                var that = this;

                this.context.decodeAudioData(soundData, function (buffer) {
                    that.game.cache.decodedSound(key, buffer);
                    if (sound)
                    {
                        that.onSoundDecode.dispatch(sound);
                    }
                });
            }
        }

    },

    /**
    * updates every sound in the game
    * @method update
    */
    update: function () {

        if (this.touchLocked)
        {
            if (this.game.device.webAudio && this._unlockSource !== null)
            {
                if ((this._unlockSource.playbackState === this._unlockSource.PLAYING_STATE || this._unlockSource.playbackState === this._unlockSource.FINISHED_STATE))
                {
                    this.touchLocked = false;
                    this._unlockSource = null;
                    this.game.input.touch.callbackContext = null;
                    this.game.input.touch.touchStartCallback = null;
                }
            }
        }

        for (var i = 0; i < this._sounds.length; i++)
        {
            this._sounds[i].update();
        }

    },


    /**
    * 
    * @method add
    * @param {string} key Asset key for the sound.
    * @param {number} volume Default value for the volume.
    * @param {bool} loop Whether or not the sound will loop.
    */
    add: function (key, volume, loop) {

    	volume = volume || 1;
    	if (typeof loop == 'undefined') { loop = false; }

        

        var sound = new Phaser.Sound(this.game, key, volume, loop);

        this._sounds.push(sound);

        return sound;

    }

};

Object.defineProperty(Phaser.SoundManager.prototype, "mute", {

	/**
    * A global audio mute toggle.
    * @method mute
    * @return {bool} whether or not the game is on "mute"
    */
    get: function () {

        return this._muted;

    },

    /**
    * Mute sounds.
    * @method mute
    * @return {bool} whether or not the game is on "mute"
    */
    set: function (value) {

        value = value || null;

        if (value)
        {
            if (this._muted)
            {
                return;
            }

            this._muted = true;
            
            if (this.usingWebAudio)
            {
                this._muteVolume = this.masterGain.gain.value;
                this.masterGain.gain.value = 0;
            }

            //  Loop through sounds
            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i].usingAudioTag)
                {
                    this._sounds[i].mute = true;
                }
            }
        }
        else
        {
            if (this._muted == false)
            {
                return;
            }

            this._muted = false;

            if (this.usingWebAudio)
            {
                this.masterGain.gain.value = this._muteVolume;
            }

            //  Loop through sounds
            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i].usingAudioTag)
                {
                    this._sounds[i].mute = false;
                }
            }
        }
    }

});

Object.defineProperty(Phaser.SoundManager.prototype, "volume", {
    
    /**
    * @method volume
    * @return {number} The global audio volume. A value between 0 (silence) and 1 (full volume)
    */
    get: function () {

        if (this.usingWebAudio)
        {
            return this.masterGain.gain.value;
        }
        else
        {
            return this._volume;
        }

    },

	/**
    * Sets the global volume
    * @method volume
    * @return {number} The global audio volume. A value between 0 (silence) and 1 (full volume)
    */
    set: function (value) {

        value = this.game.math.clamp(value, 1, 0);

        this._volume = value;

        if (this.usingWebAudio)
        {
            this.masterGain.gain.value = value;
        }

        //  Loop through the sound cache and change the volume of all html audio tags
        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i].usingAudioTag)
            {
                this._sounds[i].volume = this._sounds[i].volume * value;
            }
        }
        
    }

});
