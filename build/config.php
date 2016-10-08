<?php
    if (!isset($path)) { $path = '..'; }

    if (!isset($modules))
    {
        $modules = array(
            'keyboard' => true,
            'gamepad' => true,
            'bitmapdata' => true,
            'graphics' => true,
            'rendertexture' => true,
            'text' => true,
            'bitmaptext' => true,
            'retrofont' => true,
            'tweens' => true,
            'sound' => true,
            'particles' => true,
            'debug' => true,
            'tilemap' => true,
            'arcade' => true,
            'p2' => true,
            'ninja' => false,
            'box2d' => false,
            'creature' => false,
            'video' => true,
            'rope' => true,
            'tilesprite' => true
        );
    }

    if ($modules['creature'])
    {
        echo "    <script src=\"$path/src/animation/creature/gl-matrix.js\"></script>";
        echo "    <script src=\"$path/src/animation/creature/CreatureMeshBone.js\"></script>";
    }

    if ($modules['p2'])
    {
        echo "    <script src=\"$path/src/physics/p2/p2.js\"></script>";
    }

    if ($modules['box2d'] && isset($box2dpath))
    {
        echo "    <script src=\"$box2dpath/box2d-html5.js\"></script>";
    }

    echo <<<EOL

EOL;

    //  Phaser Global
    echo <<<EOL

    <script src="$path/src/Phaser.js"></script>
    <script src="$path/src/polyfills.js"></script>

    <script src="$path/src/pixi/display/DisplayObject.js"></script>
    <script src="$path/src/pixi/display/DisplayObjectContainer.js"></script>
    <script src="$path/src/pixi/display/Sprite.js"></script>
    <script src="$path/src/pixi/renderers/canvas/utils/CanvasBuffer.js"></script>
    <script src="$path/src/pixi/textures/BaseTexture.js"></script>
    <script src="$path/src/pixi/textures/Texture.js"></script>

    <script src="$path/src/utils/Utils.js"></script>
    <script src="$path/src/utils/CanvasPool.js"></script>

    <script src="$path/src/geom/Circle.js"></script>
    <script src="$path/src/geom/Ellipse.js"></script>
    <script src="$path/src/geom/Hermite.js"></script>
    <script src="$path/src/geom/Line.js"></script>
    <script src="$path/src/geom/Matrix.js"></script>
    <script src="$path/src/geom/Point.js"></script>
    <script src="$path/src/geom/Polygon.js"></script>
    <script src="$path/src/geom/Rectangle.js"></script>
    <script src="$path/src/geom/RoundedRectangle.js"></script>

    <script src="$path/src/core/Camera.js"></script>
    <script src="$path/src/core/Create.js"></script>
    <script src="$path/src/core/State.js"></script>
    <script src="$path/src/core/StateManager.js"></script>
    <script src="$path/src/core/Signal.js"></script>
    <script src="$path/src/core/SignalBinding.js"></script>
    <script src="$path/src/core/Filter.js"></script>
    <script src="$path/src/core/Plugin.js"></script>
    <script src="$path/src/core/PluginManager.js"></script>
    <script src="$path/src/core/Group.js"></script>
    <script src="$path/src/core/World.js"></script>
    <script src="$path/src/core/FlexGrid.js"></script>
    <script src="$path/src/core/FlexLayer.js"></script>
    <script src="$path/src/core/ScaleManager.js"></script>
    <script src="$path/src/core/Game.js"></script>

    <script src="$path/src/input/Input.js"></script>
    <script src="$path/src/input/Mouse.js"></script>
    <script src="$path/src/input/MSPointer.js"></script>
    <script src="$path/src/input/DeviceButton.js"></script>
    <script src="$path/src/input/Pointer.js"></script>
    <script src="$path/src/input/Touch.js"></script>
    <script src="$path/src/input/InputHandler.js"></script>

    <script src="$path/src/textures/TextureManager.js"></script>
    <script src="$path/src/textures/Texture.js"></script>
    <script src="$path/src/textures/TextureSource.js"></script>
    <script src="$path/src/textures/Frame.js"></script>
    <script src="$path/src/textures/parsers/Image.js"></script>
    <script src="$path/src/textures/parsers/Canvas.js"></script>
    <script src="$path/src/textures/parsers/JSONArray.js"></script>
    <script src="$path/src/textures/parsers/JSONHash.js"></script>
    <script src="$path/src/textures/parsers/SpriteSheet.js"></script>

