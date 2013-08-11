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
    * Cubic easing methods.
    *
    * @class Cubic
    */
    export class Cubic {

        /**
        * The In ease method.
        *
        * @method In
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static In(k) {

            return k * k * k;

        }

        /**
        * The Out ease method.
        *
        * @method Out
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static Out(k) {

            return --k * k * k + 1;

        }

        /**
        * The InOut ease method.
        *
        * @method InOut
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static InOut(k) {

            if ((k *= 2) < 1) return 0.5 * k * k * k;
            return 0.5 * ((k -= 2) * k * k + 2);

        }

    }

}
