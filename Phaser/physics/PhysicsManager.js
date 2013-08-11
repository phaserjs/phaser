var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Physics - PhysicsManager
    */
    (function (Physics) {
        var PhysicsManager = (function () {
            function PhysicsManager(game) {
                this.grav = 0.2;
                this.drag = 1;
                this.bounce = 0.3;
                this.friction = 0.05;
                this.min_f = 0;
                this.max_f = 1;
                this.min_b = 0;
                this.max_b = 1;
                this.min_g = 0;
                this.max_g = 1;
                this.xmin = 0;
                this.xmax = 800;
                this.ymin = 0;
                this.ymax = 600;
                this.objrad = 24;
                this.tilerad = 24 * 2;
                this.objspeed = 0.2;
                this.maxspeed = 20;
                this.game = game;
            }
            PhysicsManager.prototype.update = function () {
                //  Booyah!
            };
            return PhysicsManager;
        })();
        Physics.PhysicsManager = PhysicsManager;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
