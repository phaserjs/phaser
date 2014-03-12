/**
* @author       George https://github.com/georgiee
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
* @class Phaser.Physics.Box2D.Body
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
    
    this.position = {x: Phaser.Physics.Box2D.Utils.px2b(x), y: Phaser.Physics.Box2D.Utils.px2bi(y)}
    
    //allow to debug non sprite physics
    //if (sprite)
    //{
        this.game.physics.box2d.addBody(this);
    //}
    if (sprite){
      //this.setCircle(20)
      this.setRectangleFromSprite(sprite);
    }

};

Phaser.Physics.Box2D.Body.prototype = {

    //called by box2d after this body is requested to be added
    //this call is necessary so that this Phaser Body can store the box2d Body reference
    //and create the fixtures when the body becomes available through the world factory(world.CreateBody)
    
    create: function(parent){
      //pick the reference to the core box2d.World
      world = parent.world
      //store a reference to the Phaser Box2D World
      this.parent = parent
      //create the body through the provided factory
      this.data = world.CreateBody(this.getBodyDef());
      //store a reference in the Box2D Body itself. Might be useful in some 
      //box2d body queries (collisions)
      this.data.SetUserData(this);
      this.data.SetPositionXY(this.position.x,this.position.y)
      
      //set a default fixture. This will be cleared when a rectangle is created from the sprite (if a sprite is available )
      this.addCircle(20)
    },
    
    getBodyDef: function(){
      return new box2d.b2BodyDef()
    },
    
    //functiosn called by the physics solver
    preUpdate: function(){

    },
    
    postUpdate: function () {
        if(!this.sprite) {return}
        position = this.data.GetPosition()
        this.sprite.x = Phaser.Physics.Box2D.Utils.b2px(position.x);
        this.sprite.y = Phaser.Physics.Box2D.Utils.b2pxi(position.y);
        this.sprite.rotation = -this.data.GetAngleRadians(); //zero when fixed rotation
    },

    //convenience function to redraw the debug graphics
    redrawDebug: function(){
      if(this.debugBody){
        this.debugBody.draw()
      }
    },
    
    //create a fixture from the given definition.
    createFixture: function(fd){
      this.data.CreateFixture(fd);
      this.redrawDebug();
    },
    
    //convenience function, to create a fixture straight from a shape (wihtout a fixture definition)
    //a ficture definition is the material of box2d. defines restitution, density, friction of the shape
    //this function will set them to some default values. You can only pass the mass in addition.
    createFixtureFromShape: function(shape, mass){
      mass = mass || 1
      this.data.CreateFixture2(shape, mass);
      this.redrawDebug();
    },

    //////////////////////////////////////
    //Fixture/Shape creating Methods // //
    //////////////////////////////////////
    


    //remove all fixtures. These are the shapes of this body.
    clearFixtures: function(){
      var f = this.data.GetFixtureList()
      while (f)
      {
        var f0 = f;
        f = f.GetNext();
        this.data.DestroyFixture(f0)
      }
    },

    setRectangleFromSprite: function (sprite) {
        if (typeof sprite === 'undefined') { sprite = this.sprite; }
        this.clearFixtures();
        this.addRectangle(sprite.width, sprite.height, 0, 0, sprite.rotation);
    },

    // replace all fixtures with a circle
    setCircle: function(radius, offsetX, offsetY){
      this.clearFixtures()
      this.addCircle(radius, offsetX, offsetY)
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
      
      this.createFixture(fd)
    },

    //create rectangle shapes
    setRectangle: function(width, height, offsetX, offsetY, rotation){
      this.clearFixtures()
      this.addRectangle(width, height, offsetX, offsetY, rotation)
    },
    
    addRectangle: function (width, height, offsetX, offsetY, rotation) {
      offsetX = offsetX || 0;
      offsetY = offsetY || 0;
      rotation = rotation || 0;

      var shape = new box2d.b2PolygonShape();
      offsets = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(offsetX), Phaser.Physics.Box2D.Utils.px2b(offsetY) )
      shape.SetAsOrientedBox(Phaser.Physics.Box2D.Utils.px2b(width/2), Phaser.Physics.Box2D.Utils.px2b(height/2), offsets, Phaser.Math.degToRad(rotation) )
      
      this.data.CreateFixture2(shape);
      this.createFixtureFromShape(shape)
    },
    
    //load a stored polygon. this is a reduced version comapred to the p2 loadPolygon method
    loadPolygon: function (key, object, options) {
        this.clearFixtures()

        var data = this.game.cache.getPhysicsData(key, object);

        //test some bounciness with the polygon
        fd = new box2d.b2FixtureDef();
        fd.restitution = 0.5;
        fd.density = 1.0;
        fd.friction = 0.9;
        


        for (var i = 0; i < data.length; i++)
        {
            var shape = data[i].shape
            var vertices = [];

            for (var s = 0; s < shape.length; s += 2)
            { 
              v = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(shape[s]), Phaser.Physics.Box2D.Utils.px2bi(shape[s + 1]));
              vertices.push(v);
            }

            var polygon = new box2d.b2PolygonShape();
            polygon.SetAsArray(vertices, vertices.length);

            console.log('polygon.m_vertexCount',polygon.m_vertexCount)
            
            for(var k=0;k < polygon.m_count;k++){
              polygon.m_vertices[k].x += - Phaser.Physics.Box2D.Utils.px2b(this.sprite.width / 2);
              polygon.m_vertices[k].y += Phaser.Physics.Box2D.Utils.px2b(this.sprite.height / 2);
            }
            fd.shape = polygon;
            this.createFixture(fd);
            //this.createFixtureFromShape(polygon, 0.0);
        }

    },
    
    /////////////////////////////////////////////////////////////////
    //Some methods to create collision groups, mask and categories //
    /////////////////////////////////////////////////////////////////
    
    //read as: I AM in this category (use a bits, CATA | CATB)
    
    setCollisionCategory: function(category){
      for (var f = this.data.GetFixtureList(); f; f = f.GetNext())
      {
        //get the existing filter
        filter = f.GetFilterData();
        filter.categoryBits = category;
        f.SetFilterData(filter)
      }
    },
    //
    //read as: I WILL COLLIDE WITH all the categories named in the mask
    //(use a bits, CATA | CATB)
    setCollisionMask: function(mask){
      for (var f = this.data.GetFixtureList(); f; f = f.GetNext())
      {
        //get the existing filter
        filter = f.GetFilterData();
        filter.maskBits = mask;
        f.SetFilterData(filter)
      }
    },

    //these two methods are called by the sample contact listeners
    //uncomment to see the debug drawings change their color during a collision
    startContact: function(){
      if(this.debugBody){
        //this.debugBody.showCollision()
      }
    },
    endContact: function(){
      if(this.debugBody){
        //this.debugBody.hideCollision()
      }
    },
    
    /*
    if either fixture has a groupIndex of zero, use the category/mask rules as above
    if both groupIndex values are non-zero but different, use the category/mask rules as above
    if both groupIndex values are the same and positive, collide
    if both groupIndex values are the same and negative, don't collide
     */
    setCollisionGroup: function(groupIndex){
      for (var f = this.data.GetFixtureList(); f; f = f.GetNext())
      {
        //get the existing filter
        filter = f.GetFilterData();
        filter.groupIndex = groupIndex;
        f.SetFilterData(filter)
      }
    },

    //some testing methods. ignore.
    testEdgeShape: function(){
      this.clearFixtures()

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
    },
    
    testPolygon: function(){
      this.clearFixtures()
      this.loadPolygon('pinball','flipper_right')
      this.debug = true
      this.dynamic = true
    }
}
/**
* @name Phaser.Physics.Box2D.Body#debug
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
* @name Phaser.Physics.Box2D.Body#static
* @property {boolean} static - Returns true if the Body is static. Setting Body.static to 'false' will make it dynamic.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "bullet", {
    
    get: function () {

        return (this.data.GetType() === box2d.b2BodyType.b2_bulletBody);

    },

    set: function (value) {

        if (value && this.data.GetType() !== box2d.b2BodyType.b2_bulletBody)
        {
            this.data.SetType(box2d.b2BodyType.b2_bulletBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.SetType(box2d.b2BodyType.b2_staticBody)
        }
        this.redrawDebug();

    }

});

/**
* @name Phaser.Physics.Box2D.Body#static
* @property {boolean} static - Returns true if the Body is static. Setting Body.static to 'false' will make it dynamic.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "static", {
    
    get: function () {

        return (this.data.GetType() === box2d.b2BodyType.b2_staticBody);

    },

    set: function (value) {

        if (value && this.data.GetType() !== box2d.b2BodyType.b2_staticBody)
        {
            this.data.SetType(box2d.b2BodyType.b2_staticBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.SetType(box2d.b2BodyType.dynamic)
        }
        this.redrawDebug();

    }

});

/**
* @name Phaser.Physics.Box2D.Body#dynamic
* @property {boolean} dynamic - Returns true if the Body is dynamic. Setting Body.dynamic to 'false' will make it static.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "dynamic", {
    
    get: function () {

        return (this.data.GetType() === box2d.b2BodyType.b2_dynamicBody);

    },

    set: function (value) {

        if (value && this.data.GetType() !== box2d.b2BodyType.b2_dynamicBody)
        {
            this.data.SetType(box2d.b2BodyType.b2_dynamicBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.SetType(box2d.b2BodyType.b2_staticBody)
        }
        this.redrawDebug();

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
            this.data.SetType(box2d.b2BodyType.b2_kinematicBody)
        }
        else if (!value && this.data.GetType() === box2d.b2BodyType.b2_staticBody)
        {
            this.data.SetType(box2d.b2BodyType.b2_staticBody)
        }
        this.redrawDebug();

    }

});


/**
* @name Phaser.Physics.Box2D.Body#fixedRotation
* @property {boolean} fixedRotation - 
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "fixedRotation", {
    
    get: function () {

        return this.data.IsFixedRotation();

    },

    set: function (value) {

        if (value !== this.data.IsFixedRotation() )
        {
            this.data.SetFixedRotation(value);
            //  update anything?
        }

    }

});

/**
* @name Phaser.Physics.Box2D.Body#allowSleep
* @property {boolean} allowSleep - 
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "allowSleep", {
    
    get: function () {

        return this.data.IsSleepingAllowed();

    },

    set: function (value) {

        if (value !== this.data.IsSleepingAllowed())
        {
            this.data.SetSleepingAllowed(value);
        }

    }

});



/**
* The angle of the Body in degrees from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement Body.angle = 450 is the same as Body.angle = 90.
* If you wish to work in radians instead of degrees use the property Body.rotation instead. Working in radians is faster as it doesn't have to convert values.
* 
* @name Phaser.Physics.Box2D.Body#angle
* @property {number} angle - The angle of this Body in degrees.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "angle", {

    get: function() {

        return this.data.GetAngleDegrees()

    },

    set: function(value) {
      this.data.SetAngleDegrees(value)
    }

});

/**
* Damping is specified as a value between 0 and 1, which is the proportion of velocity lost per second.
* @name Phaser.Physics.Box2D.Body#angularDamping
* @property {number} angularDamping - The angular damping acting acting on the body.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "angularDamping", {
    
    get: function () {

        return this.data.GetAngularDamping()

    },

    set: function (value) {

        this.data.SetAngularDamping(value)

    }

});


/**
* @name Phaser.Physics.Box2D.Body#angularVelocity
* @property {number} angularVelocity - The angular velocity of the body.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "linearDamping", {
    
    get: function () {

        return this.data.GetLinearDamping();

    },

    set: function (value) {

        this.data.SetLinearDamping(value);

    }

});


/**
* @name Phaser.Physics.Box2D.Body#gravityScale
* @property {boolean} allowSleep - 
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "gravityScale", {
    
    get: function () {

        return this.data.GetGravityScale();

    },

    set: function (value) {

        if (value !== this.data.IsSleepingAllowed())
        {
            this.data.SetGravityScale(value);
        }

    }

});


/**
* @name Phaser.Physics.Box2D.Body#angularVelocity
* @property {number} angularVelocity - The angular velocity of the body.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "angularVelocity", {
    
    get: function () {

        return this.data.GetAngularVelocity();

    },

    set: function (value) {

        this.data.SetAngularVelocity(value);

    }

});

/**
* @name Phaser.Physics.Box2D.Body#angularVelocity
* @property {number} angularVelocity - The angular velocity of the body.
*/
Object.defineProperty(Phaser.Physics.Box2D.Body.prototype, "mass", {
    
    get: function () {

        return this.data.GetMass();

    },

    set: function (value) {
        //doesnt work, only read for now
        //m = new box2d.b2MassData()
        //m.mass = value
        //this.data.SetMassData(value);

    }

});


