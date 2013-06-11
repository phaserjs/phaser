/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.load.image('box', 'assets/tests/320x200.png');
        game.load.start();

    }

    var sprite: Phaser.Sprite;
    var rotate: bool = false;

    function create() {

        game.stage.backgroundColor = 'rgb(0,0,0)';
        game.stage.disablePauseScreen = true;

        sprite = game.add.sprite(game.stage.centerX, game.stage.centerY, 'box');

        sprite.transform.origin.setTo(0.3, 0.8);

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

        var originX: number = sprite.transform.origin.x * sprite.width;
        var originY: number = sprite.transform.origin.y * sprite.height;
        var centerX: number = 0.5 * sprite.width;
        var centerY: number = 0.5 * sprite.height;
        var distanceX: number = originX - centerX;
        var distanceY: number = originY - centerY;
        var distance: number = Math.sqrt(((originX - centerX) * (originX - centerX)) + ((originY - centerY) * (originY - centerY)));

        var px = sprite.x + distance * Math.cos(sprite.transform.rotation + 45 * Math.PI / 180);
        var py = sprite.y + distance * Math.sin(sprite.transform.rotation + 45 * Math.PI / 180);

        game.stage.context.save();
        game.stage.context.fillStyle = 'rgb(255,255,0)';
        game.stage.context.fillText('rect width: ' + originX + ' height: ' + originY, 32, 32);
        game.stage.context.fillText('center x: ' + centerX + ' centerY: ' + centerY, 32, 52);
        game.stage.context.fillText('angle: ' + sprite.rotation , 32, 72);
        game.stage.context.fillText('point of rotation x: ' + sprite.transform.origin.x + ' y: ' + sprite.transform.origin.y, 32, 92);
        game.stage.context.fillText('sprite x: ' + sprite.x + ' sprite y: ' + sprite.y, 32, 112);
        game.stage.context.fillRect(sprite.x, sprite.y, 2, 2);
        game.stage.context.restore();

        game.stage.context.save();
        game.stage.context.fillStyle = 'rgba(255,255,255,0.1)';
        game.stage.context.beginPath();
        game.stage.context.moveTo(sprite.x, sprite.y);
        game.stage.context.arc(sprite.x, sprite.y, distance, 0, Math.PI * 2);
        game.stage.context.closePath();
        game.stage.context.fill();
        game.stage.context.restore();

    }

})();
