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

        /**
         * TweenManager constructor
         * @param game {Game} A reference to the current Game.
         */
        constructor(game: Phaser.Game) {

            this._game = game;
            this._tweens = [];

        }

        /**
         * Local private reference to Game
         */
        private _game: Phaser.Game;

        /**
         * Local private array which is the container of all tween objects.
         */
        private _tweens: Phaser.Tween[];

        /**
         * Get all the tween objects in an array.
         * @return {Phaser.Tween[]} Array with all tween objects.
         */
        public getAll() {

            return this._tweens;

        }

        /**
         * Remove all tween objects.
         */
        public removeAll() {

            this._tweens.length = 0;

        }

        /**
         * Create a tween object for a specific object.
         *
         * @param object {object} Object you wish the tween will affect.
         * @return {Phaser.Tween} The newly created tween object.
         */
        public create(object): Phaser.Tween {

            return new Phaser.Tween(object, this._game);

        }

        /**
         * Add an exist tween object to the manager.
         *
         * @param tween {Phaser.Tween} The tween object you want to add.
         * @return {Phaser.Tween} The tween object you added to the manager.
         */
        public add(tween: Phaser.Tween) {

            tween.parent = this._game;

            this._tweens.push(tween);

            return tween;

        }

        /**
         * Remove a tween from this manager.
         *
         * @param tween {Phaser.Tween} The tween object you want to remove.
         */
        public remove(tween: Phaser.Tween) {

            var i = this._tweens.indexOf(tween);

            if (i !== -1)
            {
                this._tweens.splice(i, 1);
            }

        }

        /**
         * Update all the tween objects you added to this manager.
         *
         * @return {boolean} Return false if there's no tween to update, otherwise return true.
         */
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
