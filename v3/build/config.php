<?php
    if (!isset($path)) { $path = '..'; }

    if (!isset($modules))
    {
        $modules = array(
            'keyboard' => true,
            'gamepad' => true,
            'bitmapdata' => false,
            'graphics' => false,
            'rendertexture' => false,
            'text' => false,
            'bitmaptext' => false,
            'retrofont' => false,
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
            'video' => false,
            'rope' => false,
            'tilesprite' => false
        );
    }

    if ($modules['p2'])
    {
        echo "    <script src=\"$path/v3/merge/physics/p2/p2.js\"></script>";
    }

    if ($modules['box2d'] && isset($box2dpath))
    {
        echo "    <script src=\"$box2dpath/box2d-html5.js\"></script>";
    }

    echo <<<EOL

EOL;

    //  Phaser Global
    echo <<<EOL

    <script src="$path/v3/merge/Phaser.js"></script>
    <script src="$path/v3/merge/polyfills.js"></script>

    <script src="$path/v3/merge/utils/Utils.js"></script>
    <script src="$path/v3/merge/utils/CanvasPool.js"></script>

    <script src="$path/v3/merge/geom/Circle.js"></script>
    <script src="$path/v3/merge/geom/Ellipse.js"></script>
    <script src="$path/v3/merge/geom/Hermite.js"></script>
    <script src="$path/v3/merge/geom/Line.js"></script>
    <script src="$path/v3/merge/geom/Matrix.js"></script>
    <script src="$path/v3/merge/geom/Point.js"></script>
    <script src="$path/v3/merge/geom/Polygon.js"></script>
    <script src="$path/v3/merge/geom/Rectangle.js"></script>
    <script src="$path/v3/merge/geom/RoundedRectangle.js"></script>

    <script src="$path/v3/merge/camera/Camera.js"></script>

    <script src="$path/v3/merge/states/State.js"></script>
    <script src="$path/v3/merge/states/StateManager.js"></script>
    <script src="$path/v3/merge/states/StateSettings.js"></script>
    <script src="$path/v3/merge/states/StateSystems.js"></script>
    <script src="$path/v3/merge/states/StateInput.js"></script>
    <script src="$path/v3/merge/states/MainLoop.js"></script>

    <script src="$path/v3/merge/core/Signal.js"></script>
    <script src="$path/v3/merge/core/SignalBinding.js"></script>
    <script src="$path/v3/merge/core/Filter.js"></script>
    <script src="$path/v3/merge/core/Plugin.js"></script>
    <script src="$path/v3/merge/core/PluginManager.js"></script>
    <script src="$path/v3/merge/core/ScaleManager.js"></script>
    <script src="$path/v3/merge/core/Game.js"></script>

    <script src="$path/v3/merge/input/Input.js"></script>
    <script src="$path/v3/merge/input/Mouse.js"></script>
    <script src="$path/v3/merge/input/MSPointer.js"></script>
    <script src="$path/v3/merge/input/DeviceButton.js"></script>
    <script src="$path/v3/merge/input/Pointer.js"></script>
    <script src="$path/v3/merge/input/Touch.js"></script>
    <script src="$path/v3/merge/input/InputHandler.js"></script>

    <script src="$path/v3/merge/textures/TextureManager.js"></script>
    <script src="$path/v3/merge/textures/Texture.js"></script>
    <script src="$path/v3/merge/textures/TextureSource.js"></script>
    <script src="$path/v3/merge/textures/Frame.js"></script>
    <script src="$path/v3/merge/textures/Crop.js"></script>
    <script src="$path/v3/merge/textures/parsers/Canvas.js"></script>
    <script src="$path/v3/merge/textures/parsers/Image.js"></script>
    <script src="$path/v3/merge/textures/parsers/JSONArray.js"></script>
    <script src="$path/v3/merge/textures/parsers/JSONHash.js"></script>
    <script src="$path/v3/merge/textures/parsers/SpriteSheet.js"></script>

