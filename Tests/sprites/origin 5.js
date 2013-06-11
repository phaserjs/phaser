/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('disk', 'assets/sprites/oz_pov_melting_disk.png');
        game.load.image('fuji', 'assets/tests/200x100corners.png');
        game.load.image('fuji2', 'assets/tests/200x100corners2.png');
        game.load.image('fuji3', 'assets/tests/320x200.png');
        game.load.image('fuji4', 'assets/tests/320x200g.png');
        game.load.start();
    }
    var fuji;
    var fuji2;
    var fuji3;
    function create() {
        game.stage.backgroundColor = 'rgb(0,0,0)';
        //game.world.setSize(2000, 1200, true);
        //  The sprite is 320 x 200 pixels in size positioned in the middle of the stage
        //fuji = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji4');
        fuji2 = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji3');
        //fuji2 = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji2');
        //fuji3 = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji2');
        //fuji.visible = false;
        //fuji2.visible = false;
        //fuji.texture.alpha = 0.6;
        //fuji2.texture.alpha = 0.6;
        //fuji = game.add.sprite(0, 0, 'fuji');
        //fuji2 = game.add.sprite(0, 0, 'fuji');
        //fuji.transform.scale.setTo(1.5, 1.5);
        //fuji.transform.scale.setTo(1.5, 1.5);
        //fuji.transform.skew.setTo(0.1, 0.1);
        //fuji.texture.alpha = 0.5;
        //fuji.texture.flippedX = true;
        //fuji.texture.flippedY = true;
        //fuji.transform.scale.setTo(2, 2);
        //fuji.transform.scale.setTo(2, 2);
        //  This sets the origin to the center
        //fuji.transform.origin.setTo(0.5, 0.5);
        //fuji.transform.origin.setTo(0, 0);
        fuji2.transform.origin.setTo(1, 1);
        //fuji3.transform.origin.setTo(1, 1);
        game.input.onTap.add(rotateIt, this);
        //game.stage.clear = false;
            }
    function rotateIt() {
        //fuji.rotation += 10;
        fuji2.rotation += 10;
        //fuji3.rotation += 20;
            }
    function update() {
        //fuji.rotation++;
        //fuji2.rotation++;
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            game.camera.x -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            game.camera.x += 4;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            game.camera.y -= 4;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            game.camera.y += 4;
        }
    }
    var points;
    var points2;
    function render() {
        //  This = the center point
        //var cx = fuji2.x + (fuji2.width / 2) * cos - (fuji2.height / 2) * sin;
        //var cy = fuji2.y + (fuji2.height / 2) * cos + (fuji2.width / 2) * sin;
        //  This gives me the top-left of an origin 1,1
        //var cx = fuji2.x + (-fuji2.width / fuji2.transform.origin.x) * cos - (-fuji2.height / fuji2.transform.origin.y) * sin;
        //var cy = fuji2.y + (-fuji2.height / fuji2.transform.origin.y) * cos + (-fuji2.width / fuji2.transform.origin.x) * sin;
        //  This gives me the center point of an origin 1,1
        //var cx = fuji2.x + (-(fuji2.width * fuji2.transform.origin.x) / 2) * cos - (-(fuji2.height * fuji2.transform.origin.y) / 2) * sin;
        //var cy = fuji2.y + (-(fuji2.height * fuji2.transform.origin.y) / 2) * cos + (-(fuji2.width * fuji2.transform.origin.x) / 2) * sin;
        //var dx = 0.5 * fuji2.transform.origin.x;
        //var dy = 0.5 * fuji2.transform.origin.y;
        //dx = 1;
        //dy = 1;
        //console.log(fuji2.width * 0);
        //var cx = fuji2.x + (-(fuji2.width * fuji2.transform.origin.x) / dx) * cos - (-(fuji2.height * fuji2.transform.origin.y) / dy) * sin;
        //var cy = fuji2.y + (-(fuji2.height * fuji2.transform.origin.y) / dy) * cos + (-(fuji2.width * fuji2.transform.origin.x) / dx) * sin;
        //  This gives me the center point of an origin 0,0
        //var cx = fuji2.x + ((fuji2.width * fuji2.transform.origin.x) / 2) * cos - ((fuji2.height * fuji2.transform.origin.y) / 2) * sin;
        //var cy = fuji2.y + ((fuji2.height * fuji2.transform.origin.y) / 2) * cos + ((fuji2.width * fuji2.transform.origin.x) / 2) * sin;
        //  center points
        //game.stage.context.fillStyle = 'rgb(255,255,0)';
        //game.stage.context.fillRect(fuji.x, fuji.y, 4, 4);
        //game.stage.context.fillRect(fuji2.x, fuji2.y, 4, 4);
        //game.stage.context.fillRect(cx, cy, 4, 4);
        var sin = Math.sin((fuji2.transform.rotation + fuji2.transform.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
        var cos = Math.cos((fuji2.transform.rotation + fuji2.transform.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
        var originX = fuji2.transform.origin.x * fuji2.width;
        var originY = fuji2.transform.origin.y * fuji2.height;
        var centerX = 0.5 * fuji2.width;
        var centerY = 0.5 * fuji2.height;
        var distanceX = originX - centerX;
        var distanceY = originY - centerY;
        var distance = Math.sqrt(((originX - centerX) * (originX - centerX)) + ((originY - centerY) * (originY - centerY)));
        var px = fuji2.x + distance * Math.cos(fuji2.transform.rotation + 45 * Math.PI / 180);
        var py = fuji2.y + distance * Math.sin(fuji2.transform.rotation + 45 * Math.PI / 180);
        game.stage.context.save();
        game.stage.context.fillStyle = 'rgb(255,255,0)';
        game.stage.context.fillText('rect width: ' + originX + ' height: ' + originY, 32, 32);
        game.stage.context.fillText('center x: ' + centerX + ' centerY: ' + centerY, 32, 52);
        game.stage.context.fillText('angle: ' + fuji2.rotation, 32, 72);
        game.stage.context.fillText('point of rotation x: ' + fuji2.transform.origin.x + ' y: ' + fuji2.transform.origin.y, 32, 92);
        game.stage.context.fillText('x: ' + fuji2.x + ' y: ' + fuji2.y, fuji2.x + 4, fuji2.y);
        game.stage.context.restore();
        game.stage.context.save();
        game.stage.context.fillStyle = 'rgba(255,255,255,0.1)';
        game.stage.context.arc(fuji2.x, fuji2.y, distance, 0, Math.PI * 2);
        game.stage.context.fill();
        game.stage.context.restore();
        //points = Phaser.SpriteUtils.getCornersAsPoints(fuji);
        //game.stage.context.fillStyle = 'rgb(255,255,255)';
        //game.stage.context.fillRect(points[0].x, points[0].y, 2, 2);
        //game.stage.context.fillRect(points[1].x, points[1].y, 2, 2);
        //game.stage.context.fillRect(points[2].x, points[2].y, 2, 2);
        //game.stage.context.fillRect(points[3].x, points[3].y, 2, 2);
        //points2 = Phaser.SpriteUtils.getCornersAsPoints2(fuji2);
        //game.stage.context.fillStyle = 'rgb(255,0,0)';
        //game.stage.context.fillRect(points2[0].x, points2[0].y, 2, 2);
        //game.stage.context.fillRect(points2[1].x, points2[1].y, 2, 2);
        //game.stage.context.fillRect(points2[2].x, points2[2].y, 2, 2);
        //game.stage.context.fillRect(points2[3].x, points2[3].y, 2, 2);
        /*
        //game.stage.context.fillStyle = 'rgb(255,255,255)';
        //game.stage.context.fillRect(fuji.x, fuji.y, 2, 2);
        
        //var sin = Math.sin(game.math.degreesToRadians(fuji.rotation));
        //var cos = Math.cos(game.math.degreesToRadians(fuji.rotation));
        
        //var fx = fuji.x + (fuji.width * fuji.transform.origin.x);
        //var fy = fuji.y + (fuji.height * fuji.transform.origin.y);
        
        //  center x/y
        //var cx = fuji.width * 0.5;
        //var cy = fuji.height * 0.5;
        
        //var ax = fuji.width * fuji.transform.origin.x;
        //var ay = fuji.height * fuji.transform.origin.y;
        
        //var dx = cx - ax;
        //var dy = cy - ay;
        
        //var fx = fuji.x - dx;
        //var fy = fuji.y - dy;
        
        /*
        var ox = fuji.x + (fuji.width * fuji.transform.origin.x);
        var oy = fuji.y + (fuji.height * fuji.transform.origin.y);
        var cx = fuji.x + (fuji.width * 0.5);
        var cy = fuji.y + (fuji.height * 0.5);
        
        var dx = ox - cx;
        var dy = oy - cy;
        
        game.stage.context.fillText('dx: ' + dx + ' dy: ' + dy, 300, 100);
        
        var fx = fuji.x + dx;
        var fy = fuji.y + dy;
        
        //game.stage.context.fillStyle = 'rgb(255,0,255)';
        //game.stage.context.fillRect(cx, cy, 20, 20);
        
        //UL  =  x + ( Width / 2 ) * cos A - ( Height / 2 ) * sin A
        //ul.x = fuji.x + (fuji.width / 2) * cos - (fuji.height / 2) * sin;
        ul.x = fx + (fuji.width / 2) * cos - (fuji.height / 2) * sin;
        
        //UL  =  y + ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
        //ul.y = fuji.y + (fuji.height / 2) * cos + (fuji.width / 2) * sin;
        ul.y = fy + (fuji.height / 2) * cos + (fuji.width / 2) * sin;
        
        //UR  =  x - ( Width / 2 ) * cos A - ( Height / 2 ) * sin A
        //ur.x = fuji.x - (fuji.width / 2) * cos - (fuji.height / 2) * sin;
        ur.x = fx - (fuji.width / 2) * cos - (fuji.height / 2) * sin;
        
        //UR  =  y + ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A
        //ur.y = fuji.y + (fuji.height / 2) * cos - (fuji.width / 2) * sin;
        ur.y = fy + (fuji.height / 2) * cos - (fuji.width / 2) * sin;
        
        //BL =   x + ( Width / 2 ) * cos A + ( Height / 2 ) * sin A
        //bl.x = fuji.x + (fuji.width / 2) * cos + (fuji.height / 2) * sin;
        bl.x = fx + (fuji.width / 2) * cos + (fuji.height / 2) * sin;
        
        //BL =   y - ( Height / 2 ) * cos A  + ( Width / 2 ) * sin A
        //bl.y = fuji.y - (fuji.height / 2) * cos + (fuji.width / 2) * sin;
        bl.y = fy - (fuji.height / 2) * cos + (fuji.width / 2) * sin;
        
        //BR  =  x - ( Width / 2 ) * cos A + ( Height / 2 ) * sin A
        //br.x = fuji.x - (fuji.width / 2) * cos + (fuji.height / 2) * sin;
        br.x = fx - (fuji.width / 2) * cos + (fuji.height / 2) * sin;
        
        //BR  =  y - ( Height / 2 ) * cos A  - ( Width / 2 ) * sin A
        //br.y = fuji.y - (fuji.height / 2) * cos - (fuji.width / 2) * sin;
        br.y = fy - (fuji.height / 2) * cos - (fuji.width / 2) * sin;
        
        game.stage.context.fillStyle = 'rgb(255,255,0)';
        game.stage.context.fillRect(ul.x, ul.y, 2, 2);
        game.stage.context.fillRect(ur.x, ur.y, 2, 2);
        game.stage.context.fillRect(bl.x, bl.y, 2, 2);
        game.stage.context.fillRect(br.x, br.y, 2, 2);
        
        
        
        //game.stage.context.fillRect(fuji.x - fuji.width / 2, fuji.y - fuji.width / 2, 2, 2);
        
        //game.stage.context.fillStyle = 'rgb(255,255,0)';
        //game.stage.context.fillRect(fuji2.x, fuji2.y, 2, 2);
        
        //game.stage.context.fillStyle = 'rgb(255,255,0)';
        //game.stage.context.fillRect(fuji.cameraView.x + fuji.cameraView.halfWidth, fuji.cameraView.y + fuji.cameraView.halfHeight, 2, 2);
        
        //game.stage.context.strokeStyle = 'rgb(255,255,0)';
        //game.stage.context.strokeRect(fuji.cameraView.x, fuji.cameraView.y, fuji.cameraView.width, fuji.cameraView.height);
        
        //game.stage.context.strokeStyle = 'rgb(0,255,0)';
        //game.stage.context.strokeRect(fuji.x, fuji.y, wn, hn);
        
        //game.camera.renderDebugInfo(32, 32);
        
        //Phaser.DebugUtils.renderSpriteInfo(fuji, 32, 32);
        */
        //game.stage.context.strokeStyle = 'rgb(255,255,0)';
        //game.stage.context.strokeRect(fuji.cameraView.x, fuji.cameraView.y, fuji.cameraView.width, fuji.cameraView.height);
            }
})();
