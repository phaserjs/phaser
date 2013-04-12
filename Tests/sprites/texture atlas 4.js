/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
(function () {
    var myGame = new Game(this, 'game', 800, 600, init, create);
    function init() {
        //  Texture Atlas Method 4
        //
        //  We load a TexturePacker JSON file and image and show you how to make several unique sprites from the same file
        myGame.loader.addTextureAtlas('atlas', 'assets/pics/texturepacker_test.png', 'assets/pics/texturepacker_test.json');
        myGame.loader.load();
    }
    var chick;
    var car;
    var mech;
    var robot;
    var cop;
    function create() {
        myGame.camera.backgroundColor = 'rgb(40, 40, 40)';
        chick = myGame.createSprite(64, 64, 'atlas');
        chick.animations.frame = 0;
        cop = myGame.createSprite(600, 64, 'atlas');
        cop.animations.frame = 2;
        robot = myGame.createSprite(50, 300, 'atlas');
        robot.animations.frame = 3;
        car = myGame.createSprite(100, 400, 'atlas');
        car.animations.frame = 4;
        mech = myGame.createSprite(250, 100, 'atlas');
        mech.animations.frame = 5;
    }
})();
