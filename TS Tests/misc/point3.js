/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);
    function preload() {
        game.load.atlas('bot', 'assets/sprites/running_bot.png', null, botData);
    }
    var sprite;
    var rotate = false;
    function create() {
        game.stage.backgroundColor = 'rgb(0,0,0)';
        sprite = game.add.sprite(game.stage.centerX, game.stage.centerY, 'bot');
        sprite.animations.add('run', null, 10, true);
        sprite.animations.play('run');
        //sprite.transform.scale.setTo(4, 4);
        game.input.onTap.add(rotateIt, this);
    }
    function rotateIt() {
        if(rotate == false) {
            rotate = true;
        } else {
            rotate = false;
        }
    }
    function update() {
        if(rotate) {
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
    var botData = '{"frames": [{"filename": "running bot.swf/0000","frame": { "x": 34, "y": 128, "w": 56, "h": 60 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 0, "y": 2, "w": 56, "h": 60 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0001","frame": { "x": 54, "y": 0, "w": 56, "h": 58 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 0, "y": 3, "w": 56, "h": 58 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0002","frame": { "x": 54, "y": 58, "w": 56, "h": 58 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 0, "y": 3, "w": 56, "h": 58 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0003","frame": { "x": 0, "y": 192, "w": 34, "h": 64 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 11, "y": 0, "w": 34, "h": 64 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0004","frame": { "x": 0, "y": 64, "w": 54, "h": 64 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 1, "y": 0, "w": 54, "h": 64 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0005","frame": { "x": 196, "y": 0, "w": 56, "h": 58 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 0, "y": 3, "w": 56, "h": 58 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0006","frame": { "x": 0, "y": 0, "w": 54, "h": 64 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 1, "y": 0, "w": 54, "h": 64 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0007","frame": { "x": 140, "y": 0, "w": 56, "h": 58 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 0, "y": 3, "w": 56, "h": 58 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0008","frame": { "x": 34, "y": 188, "w": 50, "h": 60 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 3, "y": 2, "w": 50, "h": 60 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0009","frame": { "x": 0, "y": 128, "w": 34, "h": 64 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 11, "y": 0, "w": 34, "h": 64 },"sourceSize": { "w": 56, "h": 64 }},{"filename": "running bot.swf/0010","frame": { "x": 84, "y": 188, "w": 56, "h": 58 },"rotated": false,"trimmed": true,"spriteSourceSize": { "x": 0, "y": 3, "w": 56, "h": 58 },"sourceSize": { "w": 56, "h": 64 }}]}';
})();
