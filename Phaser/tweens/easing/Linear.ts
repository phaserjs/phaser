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
    * Linear easing methods.
    *
    * @class Linear
    */
    export class Linear {

        /**
        * A Linear Ease only has a None method.
        *
        * @method None
        * @param {Number} k The value to ease.
        * @return {Number} The eased value.
        */
        public static None(k) {

            return k;

        }

    }

}
