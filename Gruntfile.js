module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadTasks('./tasks');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: '/**\n' +
'* @author       Richard Davey <rich@photonstorm.com>\n' +
'* @copyright    2014 Photon Storm Ltd.\n' +
'* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}\n' +
'*\n' +
'* @overview\n' +
'*\n' +
'* Phaser - http://www.phaser.io\n' +
'*\n' +
'* v<%= pkg.version %> "<%= pkg.release %>" - Built: <%= grunt.template.today() %>\n' +
'*\n' +
'* By Richard Davey http://www.photonstorm.com @photonstorm\n' +
'*\n' +
'* Phaser is a fun, free and fast 2D game framework for making HTML5 games \n' +
'* for desktop and mobile web browsers, supporting Canvas and WebGL rendering.\n' +
'*\n' +
'* Phaser uses Pixi.js for rendering, created by Mat Groves http://matgroves.com @Doormat23\n' +
'* Phaser uses p2.js for physics, created by Stefan Hedman https://github.com/schteppe/p2.js @schteppe\n' +
'*\n' +
'* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel, from which both Phaser\n' +
'* and my love of framework development originate.\n' +
'*\n' +
'* Follow Phaser development progress at http://phaser.io\n' +
'*\n' +
'* "If you want your children to be intelligent,  read them fairy tales."\n' +
'* "If you want them to be more intelligent, read them more fairy tales."\n' +
'*                                                     -- Albert Einstein\n' +
'*/\n',

        compile_dir: 'dist',

        p2: [
            'src/p2.js'
        ],

        pixi: [
            'src/pixi/Intro.js',
            'src/pixi/Pixi.js',
            'src/pixi/core/Point.js',
            'src/pixi/core/Rectangle.js',
            'src/pixi/core/Polygon.js',
            'src/pixi/core/Circle.js',
            'src/pixi/core/Ellipse.js',
            'src/pixi/core/Matrix.js',
            'src/pixi/display/DisplayObject.js',
            'src/pixi/display/DisplayObjectContainer.js',
            'src/pixi/display/Sprite.js',
            'src/pixi/display/SpriteBatch.js',
            'src/pixi/filters/FilterBlock.js',
            'src/pixi/text/Text.js',
            'src/pixi/text/BitmapText.js',
            'src/pixi/display/Stage.js',
            'src/pixi/utils/Utils.js',
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
            'src/pixi/Outro.js',
        ],

        phaser: [
            'src/Intro.js',
            'src/Phaser.js',
            'src/utils/Utils.js',

            'src/geom/Circle.js',
            'src/geom/Point.js',
            'src/geom/Rectangle.js',
            'src/geom/Line.js',
            'src/geom/Ellipse.js',
            'src/geom/Polygon.js',

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
            'src/core/ScaleManager.js',
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
            'src/gameobjects/GameObjectCreator.js',
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
            'src/system/Device.js',
            'src/system/RequestAnimationFrame.js',

            'src/math/Math.js',
            'src/math/RandomDataGenerator.js',

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
            'src/physics/CollisionGroup.js',

            'src/particles/Particles.js',
            'src/particles/arcade/ArcadeParticles.js',
            'src/particles/arcade/Emitter.js',

            'src/tilemap/Tile.js',
            'src/tilemap/Tilemap.js',
            'src/tilemap/TilemapLayer.js',
            'src/tilemap/TilemapParser.js',
            'src/tilemap/Tileset.js',

            'src/Outro.js'
        ],

        clean: ['<%= compile_dir %>'],

        concat: {

            //  Our custom version of p2
            p2: {
                src: ['<%= p2 %>'],
                dest: '<%= compile_dir %>/p2.js'
            },

            //  Our custom version of Pixi
            pixi: {
                src: ['<%= pixi %>'],
                dest: '<%= compile_dir %>/pixi.js'
            },

            //  Phaser, stand-alone (no bundled libs)
            phaser: {
                options: {
                    banner: '<%= banner %>'
                },
                src: ['<%= phaser %>'],
                dest: '<%= compile_dir %>/phaser-no-libs.js'
            },

            //  One ring to rule them all
            standalone: {
                options: {
                    banner: '<%= banner %>'
                },
                src: ['<%= compile_dir %>/p2.js', '<%= compile_dir %>/pixi.js', '<%= compile_dir %>/phaser-no-libs.js'],
                dest: '<%= compile_dir %>/phaser.js'
            }

        },

        uglify: {

            p2: {
                options: {
                    banner: '/* p2.js custom build for Phaser v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.p2.dest %>'],
                dest: '<%= compile_dir %>/p2.min.js'
            },

            pixi: {
                options: {
                    banner: '/* Pixi.js custom build for Phaser v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.pixi.dest %>'],
                dest: '<%= compile_dir %>/pixi.min.js'
            },

            phaser: {
                options: {
                    banner: '/* Phaser (no libs) v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.phaser.dest %>'],
                dest: '<%= compile_dir %>/phaser-no-libs.min.js'
            },

            standalone: {
                options: {
                    sourceMap: true,
                    sourceMapName: '<%= compile_dir %>/phaser.map',
                    banner: '/* Phaser v<%= pkg.version %> - http://phaser.io - @photonstorm - (c) 2014 Photon Storm Ltd. */\n'
                },
                src: ['<%= concat.standalone.dest %>'],
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
    grunt.registerTask('build', ['clean', 'concat', 'uglify']);

};
