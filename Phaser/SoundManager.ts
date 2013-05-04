/// <reference path="Game.ts" />
/// <reference path="system/Sound.ts" />

/**
* Phaser - SoundManager
*
* This is an embroyonic web audio sound management class. There is a lot of work still to do here.
*/

module Phaser {

    export class SoundManager {

        /**
         * SoundManager constructor
         * Create a new <code>SoundManager</code>.
         */
        constructor(game: Game) {

            this._game = game;

            if (game.device.webaudio == true)
            {
                if (!!window['AudioContext'])
                {
                    this._context = new window['AudioContext']();
                }
                else if (!!window['webkitAudioContext'])
                {
                    this._context = new window['webkitAudioContext']();
                }

                if (this._context !== null)
                {
                    this._gainNode = this._context.createGainNode();
                    this._gainNode.connect(this._context.destination);
                    this._volume = 1;
                }
            }

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        /**
         * Reference to AudioContext instance.
         */
        private _context = null;
        /**
         * Gain node created from audio context.
         */
        private _gainNode;
        /**
         * Volume of sounds.
         * @type {number}
         */
        private _volume: number;

        /**
         * Mute sounds.
         */
        public mute() {

            this._gainNode.gain.value = 0;

        }

        /**
         * Enable sounds.
         */
        public unmute() {

            this._gainNode.gain.value = this._volume;

        }

        public set volume(value: number) {

            this._volume = value;
            this._gainNode.gain.value = this._volume;

        }

        public get volume(): number {
            return this._volume;
        }

        /**
         * Decode a sound with its assets key.
         * @param key {string} Assets key of the sound to be decoded.
         * @param callback {function} This will be invoked when finished decoding.
         * @param sound {Sound} Optional, its bufer will be set to decoded data.
         */
        public decode(key: string, callback = null, sound?: Sound = null) {

            var soundData = this._game.cache.getSound(key);

            if (soundData)
            {
                if (this._game.cache.isSoundDecoded(key) === false)
                {
                    var that = this;

                    this._context.decodeAudioData(soundData, function (buffer) {
                        that._game.cache.decodedSound(key, buffer);

                        if (sound)
                        {
                            sound.setDecodedBuffer(buffer);
                        }

                        callback();
                    });
                }
            }

        }

        /**
         * Play a sound with its assets key.
         * @param key {string} Assets key of the sound you want to play.
         * @param volume {number} Optional, volume of the sound you want to play.
         * @param loop {boolean} Optional, loop when it finished playing? (Default to false)
         * @return {Sound} The playing sound object.
         */
        public play(key: string, volume?: number = 1, loop?: bool = false): Sound {

            if (this._context === null)
            {
                return;
            }

            var soundData = this._game.cache.getSound(key);

            if (soundData)
            {
                //  Does the sound need decoding?
                if (this._game.cache.isSoundDecoded(key) === true)
                {
                    return new Sound(this._context, this._gainNode, soundData, volume, loop);
                }
                else
                {
                    var tempSound: Sound = new Sound(this._context, this._gainNode, null, volume, loop);

                    //  this is an async process, so we can return the Sound object anyway, it just won't be playing yet
                    this.decode(key, () => tempSound.play(), tempSound);

                    return tempSound;
                }
            }

        }

    }

}