EOL;

    if ($modules['keyboard'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/input/Key.js"></script>
    <script src="$path/v3/merge/input/Keyboard.js"></script>


EOL;
    }

    if ($modules['gamepad'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/input/Gamepad.js"></script>
    <script src="$path/v3/merge/input/SinglePad.js"></script>


EOL;
    }

    echo <<<EOL

    <script src="$path/v3/merge/renderer/canvas/CanvasRenderer.js"></script>

    <script src="$path/v3/merge/renderer/webgl/WebGLRenderer.js"></script>
    <script src="$path/v3/merge/renderer/webgl/BatchManager.js"></script>
    <script src="$path/v3/merge/renderer/webgl/FilterManager.js"></script>
    <script src="$path/v3/merge/renderer/webgl/FilterTexture.js"></script>
    <script src="$path/v3/merge/renderer/webgl/ShaderManager.js"></script>
    <script src="$path/v3/merge/renderer/webgl/StencilManager.js"></script>
    <script src="$path/v3/merge/renderer/webgl/QuadFBO.js"></script>

    <script src="$path/v3/merge/renderer/webgl/batches/BaseBatch.js"></script>
    <script src="$path/v3/merge/renderer/webgl/batches/FXBatch.js"></script>
    <script src="$path/v3/merge/renderer/webgl/batches/MultiTextureBatch.js"></script>
    <script src="$path/v3/merge/renderer/webgl/batches/PixelBatch.js"></script>
    <script src="$path/v3/merge/renderer/webgl/batches/SingleTextureBatch.js"></script>

    <script src="$path/v3/merge/renderer/webgl/shaders/ComplexPrimitiveGraphics.js"></script>
    <script src="$path/v3/merge/renderer/webgl/shaders/PrimitiveGraphics.js"></script>
    <script src="$path/v3/merge/renderer/webgl/shaders/SpriteBatch.js"></script>
    <script src="$path/v3/merge/renderer/webgl/shaders/Strip.js"></script>

    <script src="$path/v3/merge/components/BaseTransform.js"></script>
    <script src="$path/v3/merge/components/Children.js"></script>
    <script src="$path/v3/merge/components/Color.js"></script>
    <script src="$path/v3/merge/components/Data.js"></script>
    <script src="$path/v3/merge/components/Transform.js"></script>
    <script src="$path/v3/merge/components/UpdateManager.js"></script>

    <script src="$path/v3/merge/gameobjects/GameObject.js"></script>
    <script src="$path/v3/merge/gameobjects/Factory.js"></script>
    <script src="$path/v3/merge/gameobjects/GameObjectCreator.js"></script>

    <script src="$path/v3/merge/gameobjects/container/Container.js"></script>
    <script src="$path/v3/merge/gameobjects/container/ContainerFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/container/ContainerCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/container/ContainerWebGLRenderer.js"></script>

    <script src="$path/v3/merge/gameobjects/sprite/Sprite.js"></script>
    <script src="$path/v3/merge/gameobjects/sprite/SpriteFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/sprite/SpriteCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/sprite/SpriteWebGLRenderer.js"></script>

    <script src="$path/v3/merge/gameobjects/image/Image.js"></script>
    <script src="$path/v3/merge/gameobjects/image/ImageFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/image/ImageCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/image/ImageWebGLRenderer.js"></script>

    <script src="$path/v3/merge/gameobjects/blitter/Blitter.js"></script>
    <script src="$path/v3/merge/gameobjects/blitter/BlitterFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/blitter/BlitterWebGLRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/blitter/Bob.js"></script>

    <script src="$path/v3/merge/gameobjects/button/Button.js"></script>
    <script src="$path/v3/merge/gameobjects/button/ButtonFactory.js"></script>

    <script src="$path/v3/merge/gameobjects/spritebatch/SpriteBatch.js"></script>
    <script src="$path/v3/merge/gameobjects/spritebatch/SpriteBatchFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/spritebatch/SpriteBatchCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/spritebatch/SpriteBatchWebGLRenderer.js"></script>

    <script src="$path/v3/merge/gameobjects/particle/Particle.js"></script>

    <script src="$path/v3/merge/gameobjects/pixelfield/PixelField.js"></script>
    <script src="$path/v3/merge/gameobjects/pixelfield/PixelFieldFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/pixelfield/PixelFieldWebGLRenderer.js"></script>

    <script src="$path/v3/merge/gameobjects/stage/Stage.js"></script>
    <script src="$path/v3/merge/gameobjects/stage/StageCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/stage/StageWebGLRenderer.js"></script>

    <script src="$path/v3/merge/plugins/weapon/WeaponPlugin.js"></script>
    <script src="$path/v3/merge/plugins/weapon/Bullet.js"></script>

    <script src="$path/v3/merge/plugins/path/PathManagerPlugin.js"></script>
    <script src="$path/v3/merge/plugins/path/Path.js"></script>
    <script src="$path/v3/merge/plugins/path/PathFollower.js"></script>
    <script src="$path/v3/merge/plugins/path/PathPoint.js"></script>
    <script src="$path/v3/merge/plugins/path/EventTarget.js"></script>

EOL;

    if ($modules['rope'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/rope/Rope.js"></script>
    <script src="$path/v3/merge/gameobjects/rope/RopeFactory.js"></script>


EOL;
    }

    if ($modules['tilesprite'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/tilesprite/TileSprite.js"></script>
    <script src="$path/v3/merge/gameobjects/tilesprite/TileSpriteFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/tilesprite/TileSpriteCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/tilesprite/TileSpriteWebGLRenderer.js"></script>


EOL;
    }

    if ($modules['creature'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/creature/Creature.js"></script>
    <script src="$path/v3/merge/gameobjects/creature/CreatureFactory.js"></script>


EOL;
    }

    if ($modules['bitmapdata'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/textures/BitmapData.js"></script>


EOL;
    }

    if ($modules['graphics'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/graphics/GraphicsData.js"></script>
    <script src="$path/v3/merge/gameobjects/graphics/Graphics.js"></script>
    <script src="$path/v3/merge/gameobjects/graphics/GraphicsFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/graphics/GraphicsCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/graphics/GraphicsWebGLRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/graphics/GraphicsWebGLData.js"></script>


EOL;
    }

    if ($modules['rendertexture'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/textures/RenderTexture.js"></script>


EOL;
    }

    if ($modules['text'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/text/Text.js"></script>
    <script src="$path/v3/merge/gameobjects/text/TextFactory.js"></script>
    <script src="$path/v3/merge/gameobjects/text/TextCanvasRenderer.js"></script>
    <script src="$path/v3/merge/gameobjects/text/TextWebGLRenderer.js"></script>


EOL;
    }

    if ($modules['bitmaptext'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/bitmaptext/BitmapText.js"></script>
    <script src="$path/v3/merge/gameobjects/bitmaptext/BitmapTextFactory.js"></script>


EOL;
    }

    if ($modules['retrofont'] && $modules['rendertexture'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/retrofont/RetroFont.js"></script>
    <script src="$path/v3/merge/gameobjects/retrofont/RetroFontFactory.js"></script>


EOL;
    }

    if ($modules['video'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/gameobjects/video/Video.js"></script>
    <script src="$path/v3/merge/gameobjects/video/VideoFactory.js"></script>


EOL;
    }

    echo <<<EOL
    <script src="$path/v3/merge/utils/Device.js"></script>
    <script src="$path/v3/merge/utils/DOM.js"></script>
    <script src="$path/v3/merge/utils/Canvas.js"></script>
    <script src="$path/v3/merge/utils/RequestAnimationFrame.js"></script>

    <script src="$path/v3/merge/math/Math.js"></script>
    <script src="$path/v3/merge/math/RandomDataGenerator.js"></script>
    <script src="$path/v3/merge/math/QuadTree.js"></script>

    <script src="$path/v3/merge/net/Net.js"></script>


EOL;

    if ($modules['tweens'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/tween/TweenManager.js"></script>
    <script src="$path/v3/merge/tween/Tween.js"></script>
    <script src="$path/v3/merge/tween/TweenData.js"></script>
    <script src="$path/v3/merge/tween/Easing.js"></script>


EOL;
    }
    else
    {
        echo <<<EOL
    <script src="$path/v3/merge/stubs/TweenManager.js"></script>


EOL;
    }

    echo <<<EOL
    <script src="$path/v3/merge/time/Time.js"></script>
    <script src="$path/v3/merge/time/Timer.js"></script>
    <script src="$path/v3/merge/time/TimerEvent.js"></script>

    <script src="$path/v3/merge/animation/AnimationManager.js"></script>
    <script src="$path/v3/merge/animation/Animation.js"></script>
    <script src="$path/v3/merge/animation/Frame.js"></script>
    <script src="$path/v3/merge/animation/FrameData.js"></script>
    <script src="$path/v3/merge/animation/AnimationParser.js"></script>

    <script src="$path/v3/merge/loader/Cache.js"></script>
    <script src="$path/v3/merge/loader/Loader.js"></script>
    <script src="$path/v3/merge/loader/LoaderParser.js"></script>


EOL;


    if ($modules['sound'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/sound/AudioSprite.js"></script>
    <script src="$path/v3/merge/sound/Sound.js"></script>
    <script src="$path/v3/merge/sound/SoundManager.js"></script>


EOL;
    }
    else
    {
        echo <<<EOL
    <script src="$path/v3/merge/stubs/SoundManager.js"></script>


EOL;
    }

    if ($modules['debug'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/utils/Debug.js"></script>


EOL;
    }

    echo <<<EOL
    <script src="$path/v3/merge/utils/ArraySet.js"></script>
    <script src="$path/v3/merge/utils/LinkedList.js"></script>
    <script src="$path/v3/merge/utils/ArrayUtils.js"></script>
    <script src="$path/v3/merge/utils/Color.js"></script>

    <script src="$path/v3/merge/physics/Physics.js"></script>
    <script src="$path/v3/merge/particles/Particles.js"></script>


EOL;

    if ($modules['particles'] && $modules['arcade'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/particles/arcade/ArcadeParticles.js"></script>
    <script src="$path/v3/merge/particles/arcade/Emitter.js"></script>


EOL;
    }

    if ($modules['tilemap'])
    {
    // <script src="$path/v3/merge/tilemap/TilemapLayer.js"></script>

        echo <<<EOL
    <script src="$path/v3/merge/tilemap/ImageCollection.js"></script>
    <script src="$path/v3/merge/tilemap/Tile.js"></script>
    <script src="$path/v3/merge/tilemap/Tilemap.js"></script>
    <script src="$path/v3/merge/tilemap/TilemapParser.js"></script>
    <script src="$path/v3/merge/tilemap/Tileset.js"></script>


EOL;
    }

    if ($modules['arcade'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/physics/arcade/World.js"></script>
    <script src="$path/v3/merge/physics/arcade/Body.js"></script>


EOL;
    }

    if ($modules['tilemap'] && $modules['arcade'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/physics/arcade/TilemapCollision.js"></script>


EOL;
    }

    if ($modules['p2'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/physics/p2/World.js"></script>
    <script src="$path/v3/merge/physics/p2/FixtureList.js"></script>
    <script src="$path/v3/merge/physics/p2/PointProxy.js"></script>
    <script src="$path/v3/merge/physics/p2/InversePointProxy.js"></script>
    <script src="$path/v3/merge/physics/p2/Body.js"></script>
    <script src="$path/v3/merge/physics/p2/BodyDebug.js"></script>
    <script src="$path/v3/merge/physics/p2/Spring.js"></script>
    <script src="$path/v3/merge/physics/p2/RotationalSpring.js"></script>
    <script src="$path/v3/merge/physics/p2/Material.js"></script>
    <script src="$path/v3/merge/physics/p2/ContactMaterial.js"></script>
    <script src="$path/v3/merge/physics/p2/CollisionGroup.js"></script>
    <script src="$path/v3/merge/physics/p2/DistanceConstraint.js"></script>
    <script src="$path/v3/merge/physics/p2/GearConstraint.js"></script>
    <script src="$path/v3/merge/physics/p2/LockConstraint.js"></script>
    <script src="$path/v3/merge/physics/p2/PrismaticConstraint.js"></script>
    <script src="$path/v3/merge/physics/p2/RevoluteConstraint.js"></script>


EOL;
    }

    if ($modules['ninja'])
    {
        echo <<<EOL
    <script src="$path/v3/merge/physics/ninja/World.js"></script>
    <script src="$path/v3/merge/physics/ninja/Body.js"></script>
    <script src="$path/v3/merge/physics/ninja/AABB.js"></script>
    <script src="$path/v3/merge/physics/ninja/Tile.js"></script>
    <script src="$path/v3/merge/physics/ninja/Circle.js"></script>


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