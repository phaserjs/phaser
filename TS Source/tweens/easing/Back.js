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
        * Back easing methods.
        *
        * @class Back
        */
        var Back = (function () {
            function Back() { }
            Back.In = /**
            * The In ease method.
            *
            * @method In
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function In(k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            };
            Back.Out = /**
            * The Out ease method.
            *
            * @method Out
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function Out(k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            };
            Back.InOut = /**
            * The InOut ease method.
            *
            * @method InOut
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function InOut(k) {
                var s = 1.70158 * 1.525;
                if((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            };
            return Back;
        })();
        Easing.Back = Back;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
