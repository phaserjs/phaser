var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    (function (Particles) {
        /// <reference path="../../_definitions.ts" />
        (function (Zones) {
            var PointZone = (function (_super) {
                __extends(PointZone, _super);
                function PointZone(x, y) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    _super.call(this);
                    this.x = x;
                    this.y = y;
                }
                PointZone.prototype.getPosition = function () {
                    return this.vector.setTo(this.x, this.y);
                };

                PointZone.prototype.crossing = function (particle) {
                    if (this.alert) {
                        alert('Sorry PointZone does not support crossing method');
                        this.alert = false;
                    }
                };
                return PointZone;
            })(Zones.Zone);
            Zones.PointZone = PointZone;
        })(Particles.Zones || (Particles.Zones = {}));
        var Zones = Particles.Zones;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
