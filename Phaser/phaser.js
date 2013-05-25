var Phaser;
(function (Phaser) {
    Phaser.VERSION = 'Phaser version 0.9.6';
    Phaser.Point = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
    Phaser.Vec2 = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
    Phaser.Matrix = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Geom2) {
        var Point = (function () {
            function Point() { }
            Point.prototype.add = function (a, b) {
                a[0] = b[0];
                return a;
            };
            return Point;
        })();
        Geom2.Point = Point;        
    })(Phaser.Geom2 || (Phaser.Geom2 = {}));
    var Geom2 = Phaser.Geom2;
})(Phaser || (Phaser = {}));
