/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 320, 400, init, create);

    var emitter: Phaser.Emitter;

    function init() {

        myGame.loader.addImageFile('backdrop1', 'assets/pics/atari_fujilogo.png');
        myGame.loader.addImageFile('backdrop2', 'assets/pics/acryl_bladerunner.png');
        myGame.loader.addImageFile('jet', 'assets/sprites/carrot.png');

        myGame.loader.load();

        //  This can help a lot on crappy old Android phones :)
        //myGame.framerate = 30;

        myGame.stage.backgroundColor = 'rgb(50,50,50)';
        myGame.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
        //myGame.stage.scaleMode = Phaser.StageScaleMode.EXACT_FIT;
        //myGame.stage.scaleMode = Phaser.StageScaleMode.NO_SCALE;

    }

    var pic1;
    var pic2;

    function create() {

        pic1 = myGame.add.sprite(0, 0, 'backdrop1');
        pic2 = myGame.add.sprite(0, 0, 'backdrop2');

        //  Creates a basic emitter, bursting out 50 default sprites (i.e. 16x16 white boxes)
        emitter = myGame.add.emitter(myGame.stage.centerX, myGame.stage.centerY);
        emitter.makeParticles('jet', 50, false, 0);
        emitter.setRotation(0, 0);
        emitter.start(false, 10, 0.1);

        //  Make sure the camera doesn't clip anything
        myGame.camera.disableClipping = true;

        myGame.stage.scale.enterLandscape.add(goneLandscape, this);
        myGame.stage.scale.enterPortrait.add(gonePortrait, this);

        myGame.onRenderCallback = render;

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

        myGame.stage.context.fillStyle = 'rgb(255,0,0)';
        myGame.stage.context.font = '20px Arial';
        //myGame.stage.context.fillText("ttc: " + myGame._raf.timeToCall.toString(), 0, 64);

    }

})();
