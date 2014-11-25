/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Sound Manager is responsible for playing back audio via either the Legacy HTML Audio tag or via Web Audio if the browser supports it.
* Note: On Firefox 25+ on Linux if you have media.gstreamer disabled in about:config then it cannot play back mp3 or m4a files.
* The audio file type and the encoding of those files are extremely important. Not all browsers can play all audio formats.
* There is a good guide to what's supported here: http://hpr.dogphilosophy.net/test/
*
* @class Phaser.SoundManager
* @constructor
* @param {Phaser.Game} game reference to the current game instance.
*/
Phaser.SoundManager = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Phaser.Signal} onSoundDecode - The event dispatched when a sound decodes (typically only for mp3 files)
    */
    this.onSoundDecode = new Phaser.Signal();

    /**
    * @property {boolean} _codeMuted - Internal mute tracking var.
    * @private
    * @default
    */
    this._codeMuted = false;

    /**
    * @property {boolean} _muted - Internal mute tracking var.
    * @private
    * @default
    */
    this._muted = false;

    /**
    * @property {AudioContext} _unlockSource - Internal unlock tracking var.
    * @private
    * @default
    */
    this._unlockSource = null;

    /**
    * @property {number} _volume - The global audio volume. A value between 0 (silence) and 1 (full volume).
    * @private
    * @default
    */
    this._volume = 1;

    /**
    * @property {array} _sounds - An array containing all the sounds
    * @private
    */
    this._sounds = [];

    /**
    * @property {AudioContext} context - The AudioContext being used for playback.
    * @default
    */
    this.context = null;

    /**
    * @property {boolean} usingWebAudio - true if this sound is being played with Web Audio.
    * @readonly
    */
    this.usingWebAudio = true;

    /**
    * @property {boolean} usingAudioTag - true if the sound is being played via the Audio tag.
    * @readonly
    */
    this.usingAudioTag = false;

    /**
    * @property {boolean} noAudio - Has audio been disabled via the PhaserGlobal object? Useful if you need to use a 3rd party audio library instead.
    * @default
    */
    this.noAudio = false;

    /**
    * @property {boolean} connectToMaster - Used in conjunction with Sound.externalNode this allows you to stop a Sound node being connected to the SoundManager master gain node.
    * @default
    */
    this.connectToMaster = true;

    /**
    * @property {boolean} touchLocked - true if the audio system is currently locked awaiting a touch event.
    * @default
    */
    this.touchLocked = false;

    /**
    * @property {number} channels - The number of audio channels to use in playback.
    * @default
    */
    this.channels = 32;

};

