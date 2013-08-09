var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Back
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Back = (function () {
            function Back() {
            }
            Back.In = function (k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            };

            Back.Out = function (k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            };

            Back.InOut = function (k) {
                var s = 1.70158 * 1.525;
                if ((k *= 2) < 1)
                    return 0.5 * (k * k * ((s + 1) * k - s));
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            };
            return Back;
        })();
        Easing.Back = Back;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
