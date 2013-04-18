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

    export class Bounce {

        public static In(k) {

            return 1 - Phaser.Easing.Bounce.Out(1 - k);

        }

        public static Out(k) {

            if (k < (1 / 2.75))
            {
                return 7.5625 * k * k;
            }
            else if (k < (2 / 2.75))
            {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            }
            else if (k < (2.5 / 2.75))
            {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            }
            else
            {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }

        }

        public static InOut(k) {

            if (k < 0.5) return Phaser.Easing.Bounce.In(k * 2) * 0.5;
            return Phaser.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

        }

    }

}
