/// <reference path="Phaser.ts" />
/// <reference path="Statics.ts" />

/// <reference path="geom/Point.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Circle.ts" />
/// <reference path="geom/Line.ts" />

/// <reference path="math/GameMath.ts" />
/// <reference path="math/Vec2.ts" />
/// <reference path="math/Vec2Utils.ts" />
/// <reference path="math/Mat3.ts" />
/// <reference path="math/Mat3Utils.ts" />
/// <reference path="math/QuadTree.ts" />
/// <reference path="math/LinkedList.ts" />
/// <reference path="math/RandomDataGenerator.ts" />

/// <reference path="core/Plugin.ts" />
/// <reference path="core/PluginManager.ts" />
/// <reference path="core/Signal.ts" />
/// <reference path="core/SignalBinding.ts" />
/// <reference path="core/Group.ts" />

/// <reference path="cameras/Camera.ts" />
/// <reference path="cameras/CameraManager.ts" />

/// <reference path="display/CSS3Filters.ts" />
/// <reference path="display/DynamicTexture.ts" />
/// <reference path="display/Texture.ts" />

/// <reference path="tweens/easing/Back.ts" />
/// <reference path="tweens/easing/Bounce.ts" />
/// <reference path="tweens/easing/Circular.ts" />
/// <reference path="tweens/easing/Cubic.ts" />
/// <reference path="tweens/easing/Elastic.ts" />
/// <reference path="tweens/easing/Exponential.ts" />
/// <reference path="tweens/easing/Linear.ts" />
/// <reference path="tweens/easing/Quadratic.ts" />
/// <reference path="tweens/easing/Quartic.ts" />
/// <reference path="tweens/easing/Quintic.ts" />
/// <reference path="tweens/easing/Sinusoidal.ts" />
/// <reference path="tweens/Tween.ts" />
/// <reference path="tweens/TweenManager.ts" />

/// <reference path="time/TimeManager.ts" />

/// <reference path="net/Net.ts" />

/// <reference path="input/Keyboard.ts" />
/// <reference path="input/Mouse.ts" />
/// <reference path="input/MSPointer.ts" />
/// <reference path="input/Touch.ts" />
/// <reference path="input/Pointer.ts" />
/// <reference path="input/InputHandler.ts" />
/// <reference path="input/InputManager.ts" />

/// <reference path="system/Device.ts" />
/// <reference path="system/RequestAnimationFrame.ts" />
/// <reference path="system/StageScaleMode.ts" />

/// <reference path="system/screens/BootScreen.ts" />
/// <reference path="system/screens/OrientationScreen.ts" />
/// <reference path="system/screens/PauseScreen.ts" />

/// <reference path="sound/SoundManager.ts" />
/// <reference path="sound/Sound.ts" />

/// <reference path="animation/Animation.ts" />
/// <reference path="animation/AnimationManager.ts" />
/// <reference path="animation/Frame.ts" />
/// <reference path="animation/FrameData.ts" />

/// <reference path="loader/Cache.ts" />
/// <reference path="loader/Loader.ts" />
/// <reference path="loader/AnimationLoader.ts" />

/// <reference path="tilemap/Tile.ts" />
/// <reference path="tilemap/Tilemap.ts" />
/// <reference path="tilemap/TilemapLayer.ts" />

/// <reference path="physics/PhysicsManager.ts" />
/// <reference path="physics/Body.ts" />
/// <reference path="physics/AABB.ts" />
/// <reference path="physics/Circle.ts" />
/// <reference path="physics/TileMapCell.ts" />

/// <reference path="physics/aabb/ProjAABB22Deg.ts" />
/// <reference path="physics/aabb/ProjAABB45Deg.ts" />
/// <reference path="physics/aabb/ProjAABB67Deg.ts" />
/// <reference path="physics/aabb/ProjAABBConcave.ts" />
/// <reference path="physics/aabb/ProjAABBConvex.ts" />
/// <reference path="physics/aabb/ProjAABBFull.ts" />
/// <reference path="physics/aabb/ProjAABBHalf.ts" />

/// <reference path="physics/circle/ProjCircle22Deg.ts" />
/// <reference path="physics/circle/ProjCircle45Deg.ts" />
/// <reference path="physics/circle/ProjCircle67Deg.ts" />
/// <reference path="physics/circle/ProjCircleConcave.ts" />
/// <reference path="physics/circle/ProjCircleConvex.ts" />
/// <reference path="physics/circle/ProjCircleFull.ts" />
/// <reference path="physics/circle/ProjCircleHalf.ts" />

/// <reference path="gameobjects/Events.ts" />
/// <reference path="gameobjects/Sprite.ts" />
/// <reference path="gameobjects/TransformManager.ts" />
/// <reference path="gameobjects/ScrollRegion.ts" />
/// <reference path="gameobjects/ScrollZone.ts" />
/// <reference path="gameobjects/IGameObject.ts" />
/// <reference path="gameobjects/GameObjectFactory.ts" />

/// <reference path="ui/Button.ts" />

/// <reference path="utils/CanvasUtils.ts" />
/// <reference path="utils/CircleUtils.ts" />
/// <reference path="utils/ColorUtils.ts" />
/// <reference path="utils/PointUtils.ts" />
/// <reference path="utils/RectangleUtils.ts" />
/// <reference path="utils/SpriteUtils.ts" />
/// <reference path="utils/DebugUtils.ts" />

/// <reference path="renderers/IRenderer.ts" />
/// <reference path="renderers/HeadlessRenderer.ts" />
/// <reference path="renderers/canvas/CameraRenderer.ts" />
/// <reference path="renderers/canvas/GeometryRenderer.ts" />
/// <reference path="renderers/canvas/GroupRenderer.ts" />
/// <reference path="renderers/canvas/ScrollZoneRenderer.ts" />
/// <reference path="renderers/canvas/SpriteRenderer.ts" />
/// <reference path="renderers/canvas/TilemapRenderer.ts" />
/// <reference path="renderers/canvas/CanvasRenderer.ts" />

/// <reference path="particles/ParticleManager.ts" />
/// <reference path="particles/Particle.ts" />
/// <reference path="particles/Emitter.ts" />
/// <reference path="particles/ParticlePool.ts" />
/// <reference path="particles/ParticleUtils.ts" />
/// <reference path="particles/Polar2D.ts" />
/// <reference path="particles/Span.ts" />
/// <reference path="particles/NumericalIntegration.ts" />
/// <reference path="particles/behaviours/Behaviour.ts" />
/// <reference path="particles/behaviours/RandomDrift.ts" />
/// <reference path="particles/initialize/Initialize.ts" />
/// <reference path="particles/initialize/Life.ts" />
/// <reference path="particles/initialize/Mass.ts" />
/// <reference path="particles/initialize/Position.ts" />
/// <reference path="particles/initialize/Rate.ts" />
/// <reference path="particles/initialize/Velocity.ts" />
/// <reference path="particles/zone/Zone.ts" />
/// <reference path="particles/zone/PointZone.ts" />

/// <reference path="World.ts" />
/// <reference path="Stage.ts" />
/// <reference path="State.ts" />
/// <reference path="Game.ts" />
