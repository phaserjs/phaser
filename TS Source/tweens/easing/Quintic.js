var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * @author       Richard Davey <rich@photonstorm.com>
    * @author       sole (http://soledadpenades.com), tween.js
    * @copyright    2013 Photon Storm Ltd.
    * @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
    * @module       Phaser
    */
    (function (Easing) {
        /**
        * Quintic easing methods.
        *
        * @class Quintic
        */
        var Quintic = (function () {
            function Quintic() { }
            Quintic.In = /**
            * The In ease method.
            *
            * @method In
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function In(k) {
                return k * k * k * k * k;
            };
            Quintic.Out = /**
            * The Out ease method.
            *
            * @method Out
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function Out(k) {
                return --k * k * k * k * k + 1;
            };
            Quintic.InOut = /**
            * The InOut ease method.
            *
            * @method InOut
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            };
            return Quintic;
        })();
        Easing.Quintic = Quintic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
