var Matter = require('../../CustomMain');

var MatterCollisionEvents = {
  name: 'matter-collision-events',
  version: '0.1.5',
  for: 'matter-js@^0.14.2',
  silent: true, // no console log please

  install: function(matter) {
    // add the onCollide, onCollideEnd, and onCollideActive callback handlers
    // to the native Matter.Body created
    var create = matter.Body.create;
    matter.Body.create = function() {
      var body = create.apply(null, arguments);
      body.onCollide = function(cb) { body._mceOC = cb; }
      body.onCollideEnd = function(cb) { body._mceOCE = cb; }
      body.onCollideActive = function(cb) { body._mceOCA = cb; }
      return body;
    }
    matter.after('Engine.create', function() {
      matter.Events.on(this, 'collisionStart', function(event) {
        event.pairs.map(function(pair) {
          matter.Events.trigger(pair.bodyA, 'onCollide', { pair : pair });
          matter.Events.trigger(pair.bodyB, 'onCollide', { pair : pair });
          pair.bodyA._mceOC &&
            pair.bodyA._mceOC(pair)
          pair.bodyB._mceOC &&
            pair.bodyB._mceOC(pair)
        });
      });

      matter.Events.on(this, 'collisionActive', function(event) {
        event.pairs.map(function(pair) {
          matter.Events.trigger(
            pair.bodyA,
            'onCollideActive',
            { pair: pair }
          );
          matter.Events.trigger(
            pair.bodyB,
            'onCollideActive',
            { pair: pair }
          );
          pair.bodyA._mceOCA &&
            pair.bodyA._mceOCA(pair)
          pair.bodyB._mceOCA &&
            pair.bodyB._mceOCA(pair)
        });
      });

      matter.Events.on(this, 'collisionEnd', function(event) {
        event.pairs.map(function(pair) {
          matter.Events.trigger(pair.bodyA, 'onCollideEnd', { pair : pair });
          matter.Events.trigger(pair.bodyB, 'onCollideEnd', { pair : pair });
          pair.bodyA._mceOCE &&
            pair.bodyA._mceOCE(pair)
          pair.bodyB._mceOCE &&
            pair.bodyB._mceOCE(pair)
        });
      });
    });
  }
};

module.exports = MatterCollisionEvents;
