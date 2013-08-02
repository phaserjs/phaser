var Phaser;
(function (Phaser) {
    /// <reference path="../math/Vec2.ts" />
    /// <reference path="../math/Vec2Utils.ts" />
    /// <reference path="AdvancedPhysics.ts" />
    /// <reference path="Body.ts" />
    /**
    * Phaser - Advanced Physics - Plane
    *
    * Based on the work Ju Hyung Lee started in JS PhyRus.
    */
    (function (Physics) {
        var Plane = (function () {
            function Plane(normal, d) {
                this.normal = normal;
                this.d = d;
            }
            return Plane;
        })();
        Physics.Plane = Plane;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
