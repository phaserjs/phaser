var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Circular
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Circular = (function () {
            function Circular() {
            }
            Circular.In = function (k) {
                return 1 - Math.sqrt(1 - k * k);
            };

            Circular.Out = function (k) {
                return Math.sqrt(1 - (--k * k));
            };

            Circular.InOut = function (k) {
                if ((k *= 2) < 1)
                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            };
            return Circular;
        })();
        Easing.Circular = Circular;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
