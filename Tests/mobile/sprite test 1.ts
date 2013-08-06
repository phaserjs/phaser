/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 320, 400, init, create);

    var emitter: Phaser.ArcadeEmitter;

    function init() {

        game.load.image('backdrop1', 'assets/pics/atari_fujilogo.png');
        game.load.image('backdrop2', 'assets/pics/acryl_bladerunner.png');
        game.load.image('jet', 'assets/sprites/carrot.png');

        game.load.start();

        //  This can help a lot on crappy old Android phones :)
        //game.framerate = 30;

        game.stage.backgroundColor = 'rgb(0,0,0)';
        //game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
        game.stage.scaleMode = Phaser.StageScaleMode.EXACT_FIT;
        //game.stage.scaleMode = Phaser.StageScaleMode.NO_SCALE;

    }

    var pic1;
    var pic2;

    function create() {

        console.log('created now');

        game.stage.enableOrientationCheck(false, true, 'backdrop2');

        pic1 = game.add.sprite(0, 0, 'backdrop1');
        pic2 = game.add.sprite(0, 0, 'backdrop2');

        //  Creates a basic emitter, bursting out 50 default sprites (i.e. 16x16 white boxes)
        emitter = game.add.emitter(game.stage.centerX, game.stage.centerY);
        emitter.makeParticles('jet', 50, false, 0);
        emitter.setRotation(0, 0);
        emitter.start(false, 10, 0.1);

        //  Make sure the camera doesn't clip anything
        game.camera.disableClipping = true;

        game.stage.scale.enterLandscape.add(goneLandscape, this);
        game.stage.scale.enterPortrait.add(gonePortrait, this);

        game.onRenderCallback = render;

    }

    function goneLandscape() {

    	pic1.visible = true;
    	pic2.visible = false;

    }

    function gonePortrait() {

    	pic1.visible = false;
    	pic2.visible = true;

    }

    function render() {

        game.stage.context.fillStyle = 'rgb(255,0,0)';
        game.stage.context.font = '20px Arial';
        //game.stage.context.fillText("ttc: " + game._raf.timeToCall.toString(), 0, 64);

    }

})();
