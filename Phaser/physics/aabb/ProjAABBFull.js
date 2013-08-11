var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var AABBFull = (function () {
                function AABBFull() {
                }
                AABBFull.Collide = function (x, y, obj, t) {
                    var l = Math.sqrt(x * x + y * y);

                    obj.ReportCollisionVsWorld(x, y, x / l, y / l, t);

                    return Phaser.Physics.AABB.COL_AXIS;
                };
                return AABBFull;
            })();
            Projection.AABBFull = AABBFull;
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
