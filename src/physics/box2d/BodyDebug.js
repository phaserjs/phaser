/**
* @author       George https://github.com/georgiee
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Draws a P2 Body to a Graphics instance for visual debugging.
* Needless to say, for every body you enable debug drawing on, you are adding processor and graphical overhead.
* So use sparingly and rarely (if ever) in production code.
*
* @class Phaser.Physics.Box2D.BodyDebug
* @classdesc Physics Body Debug Constructor
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Physics.P2.Body} body - The P2 Body to display debug data for.
* @param {object} settings - Settings object.
*/
Phaser.Physics.Box2D.BodyDebug = function(game, body, settings) {

    Phaser.Group.call(this, game);

    /**
    * @property {object} defaultSettings - Default debug settings.
    * @private
    */
    defaultSettings = {
        pixelsPerLengthUnit: 30,
        debugPolygons: false,
        lineWidth: 1,
        alpha: 0.5
    }

    this.settings = Phaser.Utils.extend(defaultSettings, settings);

    /**
    * @property {number} ppu - Pixels per Length Unit.
    */
    this.ppu = this.settings.pixelsPerLengthUnit;
    this.ppu = -1 * this.ppu;

    /**
    * @property {Phaser.Physics.P2.Body} body - The P2 Body to display debug data for.
    */
    this.body = body;

    /**
    * @property {Phaser.Graphics} canvas - The canvas to render the debug info to.
    */
    this.canvas = new Phaser.Graphics(game);

    this.canvas.alpha = this.settings.alpha
    this.awake = true
    this.add(this.canvas);
    this.draw();
}

Phaser.Physics.Box2D.BodyDebug.prototype = Object.create(Phaser.Group.prototype)
Phaser.Physics.Box2D.BodyDebug.prototype.constructor = Phaser.Physics.Box2D.BodyDebug

