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

    export class Quadratic {

        public static In(k) {

            return k * k;

        }

        public static Out(k) {

            return k * (2 - k);

        }

        public static InOut(k) {

            if ((k *= 2) < 1) return 0.5 * k * k;
            return -0.5 * (--k * (k - 2) - 1);

        }

    }

}