EOL;

    if ($modules['keyboard'])
    {
        echo <<<EOL
    <script src="$path/src/input/Key.js"></script>
    <script src="$path/src/input/Keyboard.js"></script>


EOL;
    }

    if ($modules['gamepad'])
    {
        echo <<<EOL
    <script src="$path/src/input/Gamepad.js"></script>
    <script src="$path/src/input/SinglePad.js"></script>


EOL;
    }

    echo <<<EOL

    <script src="$path/src/renderer/canvas/CanvasRenderer.js"></script>

    <script src="$path/src/renderer/webgl/WebGLRenderer.js"></script>
    <script src="$path/src/renderer/webgl/BatchManager.js"></script>
    <script src="$path/src/renderer/webgl/FilterManager.js"></script>
    <script src="$path/src/renderer/webgl/FilterTexture.js"></script>
    <script src="$path/src/renderer/webgl/ShaderManager.js"></script>
    <script src="$path/src/renderer/webgl/StencilManager.js"></script>
    <script src="$path/src/renderer/webgl/shaders/ComplexPrimitiveGraphics.js"></script>
    <script src="$path/src/renderer/webgl/shaders/PrimitiveGraphics.js"></script>
    <script src="$path/src/renderer/webgl/shaders/Sprite.js"></script>
    <script src="$path/src/renderer/webgl/shaders/SpriteBatch.js"></script>
    <script src="$path/src/renderer/webgl/shaders/Strip.js"></script>


    <script src="$path/src/gameobjects/components/Component.js"></script>
    <script src="$path/src/gameobjects/components/Angle.js"></script>
    <script src="$path/src/gameobjects/components/Animation.js"></script>
    <script src="$path/src/gameobjects/components/AutoCull.js"></script>
    <script src="$path/src/gameobjects/components/Bounds.js"></script>
    <script src="$path/src/gameobjects/components/BringToTop.js"></script>
    <script src="$path/src/gameobjects/components/Core.js"></script>
    <script src="$path/src/gameobjects/components/Crop.js"></script>
    <script src="$path/src/gameobjects/components/Delta.js"></script>
    <script src="$path/src/gameobjects/components/Destroy.js"></script>
    <script src="$path/src/gameobjects/components/Events.js"></script>
    <script src="$path/src/gameobjects/components/FixedToCamera.js"></script>
    <script src="$path/src/gameobjects/components/Health.js"></script>
    <script src="$path/src/gameobjects/components/InCamera.js"></script>
    <script src="$path/src/gameobjects/components/InputEnabled.js"></script>
    <script src="$path/src/gameobjects/components/InWorld.js"></script>
    <script src="$path/src/gameobjects/components/LifeSpan.js"></script>
    <script src="$path/src/gameobjects/components/LoadTexture.js"></script>
    <script src="$path/src/gameobjects/components/Overlap.js"></script>
    <script src="$path/src/gameobjects/components/PhysicsBody.js"></script>
    <script src="$path/src/gameobjects/components/Reset.js"></script>
    <script src="$path/src/gameobjects/components/ScaleMinMax.js"></script>
    <script src="$path/src/gameobjects/components/Smoothed.js"></script>

    <script src="$path/src/gameobjects/GameObjectFactory.js"></script>
    <script src="$path/src/gameobjects/GameObjectCreator.js"></script>

    <script src="$path/src/gameobjects/Factory.js"></script>

    <script src="$path/src/gameobjects/stage/Stage.js"></script>
    <script src="$path/src/gameobjects/stage/StageCanvasRenderer.js"></script>
    <script src="$path/src/gameobjects/stage/StageWebGLRenderer.js"></script>

    <script src="$path/src/gameobjects/sprite/Sprite.js"></script>
    <script src="$path/src/gameobjects/sprite/SpriteFactory.js"></script>
    <script src="$path/src/gameobjects/sprite/SpriteCanvasRenderer.js"></script>
    <script src="$path/src/gameobjects/sprite/SpriteWebGLRenderer.js"></script>

    <script src="$path/src/gameobjects/image/Image.js"></script>
    <script src="$path/src/gameobjects/image/ImageFactory.js"></script>
    <script src="$path/src/gameobjects/image/ImageCanvasRenderer.js"></script>
    <script src="$path/src/gameobjects/image/ImageWebGLRenderer.js"></script>

    <script src="$path/src/gameobjects/button/Button.js"></script>

    <script src="$path/src/gameobjects/spritebatch/SpriteBatch.js"></script>
    <script src="$path/src/gameobjects/spritebatch/SpriteBatchFactory.js"></script>
    <script src="$path/src/gameobjects/spritebatch/SpriteBatchCanvasRenderer.js"></script>
    <script src="$path/src/gameobjects/spritebatch/SpriteBatchWebGLRenderer.js"></script>

    <script src="$path/src/gameobjects/particle/Particle.js"></script>

    <script src="$path/src/gameobjects/container/Canvas.js"></script>
    <script src="$path/src/gameobjects/container/WebGL.js"></script>





    <script src="$path/src/plugins/weapon/WeaponPlugin.js"></script>
    <script src="$path/src/plugins/weapon/Bullet.js"></script>

    <script src="$path/src/plugins/path/PathManagerPlugin.js"></script>
    <script src="$path/src/plugins/path/Path.js"></script>
    <script src="$path/src/plugins/path/PathFollower.js"></script>
    <script src="$path/src/plugins/path/PathPoint.js"></script>
    <script src="$path/src/plugins/path/EventTarget.js"></script>



