/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is typically linked to a single Sprite and defines properties that determine how the physics body is simulated.
* These properties affect how the body reacts to forces, what forces it generates on itself (to simulate friction), and how it reacts to collisions in the scene.
* In most cases, the properties are used to simulate physical effects. Each body also has its own property values that determine exactly how it reacts to forces and collisions in the scene.
* By default a single Rectangle shape is added to the Body that matches the dimensions of the parent Sprite. See addShape, removeShape, clearShapes to add extra shapes around the Body.
* Note: When bound to a Sprite to avoid single-pixel jitters on mobile devices we strongly recommend using Sprite sizes that are even on both axis, i.e. 128x128 not 127x127.
*
* @class Phaser.Physics.P2.Body
* @classdesc Physics Body Constructor
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Sprite} [sprite] - The Sprite object this physics body belongs to.
* @param {number} [x=0] - The x coordinate of this Body.
* @param {number} [y=0] - The y coordinate of this Body.
* @param {number} [mass=1] - The default mass of this Body (0 = static).
*/
Phaser.Physics.Box2D.Body = function (game, sprite, x, y, mass) {

    sprite = sprite || null;
    x = x || 0;
    y = y || 0;
    if (typeof mass === 'undefined') { mass = 1; }
    
    this.game = game;
    this.sprite = sprite;
    this.type = Phaser.Physics.Box2D;
    this.data = null
    this.offset = new Phaser.Point();
    
    this.position = {x: Phaser.Physics.Box2D.Utils.px2bi(x), y: Phaser.Physics.Box2D.Utils.px2bi(y)}
    
    //allow to debug non sprite physics
    //if (sprite)
    //{
        this.game.physics.box2d.addBody(this);
    //}

};

