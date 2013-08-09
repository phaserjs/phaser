var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Linear
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Linear = (function () {
            function Linear() {
            }
            Linear.None = function (k) {
                return k;
            };
            return Linear;
        })();
        Easing.Linear = Linear;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
