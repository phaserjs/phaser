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
        * Quadratic easing methods.
        *
        * @class Quadratic
        */
        var Quadratic = (function () {
            function Quadratic() { }
            Quadratic.In = /**
            * The In ease method.
            *
            * @method In
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function In(k) {
                return k * k;
            };
            Quadratic.Out = /**
            * The Out ease method.
            *
            * @method Out
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function Out(k) {
                return k * (2 - k);
            };
            Quadratic.InOut = /**
            * The InOut ease method.
            *
            * @method InOut
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k;
                }
                return -0.5 * (--k * (k - 2) - 1);
            };
            return Quadratic;
        })();
        Easing.Quadratic = Quadratic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
