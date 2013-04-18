/// <reference path="Game.ts" />
/// <reference path="system/Tween.ts" />

/**
 *	Phaser - Tween Manager
 *
 *	@desc 		Based heavily on tween.js by sole (https://github.com/sole/tween.js) converted to TypeScript, patched and integrated into Phaser
 *
 *	@version 	1.0 - 11th January 2013
 *
 *	@author 	Richard Davey, TypeScript conversion and Phaser integration
 *  @author     sole / http://soledadpenades.com
 *  @author     mrdoob / http://mrdoob.com
 *  @author     Robert Eisele / http://www.xarg.org
 *  @author     Philippe / http://philippe.elsass.me
 *  @author     Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 *  @author     Paul Lewis / http://www.aerotwist.com/
 *  @author     lechecacharro
 *  @author     Josh Faul / http://jocafa.com/
 *  @author     egraether / http://egraether.com/
 *
 *	@todo       
 *              1) Allow for tweening direct numeric values, not just object properties
 *              2) YoYo support
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
