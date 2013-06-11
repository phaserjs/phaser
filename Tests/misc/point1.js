/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        game.load.image('box2', 'assets/tests/320x200.png');
        game.load.image('box1', 'assets/sprites/oz_pov_melting_disk.png');
        game.load.image('box', 'assets/sprites/bunny.png');
        game.load.start();
    }
    var sprite;
    var rotate = false;
    function create() {
        game.stage.backgroundColor = 'rgb(0,0,0)';
        game.stage.disablePauseScreen = true;
        sprite = game.add.sprite(game.stage.centerX, game.stage.centerY, 'box');
        //sprite.transform.scale.setTo(0.5, 0.5);
        sprite.transform.origin.setTo(0.3, 0.3);
        game.input.onTap.add(rotateIt, this);
        game.add.tween(sprite.transform.scale).to({
            x: 0.5,
            y: 0.5
        }, 2000, Phaser.Easing.Linear.None, true, 0, true);
        points = [
            new Phaser.Point(), 
            new Phaser.Point(), 
            new Phaser.Point(), 
            new Phaser.Point()
        ];
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
    var points;
    function render() {
        /*
        points = Phaser.SpriteUtils.getCornersAsPoints3(sprite);
        
        game.stage.context.fillStyle = 'rgb(255,255,0)';
        game.stage.context.fillRect(points[0].x, points[0].y, 2, 2);
        game.stage.context.fillRect(points[1].x, points[1].y, 2, 2);
        game.stage.context.fillRect(points[2].x, points[2].y, 2, 2);
        game.stage.context.fillRect(points[3].x, points[3].y, 2, 2);
        */
        var originX = sprite.transform.origin.x * sprite.width;
        var originY = sprite.transform.origin.y * sprite.height;
        var centerX = 0.5 * sprite.width;
        var centerY = 0.5 * sprite.height;
        var distance = Math.sqrt(((originX - centerX) * (originX - centerX)) + ((originY - centerY) * (originY - centerY)));
        var originAngle = Math.atan2(centerY - originY, centerX - originX);
        var sin = Math.sin((sprite.transform.rotation + sprite.transform.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
        var cos = Math.cos((sprite.transform.rotation + sprite.transform.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
        //var px = sprite.x + distance * Math.cos((sprite.transform.rotation * Math.PI / 180) + originAngle);
        //var py = sprite.y + distance * Math.sin((sprite.transform.rotation * Math.PI / 180) + originAngle);
        //  WORKS
        //var px = sprite.x + sprite.transform.distance * Math.cos((sprite.transform.rotation * Math.PI / 180) + sprite.transform.angleToCenter);
        //var py = sprite.y + sprite.transform.distance * Math.sin((sprite.transform.rotation * Math.PI / 180) + sprite.transform.angleToCenter);
        //  Upper Left
        //points[0].setTo(px + (sprite.width / 2) * cos - (sprite.height / 2) * sin, py + (sprite.height / 2) * cos + (sprite.width / 2) * sin);
        //  Upper Right
        //points[1].setTo(px - (sprite.width / 2) * cos - (sprite.height / 2) * sin, py + (sprite.height / 2) * cos - (sprite.width / 2) * sin);
        //  Bottom Left
        //points[2].setTo(px + (sprite.width / 2) * cos + (sprite.height / 2) * sin, py - (sprite.height / 2) * cos + (sprite.width / 2) * sin);
        //  Bottom Right
        //points[3].setTo(px - (sprite.width / 2) * cos + (sprite.height / 2) * sin, py - (sprite.height / 2) * cos - (sprite.width / 2) * sin);
        points = Phaser.SpriteUtils.getCornersAsPoints3(sprite);
        game.stage.context.save();
        game.stage.context.fillStyle = 'rgb(0,255,255)';
        //game.stage.context.fillRect(px, py, 2, 2);
        game.stage.context.fillText('rect width: ' + originX + ' height: ' + originY, 32, 32);
        game.stage.context.fillText('center x: ' + centerX + ' centerY: ' + centerY, 32, 52);
        game.stage.context.fillText('angle: ' + sprite.rotation, 32, 72);
        game.stage.context.fillText('point of rotation x: ' + sprite.transform.origin.x + ' y: ' + sprite.transform.origin.y, 32, 92);
        game.stage.context.fillText('x: ' + sprite.x + ' y: ' + sprite.y, sprite.x + 4, sprite.y);
        game.stage.context.fillRect(points[0].x, points[0].y, 2, 2);
        game.stage.context.fillRect(points[1].x, points[1].y, 2, 2);
        game.stage.context.fillRect(points[2].x, points[2].y, 2, 2);
        game.stage.context.fillRect(points[3].x, points[3].y, 2, 2);
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
