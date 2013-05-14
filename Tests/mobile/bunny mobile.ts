/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 320, 460, init, create, update);

    function init() {

        myGame.loader.addImageFile('bunny', 'assets/sprites/wabbit.png');

        myGame.loader.load();

        myGame.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;

    }

    var maxX: number;
    var maxY: number;
    var minX: number;
    var minY: number;

    function create() {

        minX = 0;
        minY = 0;
        maxX = myGame.stage.width - 26;
        maxY = myGame.stage.height - 37;

        myGame.input.touch.touchDown.add(addBunnies, this);

        //  This will really help on slow Android phones
        myGame.framerate = 30;
        //  Make sure the camera doesn't clip anything
        myGame.camera.disableClipping = true;

        myGame.onRenderCallback = render;
        myGame.stage.context.fillStyle = 'rgb(255,0,0)';
        myGame.stage.context.font = '20px Arial';

        addBunnies();

    }

    function addBunnies() {

        for (var i = 0; i < 10; i++)
        {
            var tempSprite = myGame.createSprite(myGame.stage.randomX, 0, 'bunny');
            tempSprite.velocity.x = -200 + (Math.random() * 400);
            tempSprite.velocity.y = 100 + Math.random() * 200;
        }

    }

    function update() {

        myGame.world.group.forEach(checkWalls);

    }

    function render() {

        //  Note: Displaying canvas text causes a big performance hit on mobile
        myGame.stage.context.fillText("fps: " + myGame.time.fps.toString(), 0, 32);

    }

    function checkWalls(bunny:Phaser.Sprite) {

        if (bunny.x > maxX)
        {
            bunny.velocity.x *= -1;
            bunny.x = maxX;
        }
        else if (bunny.x < minX)
        {
            bunny.velocity.x *= -1;
            bunny.x = minX;
        }

        if (bunny.y > maxY)
        {
            bunny.velocity.y *= -0.8;
            bunny.y = maxY;
        }
        else if (bunny.y < minY)
        {
            bunny.velocity.x = -200 + (Math.random() * 400);
            bunny.velocity.y = 100 + Math.random() * 200;
            bunny.y = minY;
        }

    }

})();
