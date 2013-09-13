var Phaser;
(function (Phaser) {
    /// <reference path="../../math/Vec2.ts" />
    /// <reference path="../../math/Vec2Utils.ts" />
    /// <reference path="../AdvancedPhysics.ts" />
    /// <reference path="../Body.ts" />
    /// <reference path="../Bounds.ts" />
    /// <reference path="IShape.ts" />
    /**
    * Phaser - Advanced Physics - Shape
    *
    * Based on the work Ju Hyung Lee started in JS PhyRus.
    */
    (function (Physics) {
        var Shape = (function () {
            function Shape(type) {
                this.id = Physics.AdvancedPhysics.shapeCounter++;
                this.type = type;
                this.elasticity = 0.0;
                this.friction = 1.0;
                this.density = 1;
                this.bounds = new Physics.Bounds();
            }
            Shape.prototype.findEdgeByPoint = //  Over-ridden by ShapePoly
            function (p, minDist) {
                return -1;
            };
            return Shape;
        })();
        Physics.Shape = Shape;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
