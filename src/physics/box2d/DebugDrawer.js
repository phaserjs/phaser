Phaser.Physics.Box2D.DebugDrawer = function(options) {
  box2d.b2Draw.call(this);
  this.init(options);
}

Phaser.Physics.Box2D.DebugDrawer.prototype = Object.create(box2d.b2Draw.prototype)
Phaser.Physics.Box2D.DebugDrawer.prototype.constructor = Phaser.Physics.Box2D.DebugDrawer

Phaser.Utils.extend(Phaser.Physics.Box2D.DebugDrawer.prototype, {
    init: function(graphics, options){
      defaultDrawingOptions = {
        drawShapes: true,
        drawJoints: true,
        drawAABBs: false,
        drawMassCenter: false,
        drawControllers: false
      }
      this.graphics = graphics
      this.drawingOptions = Phaser.Utils.extend(defaultDrawingOptions, options);
      this.updateFlags();
    },

    //update internal drawing flags
    updateFlags: function(){
      flags = box2d.b2DrawFlags.e_none;
      if(this.drawingOptions.drawShapes){
        flags |= box2d.b2DrawFlags.e_shapeBit
      }
        
      if (this.drawingOptions.drawJoints){
        flags |= box2d.b2DrawFlags.e_jointBit 
      }
        
      if (this.drawingOptions.drawAABBs ){
        flags |= box2d.b2DrawFlags.e_aabbBit 
      }
        
      if (this.drawingOptions.drawMassCenter){
        flags |= box2d.b2DrawFlags.e_centerOfMassBit 
      }
        
      if (this.drawingOptions.drawControllers ){
        flags |= box2d.b2DrawFlags.e_controllerBit 
      }
      this.SetFlags(flags);
    },
    PopTransform: function(xf){

    },
    PushTransform: function(xf){

    },
    DrawSolidCircle: function(center, radius, axis, color){
      return
      
      g = this.graphics
      g.beginFill(0xFF3300);
      g.lineStyle(10, 0xffd900, 1);

      var r = Phaser.Physics.Box2D.Utils.b2px(radius)
      var x = Phaser.Physics.Box2D.Utils.b2px(center.x)
      var y = Phaser.Physics.Box2D.Utils.b2px(center.y)
      g.drawCircle(x, y,r);
      g.endFill();
    }
})