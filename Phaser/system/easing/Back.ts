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

    export class Back {

        public static In(k) {

            var s = 1.70158;
            return k * k * ((s + 1) * k - s);

        }

        public static Out(k) {

            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;

        }

        public static InOut(k) {

            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

        }

    }

}