EOL;

    if ($modules['rope'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/rope/Rope.js"></script>


EOL;
    }

    if ($modules['tilesprite'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/tilesprite/TileSprite.js"></script>
    <script src="$path/src/gameobjects/tilesprite/TileSpriteFactory.js"></script>
    <script src="$path/src/gameobjects/tilesprite/TileSpriteCanvasRenderer.js"></script>
    <script src="$path/src/gameobjects/tilesprite/TileSpriteWebGLRenderer.js"></script>


EOL;
    }

    if ($modules['creature'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/creature/Creature.js"></script>
    <script src="$path/src/gameobjects/creature/CreatureFactory.js"></script>


EOL;
    }

    if ($modules['bitmapdata'])
    {
        echo <<<EOL
    <script src="$path/src/textures/BitmapData.js"></script>


EOL;
    }

    if ($modules['graphics'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/graphics/GraphicsData.js"></script>
    <script src="$path/src/gameobjects/graphics/Graphics.js"></script>
    <script src="$path/src/gameobjects/graphics/GraphicsFactory.js"></script>
    <script src="$path/src/gameobjects/graphics/GraphicsCanvasRenderer.js"></script>
    <script src="$path/src/gameobjects/graphics/GraphicsWebGLRenderer.js"></script>
    <script src="$path/src/gameobjects/graphics/GraphicsWebGLData.js"></script>


EOL;
    }

    if ($modules['rendertexture'])
    {
        echo <<<EOL
    <script src="$path/src/textures/RenderTexture.js"></script>


EOL;
    }

    if ($modules['text'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/text/Text.js"></script>
    <script src="$path/src/gameobjects/text/TextFactory.js"></script>
    <script src="$path/src/gameobjects/text/TextCanvasRenderer.js"></script>
    <script src="$path/src/gameobjects/text/TextWebGLRenderer.js"></script>


EOL;
    }

    if ($modules['bitmaptext'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/bitmaptext/BitmapText.js"></script>
    <script src="$path/src/gameobjects/bitmaptext/BitmapTextFactory.js"></script>


EOL;
    }

    if ($modules['retrofont'] && $modules['rendertexture'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/retrofont/RetroFont.js"></script>


EOL;
    }

    if ($modules['video'])
    {
        echo <<<EOL
    <script src="$path/src/gameobjects/video/Video.js"></script>


EOL;
    }

    echo <<<EOL
    <script src="$path/src/utils/Device.js"></script>
    <script src="$path/src/utils/DOM.js"></script>
    <script src="$path/src/utils/Canvas.js"></script>
    <script src="$path/src/utils/RequestAnimationFrame.js"></script>

    <script src="$path/src/math/Math.js"></script>
    <script src="$path/src/math/RandomDataGenerator.js"></script>
    <script src="$path/src/math/QuadTree.js"></script>

    <script src="$path/src/net/Net.js"></script>


EOL;

    if ($modules['tweens'])
    {
        echo <<<EOL
    <script src="$path/src/tween/TweenManager.js"></script>
    <script src="$path/src/tween/Tween.js"></script>
    <script src="$path/src/tween/TweenData.js"></script>
    <script src="$path/src/tween/Easing.js"></script>


EOL;
    }
    else
    {
        echo <<<EOL
    <script src="$path/src/stubs/TweenManager.js"></script>


EOL;
    }

    echo <<<EOL
    <script src="$path/src/time/Time.js"></script>
    <script src="$path/src/time/Timer.js"></script>
    <script src="$path/src/time/TimerEvent.js"></script>

    <script src="$path/src/animation/AnimationManager.js"></script>
    <script src="$path/src/animation/Animation.js"></script>
    <script src="$path/src/animation/Frame.js"></script>
    <script src="$path/src/animation/FrameData.js"></script>
    <script src="$path/src/animation/AnimationParser.js"></script>

    <script src="$path/src/loader/Cache.js"></script>
    <script src="$path/src/loader/Loader.js"></script>
    <script src="$path/src/loader/LoaderParser.js"></script>


EOL;


    if ($modules['sound'])
    {
        echo <<<EOL
    <script src="$path/src/sound/AudioSprite.js"></script>
    <script src="$path/src/sound/Sound.js"></script>
    <script src="$path/src/sound/SoundManager.js"></script>


EOL;
    }
    else
    {
        echo <<<EOL
    <script src="$path/src/stubs/SoundManager.js"></script>


EOL;
    }

    if ($modules['debug'])
    {
        echo <<<EOL
    <script src="$path/src/utils/Debug.js"></script>


EOL;
    }

    echo <<<EOL
    <script src="$path/src/utils/ArraySet.js"></script>
    <script src="$path/src/utils/LinkedList.js"></script>
    <script src="$path/src/utils/ArrayUtils.js"></script>
    <script src="$path/src/utils/Color.js"></script>

    <script src="$path/src/physics/Physics.js"></script>
    <script src="$path/src/particles/Particles.js"></script>


EOL;

    if ($modules['particles'] && $modules['arcade'])
    {
        echo <<<EOL
    <script src="$path/src/particles/arcade/ArcadeParticles.js"></script>
    <script src="$path/src/particles/arcade/Emitter.js"></script>


EOL;
    }

    if ($modules['tilemap'])
    {
        echo <<<EOL
    <script src="$path/src/tilemap/ImageCollection.js"></script>
    <script src="$path/src/tilemap/Tile.js"></script>
    <script src="$path/src/tilemap/Tilemap.js"></script>
    <script src="$path/src/tilemap/TilemapLayer.js"></script>
    <script src="$path/src/tilemap/TilemapParser.js"></script>
    <script src="$path/src/tilemap/Tileset.js"></script>


EOL;
    }

    if ($modules['arcade'])
    {
        echo <<<EOL
    <script src="$path/src/physics/arcade/World.js"></script>
    <script src="$path/src/physics/arcade/Body.js"></script>


EOL;
    }

    if ($modules['tilemap'] && $modules['arcade'])
    {
        echo <<<EOL
    <script src="$path/src/physics/arcade/TilemapCollision.js"></script>


EOL;
    }

    if ($modules['p2'])
    {
        echo <<<EOL
    <script src="$path/src/physics/p2/World.js"></script>
    <script src="$path/src/physics/p2/FixtureList.js"></script>
    <script src="$path/src/physics/p2/PointProxy.js"></script>
    <script src="$path/src/physics/p2/InversePointProxy.js"></script>
    <script src="$path/src/physics/p2/Body.js"></script>
    <script src="$path/src/physics/p2/BodyDebug.js"></script>
    <script src="$path/src/physics/p2/Spring.js"></script>
    <script src="$path/src/physics/p2/RotationalSpring.js"></script>
    <script src="$path/src/physics/p2/Material.js"></script>
    <script src="$path/src/physics/p2/ContactMaterial.js"></script>
    <script src="$path/src/physics/p2/CollisionGroup.js"></script>
    <script src="$path/src/physics/p2/DistanceConstraint.js"></script>
    <script src="$path/src/physics/p2/GearConstraint.js"></script>
    <script src="$path/src/physics/p2/LockConstraint.js"></script>
    <script src="$path/src/physics/p2/PrismaticConstraint.js"></script>
    <script src="$path/src/physics/p2/RevoluteConstraint.js"></script>


EOL;
    }

    if ($modules['ninja'])
    {
        echo <<<EOL
    <script src="$path/src/physics/ninja/World.js"></script>
    <script src="$path/src/physics/ninja/Body.js"></script>
    <script src="$path/src/physics/ninja/AABB.js"></script>
    <script src="$path/src/physics/ninja/Tile.js"></script>
    <script src="$path/src/physics/ninja/Circle.js"></script>


EOL;
    }

    if ($modules['box2d'] && isset($box2dpath))
    {
        echo <<<EOL
    <script src="$box2dpath/World.js"></script>
    <script src="$box2dpath/Body.js"></script>
    <script src="$box2dpath/PointProxy.js"></script>
    <script src="$box2dpath/DefaultDebugDraw.js"></script>
    <script src="$box2dpath/DefaultContactListener.js"></script>
    <script src="$box2dpath/Polygon.js"></script>


EOL;
    }

    if (isset($custom))
    {
        for ($i = 0; $i < count($custom); $i++)
        {
            echo '    <script src="' . $custom[$i] . '"></script>' . "\n";
        }
    }
?>