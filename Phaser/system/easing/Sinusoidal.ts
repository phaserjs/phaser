/// <reference path="../../Game.ts" />

/**
 *	Phaser - Easing
 *
 *	@desc 		Based heavily on tween.js by sole (https://github.com/sole/tween.js)
 *
 *	@version 	1.0 - 11th January 2013
 *
 *	@author 	Richard Davey, TypeScript conversion and Phaser integration. See Phaser.TweenManager for the full tween.js author list
 */

module Phaser.Easing {

    export class Sinusoidal {

        public static In(k) {

            return 1 - Math.cos(k * Math.PI / 2);

        }

        public static Out(k) {

            return Math.sin(k * Math.PI / 2);

        }

        public static InOut(k) {

            return 0.5 * (1 - Math.cos(Math.PI * k));

        }

    }

}
