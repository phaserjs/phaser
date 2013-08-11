/// <reference path="../../_definitions.ts" />

/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       sole (http://soledadpenades.com), tween.js
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
module Phaser.Easing {

    /**
    * Bounce easing methods.
    *
    * @class Bounce
    */
    export class Bounce {

        /**
        * The In ease method.
        *
        * @method In
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static In(k) {

            return 1 - Phaser.Easing.Bounce.Out(1 - k);

        }

        /**
        * The Out ease method.
        *
        * @method Out
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
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

        /**
        * The InOut ease method.
        *
        * @method InOut
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static InOut(k) {

            if (k < 0.5) return Phaser.Easing.Bounce.In(k * 2) * 0.5;
            return Phaser.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

        }

    }

}
