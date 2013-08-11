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
        (function (Initializers) {
            var Position = (function (_super) {
                __extends(Position, _super);
                function Position(zone) {
                    _super.call(this);

                    if (zone != null && zone != undefined) {
                        this.zone = zone;
                    } else {
                        this.zone = new Phaser.Particles.Zones.PointZone();
                    }
                }
                Position.prototype.reset = function (zone) {
                    if (zone != null && zone != undefined) {
                        this.zone = zone;
                    } else {
                        this.zone = new Phaser.Particles.Zones.PointZone();
                    }
                };

                Position.prototype.initialize = function (target) {
                    this.zone.getPosition();

                    target.p.x = this.zone.vector.x;
                    target.p.y = this.zone.vector.y;
                };
                return Position;
            })(Initializers.Initialize);
            Initializers.Position = Position;
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
