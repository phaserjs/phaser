/// <reference path="../Game.ts" />
/// <reference path="../SoundManager.ts" />

/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/

module Phaser {

    export class Sound {

        /**
         * Sound constructor
         * @param context {object} The AudioContext instance.
         * @param gainNode {object} Gain node instance.
         * @param data {object} Sound data.
         * @param [volume] {number} volume of this sound when playing.
         * @param [loop] {boolean} loop this sound when playing? (Default to false)
         */
        constructor(context, gainNode, data, volume?: number = 1, loop?: bool = false) {

            this._context = context;
            this._gainNode = gainNode;
            this._buffer = data;
            this._volume = volume;
            this.loop = loop;

            //  Local volume control
            if (this._context !== null)
            {
                this._localGainNode = this._context.createGainNode();
                this._localGainNode.connect(this._gainNode);
                this._localGainNode.gain.value = this._volume;
            }

            if (this._buffer === null)
            {
                this.isDecoding = true;
            }
            else
            {
                this.play();
            }

        }

        /**
         * Local private reference to AudioContext.
         */
        private _context;
        /**
         * Reference to gain node of SoundManager.
         */
        private _gainNode;
        /**
         * GainNode of this sound.
         */
        private _localGainNode;
        /**
         * Decoded data buffer.
         */
        private _buffer;
        /**
         * Volume of this sound.
         */
        private _volume: number;
        /**
         * The real sound object (buffer source).
         */
        private _sound;

        loop: bool = false;
        duration: number;
        isPlaying: bool = false;
        isDecoding: bool = false;

        public setDecodedBuffer(data) {

            this._buffer = data;
            this.isDecoding = false;
            //this.play();

        }

        /**
         * Play this sound.
         */
        public play() {

            if (this._buffer === null || this.isDecoding === true)
            {
                return;
            }

            this._sound = this._context.createBufferSource();
            this._sound.buffer = this._buffer;
            this._sound.connect(this._localGainNode);

            if (this.loop)
            {
                this._sound.loop = true;
            }

            this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it

            this.duration = this._sound.buffer.duration;
            this.isPlaying = true;

        }

        /**
         * Stop playing this sound.
         */
        public stop() {

            if (this.isPlaying === true)
            {
                this.isPlaying = false;

                this._sound.noteOff(0);
            }

        }

        /**
         * Mute the sound.
         */
        public mute() {

            this._localGainNode.gain.value = 0;

        }

        /**
         * Enable the sound.
         */
        public unmute() {

            this._localGainNode.gain.value = this._volume;

        }

        public set volume(value: number) {

            this._volume = value;
            this._localGainNode.gain.value = this._volume;

        }

        public get volume(): number {
            return this._volume;
        }

    }

}