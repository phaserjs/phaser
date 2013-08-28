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
        * Elastic easing methods.
        *
        * @class Elastic
        */
        var Elastic = (function () {
            function Elastic() { }
            Elastic.In = /**
            * The In ease method.
            *
            * @method In
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function In(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            };
            Elastic.Out = /**
            * The Out ease method.
            *
            * @method Out
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function Out(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
            };
            Elastic.InOut = /**
            * The InOut ease method.
            *
            * @method InOut
            * @param {Number} k The value to ease.
            * @return {Number} The eased value.
            */
            function InOut(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                if((k *= 2) < 1) {
                    return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                }
                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
            };
            return Elastic;
        })();
        Easing.Elastic = Elastic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
