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
        * Phaser - Advanced Physics - Shapes - Box
        *
        * Based on the work Ju Hyung Lee started in JS PhyRus.
        */
        (function (Shapes) {
            var Box = (function (_super) {
                __extends(Box, _super);
                //  Give in pixels
                function Box(x, y, width, height) {
                    console.log('Box px', x, y, width, height);
                    x = Phaser.Physics.AdvancedPhysics.pixelsToMeters(x);
                    y = Phaser.Physics.AdvancedPhysics.pixelsToMeters(y);
                    width = Phaser.Physics.AdvancedPhysics.pixelsToMeters(width);
                    height = Phaser.Physics.AdvancedPhysics.pixelsToMeters(height);
                    console.log('Box m', x, y, width, height);
                    var hw = width * 0.5;
                    var hh = height * 0.5;
                    console.log('Box hh', hw, hh);
                                _super.call(this, [
                {
                    x: -hw + x,
                    y: +hh + y
                }, 
                {
                    x: -hw + x,
                    y: -hh + y
                }, 
                {
                    x: +hw + x,
                    y: -hh + y
                }, 
                {
                    x: +hw + x,
                    y: +hh + y
                }
            ]);
                }
                return Box;
            })(Phaser.Physics.Shapes.Poly);
            Shapes.Box = Box;            
        })(Physics.Shapes || (Physics.Shapes = {}));
        var Shapes = Physics.Shapes;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
