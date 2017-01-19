# Phaser 3 Ideas and To Dos

TODO
----

Upgrade to Webpack 2 final release
Stop the build script from _moving_ the build file into Examples, and just copy it :)

General
-------

Add a Registry -  a game level Data component, accessible from any State.

Look at adding events to the Data component, so you can be notified about changes to objects stored within it.

Rename ParticleRenderer to BlitterBatch.


Arcade Physics
--------------

Idea: Collision Groups.

Allowing you to do Group vs. Group collisions without them needing to be in the same _display_ oriented Group. Also Collision Groups could have properties, like custom callbacks, or the ability to do things to children such as remove them from the Group, or auto-kill on collision, or be for overlap checks only.

Conditional checks would be handy, so you can say: If Sprite A overlaps with Sprite B AND collides with Sprite C then callback. Perhaps possible via Group chaining.


Shape Container
---------------

A special display-list container that can take any Phaser Geometry object, and combine it with a texture (or color / gradient) and allow you to render it in your game, without needing to use a Graphics object or similar. Would be pretty intensive re: rendering, but that could be covered in the docs. Lots of people ask why they can't add a Phaser.Rectangle to the display list, and this would solve that.


Timeline
--------

Tweens work great, but aren't very flexible, and a frame based Timeline object would be much more useful. Would allow you to set events to occur on specific frames on the timeline, to adjust and read the playhead, to go in reverse, to apply custom easing to sections of the timeline, etc. Much like the Flash timeline really, but code based and quick to create (and small enough to be used lots without a big overhead)

