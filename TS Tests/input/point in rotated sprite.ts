/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {

        game.load.image('sprite', 'assets/sprites/atari130xe.png');
        

    }

    var sprite: Phaser.Sprite;
    var rotate: bool = false;

    function create() {

        sprite = game.add.sprite(200, 200, 'sprite');

        game.input.onTap.add(rotateIt, this);

    }

    function rotateIt() {
        if (rotate == false) { rotate = true; } else { rotate = false; }
    }

    var inPoint: bool = false;

    function update() {

        if (rotate)
        {
            sprite.rotation++;
        }

        inPoint = Phaser.SpriteUtils.overlapsXY(sprite, game.input.x, game.input.y);

    }

    function render() {

        game.stage.context.save();
        game.stage.context.fillStyle = 'rgb(255,0,255)';

        game.stage.context.fillText('x: ' + Math.round(sprite.transform.upperLeft.x) + ' y: ' + Math.round(sprite.transform.upperLeft.y), sprite.transform.upperLeft.x, sprite.transform.upperLeft.y);
        game.stage.context.fillText('x: ' + Math.round(sprite.transform.upperRight.x) + ' y: ' + Math.round(sprite.transform.upperRight.y), sprite.transform.upperRight.x, sprite.transform.upperRight.y);
        game.stage.context.fillText('x: ' + Math.round(sprite.transform.bottomLeft.x) + ' y: ' + Math.round(sprite.transform.bottomLeft.y), sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y);
        game.stage.context.fillText('x: ' + Math.round(sprite.transform.bottomRight.x) + ' y: ' + Math.round(sprite.transform.bottomRight.y), sprite.transform.bottomRight.x, sprite.transform.bottomRight.y);

        Phaser.DebugUtils.renderInputInfo(32, 32);

        game.stage.context.fillText('in: ' + inPoint, 300, 32);

        game.stage.context.restore();

    }

})();
