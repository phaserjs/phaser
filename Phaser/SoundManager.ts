/// <reference path="Game.ts" />
/// <reference path="system/Sound.ts" />

/**
* Phaser - SoundManager
*
* This is an embroyonic web audio sound management class. There is a lot of work still to do here.
*/

module Phaser {

    export class SoundManager {

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

        private _game: Game;

        private _context = null;
        private _gainNode;
        private _volume: number;

        public mute() {

            this._gainNode.gain.value = 0;

        }

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
