var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Cubic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Cubic = (function () {
            function Cubic() {
            }
            Cubic.In = function (k) {
                return k * k * k;
            };

            Cubic.Out = function (k) {
                return --k * k * k + 1;
            };

            Cubic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k * k;
                return 0.5 * ((k -= 2) * k * k + 2);
            };
            return Cubic;
        })();
        Easing.Cubic = Cubic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
