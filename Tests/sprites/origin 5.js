/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('fuji', 'assets/pics/atari_fujilogo.png');
        game.load.start();
    }
    var fuji;
    var wn;
    var hn;
    function create() {
        game.stage.backgroundColor = 'rgb(0,0,100)';
        game.world.setSize(2000, 1200, true);
        //  The sprite is 320 x 200 pixels in size positioned in the middle of the stage
        fuji = game.add.sprite(game.stage.centerX, game.stage.centerY, 'fuji');
        //fuji.transform.scale.setTo(1.5, 1.5);
        //fuji.transform.scale.setTo(1.5, 1.5);
        //fuji.transform.skew.setTo(0.1, 0.1);
        //fuji.texture.alpha = 0.5;
        fuji.texture.renderRotation = false;
        //fuji.texture.flippedX = true;
        //fuji.texture.flippedY = true;
        //fuji.transform.scale.setTo(2, 2);
        //fuji.transform.scale.setTo(2, 2);
        //  This sets the origin to the center
        //fuji.transform.origin.setTo(0.5, 0.5);
        game.input.onTap.add(rotateIt, this);
    }
    function rotateIt() {
        fuji.rotation += 20;
        console.log(fuji.rotation);
    }
    function update() {
        var s = Math.sin(fuji.rotation);
        var c = Math.cos(fuji.rotation);
        if(s < 0) {
            s = -s;
        }
        if(c < 0) {
            c = -c;
        }
        wn = fuji.width * s + fuji.width * c;
        hn = fuji.height * c + fuji.height * s;
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
    function render() {
        game.stage.context.fillStyle = 'rgb(255,255,255)';
        game.stage.context.fillRect(fuji.x, fuji.y, 2, 2);
        game.stage.context.fillStyle = 'rgb(255,255,0)';
        game.stage.context.fillRect(fuji.x + fuji.transform.centerX, fuji.y + fuji.transform.centerY, 2, 2);
        game.stage.context.strokeStyle = 'rgb(255,0,0)';
        game.stage.context.strokeRect(fuji.worldView.x, fuji.worldView.y, fuji.worldView.width, fuji.worldView.height);
        game.stage.context.strokeStyle = 'rgb(0,255,0)';
        game.stage.context.strokeRect(fuji.x, fuji.y, wn, hn);
        game.camera.renderDebugInfo(32, 32);
    }
})();
