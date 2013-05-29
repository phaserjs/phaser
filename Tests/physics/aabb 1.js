/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.loader.addImageFile('bunny', 'assets/sprites/atari800xl.png');
        game.loader.load();
    }
    var atari;
    function create() {
        atari = game.add.sprite(200, 200, 'bunny');
        //game.add.physicsAABB(200, 200, 233, 99);
            }
    function update() {
        //atari.y += 0.2;
            }
})();
