/// <reference path="Game.ts" />
/// <reference path="system/Tween.ts" />

/**
* Phaser - TweenManager
*
* The Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* I converted it to TypeScript, swapped the callbacks for signals and patched a few issues with regard 
* to properties and completion errors. Please see https://github.com/sole/tween.js for a full list of contributors.
*/

module Phaser {

    export class TweenManager {

        constructor(game: Phaser.Game) {

            this._game = game;
            this._tweens = [];

        }

        private _game: Phaser.Game;
        private _tweens: Phaser.Tween[];

        public getAll() {

            return this._tweens;

        }

        public removeAll() {

            this._tweens.length = 0;

        }

        public create(object): Phaser.Tween {

            return new Phaser.Tween(object, this._game);

        }

        public add(tween: Phaser.Tween) {

            tween.parent = this._game;

            this._tweens.push(tween);

            return tween;

        }

        public remove(tween: Phaser.Tween) {

            var i = this._tweens.indexOf(tween);

            if (i !== -1)
            {
                this._tweens.splice(i, 1);
            }

        }

        public update() {

            if (this._tweens.length === 0)
            {
                return false;
            }

            var i = 0;
            var numTweens = this._tweens.length;

            while (i < numTweens)
            {
                if (this._tweens[i].update(this._game.time.now))
                {
                    i++;
                }
                else
                {
                    this._tweens.splice(i, 1);
                    numTweens--;
                }
            }

            return true;

        }

    }
}
