# Phaser 3 Development Roadmap

The following is a list of all the key areas of the Phaser 2 API, and how they'll map to the Phaser 3 API.

## Animation

V2:

Animation Manager
Animation Parser
Animation Class
FrameData
Frame Class
Creature run-times libs

V3:

The Texture Manager now handles all Texture parsing. It splits up Texture Atlases, creates Frame objects and handles Frame functions like Crop.

TODO: 

* Define the format and API calls that Animations will take in Phaser 3, and decide upon if we require a 'central' Animation registry, rather than creating them multiple times, per Sprite instance.

* Decide if the Creature libs can still be supported.

## Camera

V2:

The Camera was essentially a Rectangle object with some special commands, to allow for Camera effects (shake, flash) and the tracking of Game Objects. It could never properly handle rotation or scaling.

V3:

The Camera is now a display level object with its own Transform, allowing you to rotate and scale, and have it update the scene correctly.

TODO:

* Camera effects (fade, flash)
* Camera follow / target

Filter

Group

Plugins

Scale Manager

Signals

Stage

State Manager

World

Game Objects

BitmapData
BitmapText
Button
Creature
Graphics
Image
Particle
RenderTexture
RetroFont
Rope
Sprite
SpriteBatch
Text
TileSprite
Video

Geometry

Circle
Ellipse
Hermite
Line
Matrix
Point
Polygon
Rectangle
RoundedRectangle

Input

Input Manager
Keyboard + Key
Mouse
MSPointer
Touch
Pointer
Gamepad

Loader

Cache

Math
Math functions
QuadTree
Random Data Generator

Net

Particles
Arcade Physics Emitter + Particle

Physics
Arcade Physics
Ninja Physics
P2 Physics

Renderer

Canvas
Graphics Primitives
Canvas Tint

WebGL
RenderTextures
Sprite Batch
Filters
Graphics Primitives

Sound
Sound Manager
Sound
AudioSprite

Tilemap
Tilemap class
Tilemap Layer
Tileset
Tile
ImageCollection

Time
Master Time
Timer
TimerEvent

Tween
Tween Manager
Tween + TweenData
Easing functions

Utils
ArraySet
ArrayUtils
Canvas Utils
Canvas Pool
Color
Debug
Device
DOM
EarCut
LinkedList
RequestAnimationFrame
Generic Utils


