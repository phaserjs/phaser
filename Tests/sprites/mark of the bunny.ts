/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Group.ts" />
/// <reference path="../../Phaser/Sprite.ts" />

(function () {

    var myGame = new Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('bunny', 'assets/sprites/wabbit.png');

        myGame.loader.load();

    }

    var maxX: number;
    var maxY: number;
    var minX: number;
    var minY: number;
    var fps: HTMLTextAreaElement;

    function create() {

        //  FPS counter TextArea
        fps = <HTMLTextAreaElement> document.createElement('textarea');
        fps.style.width = '300px';
        fps.style.height = '100px';
        document.getElementById('game').appendChild(fps);

        minX = 0;
        minY = 0;
        maxX = myGame.stage.width - 26;
        maxY = myGame.stage.height - 37;

        addBunnies(500);

    }

    function addBunnies(quantity) {

        for (var i = 0; i < quantity; i++)
        {
            var tempSprite = myGame.createSprite(myGame.stage.randomX, 0, 'bunny');
            tempSprite.velocity.x = -200 + (Math.random() * 400);
            tempSprite.velocity.y = 100 + Math.random() * 200;

            myGame.world.addExistingSprite(tempSprite);
        }

    }

    function update() {

        fps.textContent = 'Press Up to add more\n\nBunnies: ' + myGame.world.group.length + '\nFPS: ' + myGame.time.fps + ' (' + myGame.time.fpsMin + '-' + myGame.time.fpsMax + ')';

        myGame.world.group.forEach(checkWalls);

        if (myGame.input.keyboard.isDown(Keyboard.UP))
        {
            addBunnies(10);
        }

    }

    function checkWalls(bunny:Sprite) {

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
