Phaser 1.x to 2.0.0 Migration Guide
===================================

There are a number of significant API changes in Phaser 2.0.

The following is a list of the most important, along with a small guide on updating your games to work.

Please also see the Examples as we've updated every single one of them to work with 2.0.

Updated to Pixi.js 1.5
----------------------

This was a big change. Not only did we totally re-vamp the internals of Phaser as a result, we also now intelligently extend Pixi objects.

* Group now extends PIXI.DisplayObjectContainer, rather than owning a _container property, which makes life a whole lot easier re: nesting and child iteration.
* Removed Sprite.group property. You can use Sprite.parent for all similar needs now.
* PIXI.Point is now aliased to Phaser.Point - saves on code duplication and works exactly the same.
* PIXI.Rectangle is now aliased to Phaser.Rectangle - saves on code duplication and works exactly the same.
* PIXI.Circle is now aliased to Phaser.Circle - saves on code duplication and works exactly the same.
* PixiPatch no longer needed, all features that it patched are now native in Pixi :)
* Phaser.Stage now extends PIXI.Stage, rather than containing a _stage object.

Added Phaser.Image
------------------

A Phaser Image is like a Sprite, but it doesn't have any animation or physics capabilities. Use it for logos, backgrounds, etc.

* Button now extends Phaser.Image not Phaser.Sprite, all the same functionality as before remains, just no animations or physics body.

Stage updates
-------------

Stage has been updated a lot and the Scale Manager has moved as well.

* Stage.scale has been moved to Game.scale. The same game scaling properties exist as before, but now accessed via Game.scale instead.
* Stage.aspectRatio has been moved to StageScaleMode.sourceAspectRatio (so now game.scale.sourceAspectRatio)
* Stage.scaleMode has been moved to StageScaleMode.scaleMode (so now game.scale.scaleMode)
* Stage.fullScreenScaleMode has been moved to StageScaleMode.fullScreenScaleMode (so now game.scale.fullScreenScaleMode)
* Stage.canvas has been moved to Game.canvas (which used to be a reference to Stage.canvas, but is now the actual object).
* World preUpdate, update and postUpdate have all been moved to Stage. So all children are updated regardless where on the display list they live.
* Phaser.StageScaleMode has been renamed to ScaleManager and moved from the system folder to the core folder. It's still available under game.scale.
* If your game references the old Phaser.StageScaleMode consts like SHOW_ALL you need to update them to Phaser.ScaleManager, i.e. Phaser.ScaleManager.SHOW_ALL.

Changes to Phaser.Sprite
------------------------

* Sprite.crop() now takes a Phaser.Rectangle instead of explicit parameters.
* By default Sprites no longer check if they are within the world bounds. It's quite an expensive process (calling getBounds every frame), so you have to enable directly.
* Sprite.deltaX and deltaY swapped to functions: Sprite.deltaX() and Sprite.deltaY()
* Removed: Sprite.offset, center, topLeft, topRight, bottomRight, bottomLeft and bounds, as no longer needed internally. Use Sprite.getBounds() to derive them.
* Sprite.input.pixelPerfect has been split into two: Sprite.input.pixelPerfectClick and Sprite.input.pixelPerfectOver (see new features)
* If you set Sprite.exists to false it will also set Sprite.visible to false and remove its body from the physics world (if it has one).
* If you set Sprite.exists to true it will also set Sprite.visible to true and add its body back into the physics world (if it has one).
* Phaser.Animation.frame now returns the frame of the current animation, rather than the global frame from the sprite sheet / atlas.
* Sprite.damage will now kill the Sprite if health is less than or equal to 0 (before it would only kill if less than zero)
* Sprite.worldCenterX and Sprite.worldCenterY are replaced by Sprite.world.x and Sprite.world.y

Better Text Handling
--------------------

* Text.content has been replaced with Text.text. The Text class has a lot of new methods, check the docs!
* BitmapText has had a bit of an overhaul - the signature for adding a BitmapText has changed to: x, y, font, text, size. See the docs and examples for details.

Input Changes
-------------

* The Keyboard class has had a complete overhaul. Phaser.Key objects are created automatically, there are fixes against duration and keys reset properly on visibility loss.
* Keyboard.removeKey has been removed. The way the new keyboard manager works means it's no longer required.
* When a game un-pauses (from a visibility loss) it resets all Input components.

Game and Group Updates
----------------------

