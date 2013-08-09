var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Quartic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quartic = (function () {
            function Quartic() {
            }
            Quartic.In = function (k) {
                return k * k * k * k;
            };

            Quartic.Out = function (k) {
                return 1 - (--k * k * k * k);
            };

            Quartic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k * k * k;
                return -0.5 * ((k -= 2) * k * k * k - 2);
            };
            return Quartic;
        })();
        Easing.Quartic = Quartic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
