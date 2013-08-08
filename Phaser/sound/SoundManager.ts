/// <reference path="../Game.ts" />
/// <reference path="Sound.ts" />

/**
* Phaser - SoundManager
*
*/

module Phaser {

    export class SoundManager {

        /**
         * SoundManager constructor
         * Create a new <code>SoundManager</code>.
         */
        constructor(game: Game) {

            this.game = game;

            this._volume = 1;
            this._muted = false;
            this._sounds = [];

            if (this.game.device.iOS && this.game.device.webAudio == false)
            {
                this.channels = 1;
            }

            if (this.game.device.iOS || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock))
            {
                //console.log('iOS Touch Locked');
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


            this.usingWebAudio = true;
            this.noAudio = false;

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

        }

        public usingWebAudio: boolean = false;
        public usingAudioTag: boolean = false;
        public noAudio: boolean = false;

        /**
         * Local reference to the current Phaser.Game.
         */
        public game: Game;

        /**
         * Reference to AudioContext instance.
         */
        public context = null;

        /**
         * The Master Gain node through which all sounds
         */
        public masterGain;

        /**
         * Volume of sounds.
         * @type {number}
         */
        private _volume: number;

        private _sounds: Phaser.Sound[];

        private _muteVolume: number;
        private _muted: boolean = false;

        public channels: number;

        public touchLocked: boolean = false;

        private _unlockSource = null;

        public unlock() {

            if (this.touchLocked == false)
            {
                return;
            }

            //console.log('SoundManager touch unlocked');

            if (this.game.device.webAudio && (window['PhaserGlobal'] && window['PhaserGlobal'].disableWebAudio == false))
            {
                //console.log('create empty buffer');
                // Create empty buffer and play it
                var buffer = this.context.createBuffer(1, 1, 22050);
                this._unlockSource = this.context.createBufferSource();
                this._unlockSource.buffer = buffer;
                this._unlockSource.connect(this.context.destination);
                this._unlockSource.noteOn(0);
            }
            else
            {
                //  Create an Audio tag?
                //console.log('create audio tag');
                this.touchLocked = false;
                this._unlockSource = null;
                this.game.input.touch.callbackContext = null;
                this.game.input.touch.touchStartCallback = null;
                this.game.input.mouse.callbackContext = null;
                this.game.input.mouse.mouseDownCallback = null;
            }

        }

        /**
         * A global audio mute toggle.
         */
        public get mute():boolean {
            return this._muted;
        }

        public set mute(value: boolean) {

            console.log('SoundManager mute', value);

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

        /**
         * The global audio volume. A value between 0 (silence) and 1 (full volume)
         */
        public set volume(value: number) {

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

        public get volume(): number {

            if (this.usingWebAudio)
            {
                return this.masterGain.gain.value;
            }
            else
            {
                return this._volume;
            }

        }

        public stopAll() {

            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i])
                {
                    this._sounds[i].stop();
                }
            }

        }

        public pauseAll() {

            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i])
                {
                    this._sounds[i].pause();
                }
            }

        }

        public resumeAll() {

            for (var i = 0; i < this._sounds.length; i++)
            {
                if (this._sounds[i])
                {
                    this._sounds[i].resume();
                }
            }

        }

        /**
         * Decode a sound with its assets key.
         * @param key {string} Assets key of the sound to be decoded.
         * @param [sound] {Sound} its bufer will be set to decoded data.
         */
        public decode(key: string, sound: Sound = null) {

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

        }

        public onSoundDecode: Phaser.Signal = new Phaser.Signal;

        public update() {

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

        }

        public add(key: string, volume: number = 1, loop: boolean = false): Sound {

            var sound: Phaser.Sound = new Sound(this.game, key, volume, loop);

            this._sounds.push(sound);

            return sound;

        }

    }

}
