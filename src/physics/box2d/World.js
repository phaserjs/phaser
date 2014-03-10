/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.Physics.Box2D = function (game, config) {
    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;
    
    var gravity = new box2d.b2Vec2(0.0, -9.8);
    
    this.world = new box2d.b2World(gravity);
};

Phaser.Physics.Box2D.prototype = {
    update: function () {
        console.log('update box2d')
        this.world.Step(1.0 / 60);
        this.world.ClearForces();
    }
}