/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {

        game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
        

    }

    var sprite: Phaser.Sprite;
    var rotate: bool = false;

    function create() {

        game.stage.backgroundColor = 'rgb(0,0,0)';

        sprite = game.add.sprite(game.stage.centerX, game.stage.centerY, 'mummy');

        sprite.animations.add('walk');
        sprite.animations.play('walk', 20, true);

        sprite.transform.scale.setTo(4, 4);

        game.input.onTap.add(rotateIt, this);

    }

    function rotateIt() {
        if (rotate == false) { rotate = true; } else { rotate = false; }
    }

    function update() {

        if (rotate)
        {
            sprite.rotation++;
        }

    }

    function render() {

        game.stage.context.save();
        game.stage.context.fillStyle = 'rgb(255,0,255)';

        game.stage.context.fillText('x: ' + Math.round(sprite.transform.upperLeft.x) + ' y: ' + Math.round(sprite.transform.upperLeft.y), sprite.transform.upperLeft.x, sprite.transform.upperLeft.y);
        game.stage.context.fillText('x: ' + Math.round(sprite.transform.upperRight.x) + ' y: ' + Math.round(sprite.transform.upperRight.y), sprite.transform.upperRight.x, sprite.transform.upperRight.y);
        game.stage.context.fillText('x: ' + Math.round(sprite.transform.bottomLeft.x) + ' y: ' + Math.round(sprite.transform.bottomLeft.y), sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y);
        game.stage.context.fillText('x: ' + Math.round(sprite.transform.bottomRight.x) + ' y: ' + Math.round(sprite.transform.bottomRight.y), sprite.transform.bottomRight.x, sprite.transform.bottomRight.y);

        game.stage.context.fillRect(sprite.transform.center.x, sprite.transform.center.y, 2, 2);
        game.stage.context.fillRect(sprite.transform.upperLeft.x, sprite.transform.upperLeft.y, 2, 2);
        game.stage.context.fillRect(sprite.transform.upperRight.x, sprite.transform.upperRight.y, 2, 2);
        game.stage.context.fillRect(sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y, 2, 2);
        game.stage.context.fillRect(sprite.transform.bottomRight.x, sprite.transform.bottomRight.y, 2, 2);

        game.stage.context.strokeStyle = 'rgb(255,255,0)';
        game.stage.context.strokeRect(sprite.cameraView.x, sprite.cameraView.y, sprite.cameraView.width, sprite.cameraView.height);

        game.stage.context.restore();

    }

})();
