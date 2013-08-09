var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Sinusoidal
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Sinusoidal = (function () {
            function Sinusoidal() {
            }
            Sinusoidal.In = function (k) {
                return 1 - Math.cos(k * Math.PI / 2);
            };

            Sinusoidal.Out = function (k) {
                return Math.sin(k * Math.PI / 2);
            };

            Sinusoidal.InOut = function (k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            };
            return Sinusoidal;
        })();
        Easing.Sinusoidal = Sinusoidal;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
