var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../math/Vec2.ts" />
        /// <reference path="../AdvancedPhysics.ts" />
        /// <reference path="../Body.ts" />
        /// <reference path="Shape.ts" />
        /// <reference path="Poly.ts" />
        /**
        * Phaser - Advanced Physics - Shapes - Triangle
        *
        * Based on the work Ju Hyung Lee started in JS PhyRus.
        */
        (function (Shapes) {
            var Triangle = (function (_super) {
                __extends(Triangle, _super);
                function Triangle(x1, y1, x2, y2, x3, y3) {
                    x1 = Phaser.Physics.AdvancedPhysics.pixelsToMeters(x1);
                    y1 = Phaser.Physics.AdvancedPhysics.pixelsToMeters(y1);
                    x2 = Phaser.Physics.AdvancedPhysics.pixelsToMeters(x2);
                    y2 = Phaser.Physics.AdvancedPhysics.pixelsToMeters(y2);
                    x3 = Phaser.Physics.AdvancedPhysics.pixelsToMeters(x3);
                    y3 = Phaser.Physics.AdvancedPhysics.pixelsToMeters(y3);
                                _super.call(this, [
                {
                    x: x1,
                    y: y1
                }, 
                {
                    x: x2,
                    y: y2
                }, 
                {
                    x: x3,
                    y: y3
                }
            ]);
                }
                return Triangle;
            })(Phaser.Physics.Shapes.Poly);
            Shapes.Triangle = Triangle;            
        })(Physics.Shapes || (Physics.Shapes = {}));
        var Shapes = Physics.Shapes;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
