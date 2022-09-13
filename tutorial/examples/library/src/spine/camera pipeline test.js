// #module
import PlasmaPostFX from './assets/pipelines/PlasmaPostFX.js';

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, {
            key: 'gameScene',
            active: true,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePluginDebug.js', sceneKey: 'spine' }
                ]
            }
        });

        this.t = 0;
        this.customPipeline;
    },

    preload: function ()
    {
        this.load.image('logo', 'assets/sprites/phaser.png');
        this.load.setPath('assets/spine/3.8/demos/');
        this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
    },

    create: function ()
    {
       const hueRotatePipeline = this.renderer.pipelines.get('PlasmaPostFX');

        this.add.image(0, 0, 'logo').setOrigin(0);

        this.add.spine(400, 600, 'set1.spineboy', 'idle', true);

        this.cameras.main.setPostPipeline(hueRotatePipeline);
    }
});

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: GameScene,
    pipeline: { PlasmaPostFX }
};

var game = new Phaser.Game(config);
