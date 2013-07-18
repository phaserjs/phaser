/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('atari1', 'assets/sprites/atari130xe.png');
        myGame.loader.addImageFile('atari2', 'assets/sprites/atari800xl.png');
        myGame.loader.load();
    }
    var atari1;
    var atari2;
    function create() {
        atari1 = myGame.add.sprite(400, 100, 'atari1');
        atari2 = myGame.add.sprite(400, 400, 'atari2');
        //atari1.collisionMask.createCircle(64);
        //atari1.rotation = 45;
        atari1.elasticity = 0.5;
        //atari2.collisionMask.createCircle(64);
        atari2.immovable = true;
        atari1.renderDebug = true;
        atari2.renderDebug = true;
        myGame.input.onTap.addOnce(startDrop, this);
    }
    function startDrop() {
        atari1.velocity.y = 100;
    }
    function update() {
        myGame.collide(myGame.world.group);
    }
    function collides(a, b) {
        console.log('Collision!!!!!');
    }
    function render() {
        //atari1.ren
            }
})();
