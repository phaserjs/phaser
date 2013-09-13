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
    * Sinusoidal easing methods.
    *
    * @class Sinusoidal
    */
    export class Sinusoidal {

        /**
        * The In ease method.
        *
        * @method In
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static In(k) {

            return 1 - Math.cos(k * Math.PI / 2);

        }

        /**
        * The Out ease method.
        *
        * @method Out
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static Out(k) {

            return Math.sin(k * Math.PI / 2);

        }

        /**
        * The InOut ease method.
        *
        * @method InOut
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static InOut(k) {

            return 0.5 * (1 - Math.cos(Math.PI * k));

        }

    }

}
