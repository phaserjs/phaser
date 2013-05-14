/// <reference path="../../Phaser/Game.ts" />

(function () {

    //  Here we create a quite tiny game (320x240 in size)
    var myGame = new Phaser.Game(this, 'game', 320, 240, init, create, update);

    function init() {

        //  This sets a limit on the up-scale
        myGame.stage.scale.maxWidth = 640;
        myGame.stage.scale.maxHeight = 480;

        //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        myGame.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;

        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');

        myGame.loader.load();

    }

    function create() {

        myGame.world.setSize(2000, 2000);

        for (var i = 0; i < 1000; i++)
        {
            myGame.createSprite(myGame.world.randomX, myGame.world.randomY, 'melon');
        }

        myGame.onRenderCallback = render;

    }

    function update() {

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            myGame.camera.scroll.x -= 4;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            myGame.camera.scroll.x += 4;
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            myGame.camera.scroll.y -= 4;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            myGame.camera.scroll.y += 4;
        }

    }

    function render() {

        myGame.input.renderDebugInfo(16, 16);

    }

})();
