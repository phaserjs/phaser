var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /**
    * Phaser - Physics Manager
    *
    * Eventually this will handle switching between the default ArcadePhysics manager or the new AdvancedPhysics manager.
    * For now we direct everything through ArcadePhysics.
    */
    (function (Physics) {
        var Manager = (function () {
            function Manager(game) {
                this.game = game;
                this.arcade = new Phaser.Physics.ArcadePhysics(this.game, this.game.stage.width, this.game.stage.height);
                this.gravity = this.arcade.gravity;
                this.bounds = this.arcade.bounds;
            }
            Manager.prototype.update = /**
            * Called by the main Game.loop
            */
            function () {
                //this.arcade.updateMotion
                            };
            return Manager;
        })();
        Physics.Manager = Manager;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
