/// <reference path="../Game.ts" />
/// <reference path="../SoundManager.ts" />

/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/

module Phaser {

    export class Sound {

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

        private _context;
        private _gainNode;
        private _localGainNode;
        private _buffer;
        private _volume: number;
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

        public stop() {

            if (this.isPlaying === true)
            {
                this.isPlaying = false;

                this._sound.noteOff(0);
            }

        }

        public mute() {

            this._localGainNode.gain.value = 0;

        }

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