Phaser.Utils.extend(Phaser.Physics.Box2D.BodyDebug.prototype, {

    /**
    * Core update.
    *
    * @method Phaser.Physics.Box2D.BodyDebug#update
    */
    update: function() {

        this.updateSpriteTransform()
        this.updateAwakeState()
    },
    updateAwakeState: function(){
      awake = this.body.IsAwake()
      
      if(awake != this.awake){
        this.awake = awake
        console.log('new awake state', awake)
        this.draw()
      }
    },

    /**
    * Core update.
    *
    * @method Phaser.Physics.Box2D.BodyDebug#updateSpriteTransform
    */
    updateSpriteTransform: function() {
        if(!this.body) { return }
        position = this.body.GetPosition()

        this.position.x = Phaser.Physics.Box2D.Utils.b2px(position.x)
        this.position.y = Phaser.Physics.Box2D.Utils.b2pxi(position.y);

        this.rotation = - this.body.GetAngleRadians();
    },

    /**
    * Draws the P2 shapes to the Graphics object.
    *
    * @method Phaser.Physics.Box2D.BodyDebug#draw
    */
    draw: function() {
      var b = this.body
      var color;
      var transform = b.m_xf;


      sprite = this.canvas.clear();

      for (var f = b.GetFixtureList(); f; f = f.m_next)
      {
        if (b.IsActive() === false)
        {
          color = 0x333333
          this.drawShape(f, color);
        }
        else if (b.GetType() === box2d.b2BodyType.b2_staticBody)
        {
          color = 0x00ff00
          this.drawShape(f, color);
        }
        else if (b.GetType() === box2d.b2BodyType.b2_kinematicBody)
        {
          color = 0x0000ff
          this.drawShape(f, color);
        }
        else if (b.IsAwake() === false)
        {
          color = 0xaaaaaa
          this.drawShape(f, color);
        }
        else //b2_dynamicBody
        {
          color = 0xffff00
          this.drawShape(f, color);
        }
      }
    },
    
    drawShape: function (fixture, color){
      sprite = this.canvas;
      
      lineColor = 0xff0000;
      lw = this.lineWidth || 1;

      var shape = fixture.GetShape();
      
      switch (shape.m_type)
      {
        case box2d.b2ShapeType.e_circleShape:
          {
            var circle = ((shape instanceof box2d.b2CircleShape ? shape : null));
            var center = circle.m_p;
            var radius = circle.m_radius;
            var axis = box2d.b2Vec2.UNITX;
            var angle = box2d.b2Vec2.UNITX;

            this.drawCircle(sprite,Phaser.Physics.Box2D.Utils.b2px(center.x), Phaser.Physics.Box2D.Utils.b2pxi(center.y), 0, radius * this.ppu, color, lw);
          }
          break;

        case box2d.b2ShapeType.e_edgeShape:
          {
            var edge = ((shape instanceof box2d.b2EdgeShape ? shape : null));
            var v1 = edge.m_vertex1;
            var v2 = edge.m_vertex2;
            
            x0 = Phaser.Physics.Box2D.Utils.b2px(v1.x);
            y0 = Phaser.Physics.Box2D.Utils.b2pxi(v1.y);
            x1 = Phaser.Physics.Box2D.Utils.b2px(v2.x);
            y1 = Phaser.Physics.Box2D.Utils.b2pxi(v2.y);
            
            this.drawSegment(sprite, x0, y0, x1, y1, color, lw);
          }
          break;
        
        case box2d.b2ShapeType.e_polygonShape:
          {
            var poly = ((shape instanceof box2d.b2PolygonShape ? shape : null));
            var vertexCount = poly.m_count;
            var vertices = poly.m_vertices;

            if(false){
              
            }else{
              this.drawConvex(sprite, vertices, vertexCount, 0,0, color);
              this.drawConvexSolid(sprite, vertices, vertexCount, 0,0, color);
            }
            
          }
          break;
      }
    },
    /**
    * Draws a P2 Convex shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawConvex
    */
    drawConvex: function(g, verts, vertsCount, offsetX, offsetY, color) {

        var colors, i, v, v0, v1, x, x0, x1, y, y0, y1;

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        
        colors = [0xff0000, 0x00ff00, 0x0000ff];
        i = 0;
        while (i !== vertsCount + 1)
        {
            v0 = verts[i % vertsCount];
            v1 = verts[(i + 1) % vertsCount];
            x0 = Phaser.Physics.Box2D.Utils.b2px(v0.x);
            y0 = Phaser.Physics.Box2D.Utils.b2pxi(v0.y);
            x1 = Phaser.Physics.Box2D.Utils.b2px(v1.x);
            y1 = Phaser.Physics.Box2D.Utils.b2pxi(v1.y);
            
            g.lineStyle(lineWidth, colors[i % colors.length], 1);
            g.moveTo(x0, y0);
            g.lineTo(x1, y1);
            g.drawCircle(x0, y0, lineWidth * 2);
            i++;
        }

        g.lineStyle(lineWidth, 0x000000, 1);
        g.drawCircle(offsetX, offsetY, lineWidth * 2);
    
    
    },
    drawConvexSolid: function(g, verts, vertsCount, offsetX, offsetY, color) {
      //use vertsCount as verts is larger than the real existing verts
      if (typeof lineWidth === 'undefined') { lineWidth = 1; }
      
      g.lineStyle(lineWidth, 0x00ff00, 1);
      g.beginFill(color);
      var i = 0;

      while (i !== vertsCount)
      {
          v = verts[i];
          x = Phaser.Physics.Box2D.Utils.b2px(v.x);
          y = Phaser.Physics.Box2D.Utils.b2pxi(v.y);

          if (i === 0)
          {
              g.moveTo(x, y);
          }
          else
          {
              g.lineTo(x, y);
          }

          i++;
      }

      g.endFill();

      if (vertsCount > 2)
      {
          v1 = verts[vertsCount - 1];
          x1 = Phaser.Physics.Box2D.Utils.b2px(v1.x);
          y1 = Phaser.Physics.Box2D.Utils.b2pxi(v1.y);
          
          v2 = verts[0];
          x2 = Phaser.Physics.Box2D.Utils.b2px(v2.x);
          y2 = Phaser.Physics.Box2D.Utils.b2pxi(v2.y);

          g.moveTo(x1,y1);
          g.lineTo(x2,y2);
      }
    },
    
    drawCircle: function(g, x, y, angle, radius, color, lineWidth){
      if (typeof lineWidth === 'undefined') { lineWidth = 1; }
      if (typeof color === 'undefined') { color = 0xffffff; }

      g.lineStyle(lineWidth, 0x000000, 1);
      g.beginFill(color, 1.0);
      g.drawCircle(x, y, -radius);
      g.endFill();
      g.moveTo(x, y);
      g.lineTo(x + radius * Math.cos(-angle), y + radius * Math.sin(-angle));
    },

    drawSegment: function(g, x0, y0, x1, y1, color, lineWidth){
      if (typeof lineWidth === 'undefined') { lineWidth = 1; }
      g.lineStyle(lineWidth, 0x00ff00, 1);
      g.moveTo(x0,y0);
      //console.log(x0,y0, '--',x1,y1)
      g.lineTo(x1,y1);
    }
      
})