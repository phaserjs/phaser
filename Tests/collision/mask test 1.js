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
    var atari3;
    function create() {
        atari1 = myGame.createSprite(270, 100, 'atari1');
        atari2 = myGame.createSprite(400, 400, 'atari2');
        atari3 = myGame.createSprite(0, 440, 'atari1');
        atari1.collisionMask.height = 16;
        atari3.collisionMask.width = 16;
        atari1.elasticity = 0.5;
        atari3.elasticity = 0.5;
        atari2.immovable = true;
        atari1.renderDebug = true;
        atari2.renderDebug = true;
        atari3.renderDebug = true;
        myGame.input.onTap.addOnce(startDrop, this);
    }
    function startDrop() {
        atari1.velocity.y = 100;
        atari3.velocity.x = 100;
    }
    function update() {
        myGame.collide(myGame.world.group);
    }
    function collides(a, b) {
        console.log('Collision!!!!!');
    }
    function render() {
    }
})();
