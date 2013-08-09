var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Quadratic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quadratic = (function () {
            function Quadratic() {
            }
            Quadratic.In = function (k) {
                return k * k;
            };

            Quadratic.Out = function (k) {
                return k * (2 - k);
            };

            Quadratic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            };
            return Quadratic;
        })();
        Easing.Quadratic = Quadratic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