Phaser.SoundManager.prototype = {

    /**
    * Initialises the sound manager.
    * @method Phaser.SoundManager#boot
    * @protected
    */
    boot: function () {

        if (this.game.device.iOS && this.game.device.webAudio === false)
        {
            this.channels = 1;
        }

        if (!this.game.device.cocoonJS && this.game.device.iOS || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock))
        {
            this.game.input.touch.callbackContext = this;
            this.game.input.touch.touchStartCallback = this.unlock;
            this.game.input.mouse.callbackContext = this;
            this.game.input.mouse.mouseDownCallback = this.unlock;
            this.touchLocked = true;
        }
        else
        {
            this.touchLocked = false;
        }

        if (window['PhaserGlobal'])
        {
            //  Check to see if all audio playback is disabled (i.e. handled by a 3rd party class)
            if (window['PhaserGlobal'].disableAudio === true)
            {
                this.usingWebAudio = false;
                this.noAudio = true;
                return;
            }

            //  Check if the Web Audio API is disabled (for testing Audio Tag playback during development)
            if (window['PhaserGlobal'].disableWebAudio === true)
            {
                this.usingWebAudio = false;
                this.usingAudioTag = true;
                this.noAudio = false;
                return;
            }
        }

        if (!!window['AudioContext'])
        {
            try {
                this.context = new window['AudioContext']();
            } catch (error) {
                this.context = null;
                this.usingWebAudio = false;
                this.noAudio = true;
            }
        }
        else if (!!window['webkitAudioContext'])
        {
            try {
                this.context = new window['webkitAudioContext']();
            } catch (error) {
                this.context = null;
                this.usingWebAudio = false;
                this.noAudio = true;
            }
        }

        if (!!window['Audio'] && this.context === null)
        {
            this.usingWebAudio = false;
            this.usingAudioTag = true;
            this.noAudio = false;
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
    * Enables the audio, usually after the first touch.
    * @method Phaser.SoundManager#unlock
    */
    unlock: function () {

        if (this.touchLocked === false)
        {
            return;
        }

        //  Global override (mostly for Audio Tag testing)
        if (this.game.device.webAudio === false || (window['PhaserGlobal'] && window['PhaserGlobal'].disableWebAudio === true))
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
    * Stops all the sounds in the game.
    *
    * @method Phaser.SoundManager#stopAll
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
    * Pauses all the sounds in the game.
    *
    * @method Phaser.SoundManager#pauseAll
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
    * Resumes every sound in the game.
    *
    * @method Phaser.SoundManager#resumeAll
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
    * Decode a sound by its assets key.
    *
    * @method Phaser.SoundManager#decode
    * @param {string} key - Assets key of the sound to be decoded.
    * @param {Phaser.Sound} [sound] - Its buffer will be set to decoded data.
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
                        that.onSoundDecode.dispatch(key, sound);
                    }
                });
            }
        }

    },

    /**
    * Updates every sound in the game.
    *
    * @method Phaser.SoundManager#update
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
    * Adds a new Sound into the SoundManager.
    *
    * @method Phaser.SoundManager#add
    * @param {string} key - Asset key for the sound.
    * @param {number} [volume=1] - Default value for the volume.
    * @param {boolean} [loop=false] - Whether or not the sound will loop.
    * @param {boolean} [connect=true] - Controls if the created Sound object will connect to the master gainNode of the SoundManager when running under WebAudio.
    * @return {Phaser.Sound} The new sound instance.
    */
    add: function (key, volume, loop, connect) {

        if (typeof volume === 'undefined') { volume = 1; }
        if (typeof loop === 'undefined') { loop = false; }
        if (typeof connect === 'undefined') { connect = this.connectToMaster; }

        var sound = new Phaser.Sound(this.game, key, volume, loop, connect);

        this._sounds.push(sound);

        return sound;

    },

    /**
     * Adds a new AudioSprite into the SoundManager.
     *
     * @method Phaser.SoundManager#addSprite
     * @param {string} key - Asset key for the sound.
     * @return {Phaser.AudioSprite} The new AudioSprite instance.
     */
    addSprite: function(key) {

        var audioSprite = new Phaser.AudioSprite(this.game, key);

        return audioSprite;

    },

    /**
    * Removes a Sound from the SoundManager. The removed Sound is destroyed before removal.
    *
    * @method Phaser.SoundManager#remove
    * @param {Phaser.Sound} sound - The sound object to remove.
    * @return {boolean} True if the sound was removed successfully, otherwise false.
    */
    remove: function (sound) {

        var i = this._sounds.length;

        while (i--)
        {
            if (this._sounds[i] === sound)
            {
                this._sounds[i].destroy(false);
                this._sounds.splice(i, 1);
                return true;
            }
        }

        return false;

    },

    /**
    * Removes all Sounds from the SoundManager that have an asset key matching the given value.
    * The removed Sounds are destroyed before removal.
    *
    * @method Phaser.SoundManager#removeByKey
    * @param {string} key - The key to match when removing sound objects.
    * @return {number} The number of matching sound objects that were removed.
    */
    removeByKey: function (key) {

        var i = this._sounds.length;
        var removed = 0;

        while (i--)
        {
            if (this._sounds[i].key === key)
            {
                this._sounds[i].destroy(false);
                this._sounds.splice(i, 1);
                removed++;
            }
        }

        return removed;

    },

    /**
    * Adds a new Sound into the SoundManager and starts it playing.
    *
    * @method Phaser.SoundManager#play
    * @param {string} key - Asset key for the sound.
    * @param {number} [volume=1] - Default value for the volume.
    * @param {boolean} [loop=false] - Whether or not the sound will loop.
    * @return {Phaser.Sound} The new sound instance.
    */
    play: function (key, volume, loop) {

        var sound = this.add(key, volume, loop);

        sound.play();

        return sound;

    },

    /**
    * Internal mute handler called automatically by the Sound.mute setter.
    *
    * @method Phaser.SoundManager#setMute
    * @private
    */
    setMute: function () {

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

    },

    /**
    * Internal mute handler called automatically by the Sound.mute setter.
    *
    * @method Phaser.SoundManager#unsetMute
    * @private
    */
    unsetMute: function () {

        if (!this._muted || this._codeMuted)
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

    },

    /**
    * Stops all the sounds in the game, then destroys them and finally clears up any callbacks.
    *
    * @method Phaser.SoundManager#destroy
    */
    destroy: function () {

        this.stopAll();

        for (var i = 0; i < this._sounds.length; i++)
        {
            if (this._sounds[i])
            {
                this._sounds[i].destroy();
            }
        }

        this._sounds = [];
        this.onSoundDecode.dispose();

    }

};

Phaser.SoundManager.prototype.constructor = Phaser.SoundManager;

/**
* @name Phaser.SoundManager#mute
* @property {boolean} mute - Gets or sets the muted state of the SoundManager. This effects all sounds in the game.
*/
Object.defineProperty(Phaser.SoundManager.prototype, "mute", {

    get: function () {

        return this._muted;

    },

    set: function (value) {

        value = value || null;

        if (value)
        {
            if (this._muted)
            {
                return;
            }

            this._codeMuted = true;
            this.setMute();
        }
        else
        {
            if (!this._muted)
            {
                return;
            }

            this._codeMuted = false;
            this.unsetMute();
        }
    }

});

/**
* @name Phaser.SoundManager#volume
* @property {number} volume - Gets or sets the global volume of the SoundManager, a value between 0 and 1.
*/
Object.defineProperty(Phaser.SoundManager.prototype, "volume", {

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

    set: function (value) {

        this._volume = value;

        if (this.usingWebAudio)
        {
            this.masterGain.gain.value = value;
        }
        else
        {
            //  Loop through the sound cache and change the volume of all html audio tags
            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i].usingAudioTag)
                {
                    this._sounds[i].volume = this._sounds[i].volume * value;
                }
            }
        }

    }

});