* Game no longer pauses if you've forced orientation and change it, also doesn't resize a NO_SCALE game.
* When adding a Group if the parent value is `null` the Group won't be added to the World, so you can add it when ready. If parent is `undefined` it's added by default.
* In Group.destroy the default for 'destroyChildren' was false. It's now `true` as this is a far more likely requirement when destroying a Group.
* RandomDataGenerator is now started on Game creation instead of boot. You can pass a seed array in the game config object (feature request #547)

Tilemap Changes
---------------

* If using P2, after defining tiles that collide on a Tilemap, you need to call Tilemap.generateCollisionData(layer) to populate the physics world with the data required.

Time Changes
------------

* Time.advancedTiming is a new boolean property. If true Time.fps, fpsMin, fpsMax, frames, msMin and msMax will be calculated, otherwise they remain at their defaults.
* Time.physicsElapsed is no longer bound or clamped, be wary of this if you use the value anywhere in your code.

Misc Changes
------------

* All the Debug methods have had the word 'render' removed from the start. So where you did `debug.renderSpriteInfo` before, it's now just `debug.spriteInfo`.
* Debug methods that rendered geometry (Rectangle, Circle, Line, Point) have been merged into the single method: `Debug.geom`.
* Loader won't set crossOrigin on  Images unless it's set to something. The default is false, it used to be '' and can be any valid string.
* BitmapData.addTo removed and enhanced BitmapData.add so it can accept either a single Sprite/Image or an Array of them.
* BitmapData has had all of the EaselJS functions removed. It was just taking up space and you can do it all via BitmapData.context directly.
* Cache.getImageKeys and similar has been removed, please use Cache.getKeys(Phaser.Cache.IMAGE) instead, this now supports all 10 Cache data types.
* Phaser.QuadTree has been made more generic and works with any rectangle, not just physics bodies.
* Animation.looped has been renamed to Animation.loop. It's a boolean you can toggle at run-time to turn on/off animation looping.

Multiple Physics Systems
------------------------

In Phaser 1.x all you had was the Arcade Physics system. Under 2.x you can now have any physics system you like, and we include the awesome full-body P2.JS, Arcade Physics and Ninja Physics as standard, with Box2D and Chipmunk on the way.

p2.js is excellent, offering lots of powerful features. However on mobile it doesn't take long before the frame rate starts to dive. This is no fault of p2, it's having to do a lot of heavy lifting math and mobiles just struggle. Even with just 50 bodies in the scene you can see it start to suffer. So I wanted to offer an option to devs.
 
In Phaser 2 no Sprites have physics bodies as standard, they all need to be physics enabled (much in the same way you enable them for input). This helps keep things fast. Where-as in 1.x Phaser was spending a lot of time processing a physics Body it may never even use.
 
Arcade Physics, back from the dead
----------------------------------
 
So we decided to go back and resurrect Arcade Physics. Not the broken SAT one in 1.1.4, but the one previous to that. We merged lots of the fixes made in 1.1.4 (things like process callbacks actually working properly) with the previously working separation code from 1.1.3. This means that existing 'old' games won't have to be ported over to p2 to run, they can just use Arcade Physics like before - the only difference being they'll need to enable the Sprite bodies. All those annoying/broken things about 1.1.4, like the way gravity and velocity are messed-up, are all fixed.
 
Because physics is 'off' by default we created a Physics Manager via which you do things like 'enable p2' or 'add a physics body to this sprite'. You can actually have p2 and Arcade physics running together in the same game. p2 could be controlling whatever bodies you give it, and arcade the same.
 
Here is how you activate the physics systems:

`game.physics.startSystem(Phaser.Physics.ARCADE);`
`game.physics.startSystem(Phaser.Physics.P2JS);`
`game.physics.startSystem(Phaser.Physics.NINJA);`

The important thing to remember is that a single Sprite can only belong to ONE physics system. So you can enable a Sprite for p2 or arcade - but never more than one. It cannot exist in multiple simulations at once.
 
Here is how you enable a Sprite for say Ninja physics. You can do it directly on the system like so (here creating a new Circle shape):

`game.physics.ninja.enableCircle(sprite, radius);`

Or you can use the physics manager interface (this will create an AABB shape for the sprite, the default):

`game.physics.enable(sprite, Phaser.Physics.NINJA);`

In 'enable' calls you can pass in either a single object, a Group or a whole array of them.
 
p2 and Arcade running together
------------------------------
 
Why on earth might you want to have both running? Well for a lot of games I would say there is what you could call 'simple' and 'advanced' requirements. For example you could have a nice complex polygon terrain all handled by p2, with a car body with  motors / constraints / springs driving happily across it.
 
But what if you wanted that car to be able to fire up to shoot some aliens overhead? Assuming you can fit those aliens into clean AABB shapes then it's now entirely possible to have the car itself controlled by p2, driving over a p2 managed landscape, but when you shoot it launches a stream of bullets managed entirely by Arcade Physics, and collision with the aliens who are all running under Arcade Physics too. In short you're leaving p2 to deal with just a handful of complex bodies and motion and not bogging it down with ultra simple requirements.
 
I'm not suggesting that all games will need this, but at least you have the option now.
 
Great, but what the hell is Ninja Physics?
------------------------------------------
 
While renaming these classes I remembered that I had spent weeks about a year ago working through the physics system that Metanet Software used in their awesome N+ Flash ninja games and porting it to JavaScript. I had shelved it as it was only suitable for certain types of games and didn't play well with Arcade Physics settings (at the time I was trying to merge some of their collision responses with Arcade Physics). But I dug out the old source files and had a look, and sure enough it was pretty much complete. So to test out my theory of Phaser supporting a variety of physics systems I created Ninja Physics from it, and integrated it.
 
It's a really nice little physics system, supporting AABB and Circle vs. Tile collision, with lots of defs for sloping, convex and concave tile types. But that's all it does, it's not trying to be anything more really. As you'll see from my the examples it works well, and is really quite fast on mobile too.
 
Which one do I use?!
--------------------
 
I've no idea, it depends on your game :) The choice is yours. If you need full-body physics, then p2 obviously. Arcade Physics has proven successful in lots of games so far, so you could carry on using that too. Or maybe if you like what you see re: Ninja's tiles, you could test that out. The important thing is that it's up to you now, and although it requires more careful planning with your game, you can even combine them too.
 
Phaser doesn't have all of these physics systems running together wasting CPU, they all start off as 'null' objects and do nothing until explicitly activated. I'm also tweaking the grunt scripts so that the build folder will provide versions of phaser with none, one or all physics systems embedded into the code, so they're not going to waste space either. The plan is to carry on adding support for popular physics systems in, most importantly Box2D and Chipmunk. Again these will be separate libs you can bundle in with phaser, with just a single variable stub in the physics manager. As long as the Body and World objects adhere to a few simple requirements, it will 'just work'.
 
