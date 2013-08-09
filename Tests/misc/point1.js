/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {
        game.load.image('box2', 'assets/tests/320x200.png');
        game.load.image('box1', 'assets/sprites/oz_pov_melting_disk.png');
        game.load.image('box', 'assets/sprites/bunny.png');
    }

    var sprite;
    var rotate = false;

    function create() {
        game.stage.backgroundColor = 'rgb(0,0,0)';

        sprite = game.add.sprite(game.stage.centerX, game.stage.centerY, 'box');

        //sprite.transform.scale.setTo(0.5, 0.5);
        sprite.transform.origin.setTo(1, 1);

        //sprite.transform.origin.setTo(0.5, 0.5);
        game.input.onTap.add(rotateIt, this);
        //game.add.tween(sprite.transform.scale).to({ x: 0.5, y: 0.5 }, 2000, Phaser.Easing.Linear.None, true, 0, true);
    }

    function rotateIt() {
        if (rotate == false) {
            rotate = true;
        } else {
            rotate = false;
        }
    }

    function update() {
        if (rotate) {
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