Phaser.Physics.Box2D.Body.prototype = {
    create: function(parent){
      world = parent.world
      this.parent = parent
      //create the body through the provided factory
      this.data = world.CreateBody(this.getBodyDef());
      this.data.SetPositionXY(this.position.x,this.position.y)

      this.addCircle(30)
      this.addRectangle(50,50)
      this.clearFixtures()
      //this.data.CreateFixture(this.getFixtureDef());
    },

    clearFixtures: function(){
      var f = this.data.GetFixtureList()
      while (f)
      {
        var f0 = f;
        f = f.GetNext();
        this.data.DestroyFixture(f0)
      }
    },
    
    getFixtureDef: function(){
      circle = new box2d.b2CircleShape();
      circle.m_radius = Phaser.Physics.Box2D.Utils.px2b(20)
      
      fd = new box2d.b2FixtureDef();
      fd.restitution = 0.5;
      fd.shape = circle;
      fd.density = 1.0;
      fd.friction = 0.9;

      return fd
    },
    
    getBodyDef: function(){
      return new box2d.b2BodyDef()
    },
    
    preUpdate: function(){

    },
    
    postUpdate: function () {
        if(!this.sprite) {return}
        position = this.data.GetPosition()
        this.sprite.x = Phaser.Physics.Box2D.Utils.b2pxi(position.x);
        this.sprite.y = Phaser.Physics.Box2D.Utils.b2pxi(position.y);

        //if (!this.fixedRotation)
        //{
            angle = Phaser.Math.radToDeg(this.data.GetAngleRadians()) * -1
            this.sprite.rotation = angle;
        //}

    },
    
    addCircle: function (radius, offsetX, offsetY) {
      offsetX = offsetX || 0;
      offsetY = offsetY || 0;

      circle = new box2d.b2CircleShape();
      circle.m_radius = Phaser.Physics.Box2D.Utils.px2b(radius)
      circle.m_p.SetXY(Phaser.Physics.Box2D.Utils.px2b(offsetX), Phaser.Physics.Box2D.Utils.px2bi(offsetY));
      
      fd = new box2d.b2FixtureDef();
      fd.restitution = 0.5;
      fd.shape = circle;
      fd.density = 1.0;
      fd.friction = 0.9;

      this.data.CreateFixture(fd);
    },
    
    addRectangle: function (width, height, offsetX, offsetY, rotation) {
      offsetX = offsetX || 0;
      offsetY = offsetY || 0;
      rotation = rotation || 0;


      var shape = new box2d.b2PolygonShape();
      offsets = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(offsetX), Phaser.Physics.Box2D.Utils.px2b(offsetY) )
      //shape.SetAsOrientedBox(width, height, offsets, Phaser.Math.degToRad(rotation));
      shape.SetAsOrientedBox(Phaser.Physics.Box2D.Utils.px2b(width), Phaser.Physics.Box2D.Utils.px2b(height), offsets, Phaser.Math.degToRad(rotation) )
      
      this.data.CreateFixture2(shape);
    },
    
    test: function(){
      var x1 = -20.0;
      var y1 = 2.0 * box2d.b2Cos(x1 / 10.0 * box2d.b2_pi);
      for (var i = 0; i < 80; ++i)
      {
        var x2 = x1 + 0.5;
        var y2 = 2.0 * box2d.b2Cos(x2 / 10.0 * box2d.b2_pi);

        var shape = new box2d.b2EdgeShape();
        shape.SetAsEdge(new box2d.b2Vec2(x1, -y1), new box2d.b2Vec2(x2, -y2));
        this.data.CreateFixture2(shape, 0.0);

        x1 = x2;
        y1 = y2;
      }
      this.debug = true
    }
}
/**
* @name Phaser.Physics.P2.Body#debug
* @property {boolean} debug - Enable or disable debug drawing of this body
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "debug", {
    
    get: function () {

        return (!this.debugBody);

    },

    set: function (value) {

        if (value && !this.debugBody)
        {
            //this will be added to the global space
            this.debugBody = new Phaser.Physics.Box2D.BodyDebug(this.game, this.data)
        }
        else if (!value && this.debugBody)
        {
            //destroy this.debugBody
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#static
* @property {boolean} static - Returns true if the Body is static. Setting Body.static to 'false' will make it dynamic.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "bullet", {
    
    get: function () {

        return (this.data.GetType() === box2d.b2BodyType.b2_bulletBody);

    },

    set: function (value) {

        if (value && this.data.GetType() !== box2d.b2BodyType.b2_bulletBody)
        {
            this.data.setType(box2d.b2BodyType.b2_bulletBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.setType(box2d.b2BodyType.b2_staticBody)
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#static
* @property {boolean} static - Returns true if the Body is static. Setting Body.static to 'false' will make it dynamic.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "static", {
    
    get: function () {

        return (this.data.GetType() === box2d.b2BodyType.b2_staticBody);

    },

    set: function (value) {

        if (value && this.data.GetType() !== box2d.b2BodyType.b2_staticBody)
        {
            this.data.setType(box2d.b2BodyType.b2_staticBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.setType(box2d.b2BodyType.dynamic)
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#dynamic
* @property {boolean} dynamic - Returns true if the Body is dynamic. Setting Body.dynamic to 'false' will make it static.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "dynamic", {
    
    get: function () {

        return (this.data.GetType() === box2d.b2BodyType.b2_dynamicBody);

    },

    set: function (value) {

        if (value && this.data.GetType() !== box2d.b2BodyType.b2_dynamicBody)
        {
            this.data.setType(box2d.b2BodyType.b2_dynamicBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.setType(box2d.b2BodyType.b2_staticBody)
        }

    }

});




/**
* @name Phaser.Physics.Box2D.Body#kinematic
* @property {boolean} kinematic - Returns true if the Body is kinematic. Setting Body.kinematic to 'false' will make it static.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "kinematic", {
    
    get: function () {

        return (this.data.GetType() === box2d.b2BodyType.b2_kinematicBody);

    },

    set: function (value) {

        if (value && this.data.GetType() !== box2d.b2BodyType.b2_kinematicBody)
        {
            this.data.setType(box2d.b2BodyType.b2_kinematicBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.setType(box2d.b2BodyType.b2_staticBody)
        }

    }

});