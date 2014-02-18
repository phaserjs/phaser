module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadTasks('./tasks');

  grunt.initConfig({
    compile_dir: 'dist',
    src: {
      phaser: [
        'build/p2.js',
        'src/Intro.js',
        'src/pixi/Pixi.js',
        'src/Phaser.js',
        'src/utils/Utils.js',

        'src/geom/Circle.js',
        'src/geom/Point.js',
        'src/geom/Rectangle.js',
        'src/geom/Line.js',
        'src/geom/Ellipse.js',
        'src/geom/Polygon.js',

        'src/pixi/core/Matrix.js',
        'src/pixi/display/DisplayObject.js',
        'src/pixi/display/DisplayObjectContainer.js',
        'src/pixi/display/Sprite.js',
        'src/pixi/display/SpriteBatch.js',
        'src/pixi/filters/FilterBlock.js',
        'src/pixi/text/Text.js',
        'src/pixi/text/BitmapText.js',
        'src/pixi/display/Stage.js',
        'src/pixi/utils/EventTarget.js',
        'src/pixi/utils/Polyk.js',
        'src/pixi/renderers/webgl/utils/WebGLShaderUtils.js',
        'src/pixi/renderers/webgl/shaders/PixiShader.js',
        'src/pixi/renderers/webgl/shaders/PixiFastShader.js',
        'src/pixi/renderers/webgl/shaders/StripShader.js',
        'src/pixi/renderers/webgl/shaders/PrimitiveShader.js',
        'src/pixi/renderers/webgl/utils/WebGLGraphics.js',
        'src/pixi/renderers/webgl/WebGLRenderer.js',
        'src/pixi/renderers/webgl/utils/WebGLMaskManager.js',
        'src/pixi/renderers/webgl/utils/WebGLShaderManager.js',
        'src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js',
        'src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js',
        'src/pixi/renderers/webgl/utils/WebGLFilterManager.js',
        'src/pixi/renderers/webgl/utils/FilterTexture.js',
        'src/pixi/renderers/canvas/utils/CanvasMaskManager.js',
        'src/pixi/renderers/canvas/utils/CanvasTinter.js',
        'src/pixi/renderers/canvas/CanvasRenderer.js',
        'src/pixi/renderers/canvas/CanvasGraphics.js',
        'src/pixi/primitives/Graphics.js',
        'src/pixi/extras/TilingSprite.js',
        'src/pixi/textures/BaseTexture.js',
        'src/pixi/textures/Texture.js',
        'src/pixi/textures/RenderTexture.js',

        'src/core/Camera.js',
        'src/core/State.js',
        'src/core/StateManager.js',
        'src/core/LinkedList.js',
        'src/core/Signal.js',
        'src/core/SignalBinding.js',
        'src/core/Filter.js',
        'src/core/Plugin.js',
        'src/core/PluginManager.js',
        'src/core/Stage.js',
        'src/core/Group.js',
        'src/core/World.js',
        'src/core/Game.js',

        'src/input/Input.js',
        'src/input/Key.js',
        'src/input/Keyboard.js',
        'src/input/Mouse.js',
        'src/input/MSPointer.js',
        'src/input/Pointer.js',
        'src/input/Touch.js',
        'src/input/Gamepad.js',
        'src/input/SinglePad.js',
        'src/input/GamepadButton.js',
        'src/input/InputHandler.js',

        'src/gameobjects/Events.js',
        'src/gameobjects/GameObjectFactory.js',
        'src/gameobjects/BitmapData.js',
        'src/gameobjects/Sprite.js',
        'src/gameobjects/Image.js',
        'src/gameobjects/TileSprite.js',
        'src/gameobjects/Text.js',
        'src/gameobjects/BitmapText.js',
        'src/gameobjects/Button.js',
        'src/gameobjects/Graphics.js',
        'src/gameobjects/RenderTexture.js',
        'src/gameobjects/SpriteBatch.js',
        'src/gameobjects/BitmapFont.js',

        'src/system/Canvas.js',
        'src/system/StageScaleMode.js',
        'src/system/Device.js',
        'src/system/RequestAnimationFrame.js',

        'src/math/Math.js',
        'src/math/RandomDataGenerator.js',
        'src/math/QuadTree.js',

        'src/net/Net.js',

        'src/tween/TweenManager.js',
        'src/tween/Tween.js',
        'src/tween/Easing.js',

        'src/time/Time.js',
        'src/time/Timer.js',
        'src/time/TimerEvent.js',

        'src/animation/AnimationManager.js',
        'src/animation/Animation.js',
        'src/animation/Frame.js',
        'src/animation/FrameData.js',
        'src/animation/AnimationParser.js',

        'src/loader/Cache.js',
        'src/loader/Loader.js',
        'src/loader/LoaderParser.js',

        'src/sound/Sound.js',
        'src/sound/SoundManager.js',

        'src/utils/Debug.js',
        'src/utils/Color.js',

        'src/physics/World.js',
        'src/physics/PointProxy.js',
        'src/physics/InversePointProxy.js',
        'src/physics/Body.js',
        'src/physics/Spring.js',
        'src/physics/Material.js',
        'src/physics/ContactMaterial.js',

        'src/particles/Particles.js',
        'src/particles/arcade/ArcadeParticles.js',
        'src/particles/arcade/Emitter.js',

        'src/tilemap/Tile.js',
        'src/tilemap/Tilemap.js',
        'src/tilemap/TilemapLayer.js',
        'src/tilemap/TilemapParser.js',
        'src/tilemap/Tileset.js'
      ]
    },
    pkg: grunt.file.readJSON('package.json'),
    clean: ['<%= compile_dir %>'],
    concat: {
      phaser: {
        options: {
          process: {
            data: {
              version: '<%= pkg.version %>',
              buildDate: '<%= grunt.template.today() %>'
            }
          }
        },
        src: ['<%= src.phaser %>'],
        dest: '<%= compile_dir %>/phaser.js'
      }
    },
    umd: {
      phaser: {
        src: '<%= concat.phaser.dest %>',
        dest: '<%= umd.phaser.src %>'
      }
    },
    uglify: {
      phaser: {
        options: {
          banner: '/*! Phaser v<%= pkg.version %> | (c) 2014 Photon Storm Ltd. */\n'
        },
        src: ['<%= umd.phaser.dest %>'],
        dest: '<%= compile_dir %>/phaser.min.js'
      }
    },
    examples: {
      all: {
        options: {
          base: 'examples',
          excludes: ['_site', 'assets', 'states', 'wip']
        },
        src: ['examples/**/*.js'],
        dest: 'examples/_site/examples.json'
      }
    },
    connect: {
      root: {
        options: {
          keepalive: true,
          hostname: '*'
        }
      }
    }
  });

  grunt.registerTask('default', ['build', 'examples']);
  grunt.registerTask('build', ['clean', 'concat', 'umd', 'uglify']);

};
