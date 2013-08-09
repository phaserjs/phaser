var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Quintic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quintic = (function () {
            function Quintic() {
            }
            Quintic.In = function (k) {
                return k * k * k * k * k;
            };

            Quintic.Out = function (k) {
                return --k * k * k * k * k + 1;
            };

            Quintic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k * k * k * k;
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            };
            return Quintic;
        })();
        Easing.Quintic = Quintic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
