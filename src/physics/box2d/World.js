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
    this.velocityiterations = 8
    this.positionIterations = 10
    
    var gravity = new box2d.b2Vec2(0.0, -9.8);
    
    this.world = new box2d.b2World(gravity);
    this.contactListener = new Phaser.Physics.Box2D.SampleContactListener()
    this.world.SetContactListener(this.contactListener);

    this.setBoundsToWorld()

    bd = new box2d.b2BodyDef();
    this.ground = this.world.CreateBody(bd);
};

Phaser.Physics.Box2D.prototype = {
    update: function () {
        this.world.Step(1.0 / 60, this.velocityiterations, this.positionIterations);
        this.world.ClearForces();
        this.world.DrawDebugData()
    },
    
    addBody: function (body) {
      body.create(this)
    },
    
    removeBody: function(body){
      world.DestroyBody(body);
    },
    
    setBoundsToWorld: function (left, right, top, bottom, setCollisionGroup) {

        this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, left, right, top, bottom, setCollisionGroup);

    },
    setBounds: function (x, y, width, height, left, right, top, bottom, setCollisionGroup) {

        if (typeof left === 'undefined') { left = true; }
        if (typeof right === 'undefined') { right = true; }
        if (typeof top === 'undefined') { top = true; }
        if (typeof bottom === 'undefined') { bottom = true; }
        if (typeof setCollisionGroup === 'undefined') { setCollisionGroup = true; }

        var hw = (width / 2);
        var hh = (height / 2);
        var cx = hw + x;
        var cy = hh + y;
        //console.log(hw,hh,cx,cy)

        upperLeft = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(0), Phaser.Physics.Box2D.Utils.px2bi(0));
        upperRight = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(width), Phaser.Physics.Box2D.Utils.px2bi(0));
        lowerRight = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(width), Phaser.Physics.Box2D.Utils.px2bi(height));
        lowerLeft = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(0), Phaser.Physics.Box2D.Utils.px2bi(height));
        
        var groundBodyDef = new box2d.b2BodyDef();
        var groundBody = this.world.CreateBody(groundBodyDef);
        
        var groundBox = new box2d.b2EdgeShape();
        var groundBoxDef = box2d.b2Body.prototype.CreateFixture2.s_def;
        groundBoxDef.shape = groundBox;
        groundBoxDef.density = 0;

        // top
        groundBox.Set(upperLeft, upperRight);
        groundBody.CreateFixture(groundBoxDef);

        // right
        groundBox.Set(upperRight, lowerRight);
        groundBody.CreateFixture(groundBoxDef);

        // right
        groundBox.Set(lowerRight, lowerLeft);
        groundBody.CreateFixture(groundBoxDef);
        
        // right
        groundBox.Set(lowerLeft, upperLeft);
        groundBody.CreateFixture(groundBoxDef);

        this.debugBounds = new Phaser.Physics.Box2D.BodyDebug(this.game, groundBody)
    }
}