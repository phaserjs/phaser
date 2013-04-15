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

    var chick: Sprite;
    var car: Sprite;
    var mech: Sprite;
    var robot: Sprite;
    var cop: Sprite;

    function create() {

        myGame.camera.backgroundColor = 'rgb(40, 40, 40)';

        chick = myGame.createSprite(64, 64, 'atlas');

        //  You can set the frame based on the frame name (which TexturePacker usually sets to be the filename of the image itself)
        chick.frameName = 'budbrain_chick.png';

        //  Or by setting the frame index
        //chick.frame = 0;

        cop = myGame.createSprite(600, 64, 'atlas');
        cop.frameName = 'ladycop.png';

        robot = myGame.createSprite(50, 300, 'atlas');
        robot.frameName = 'robot.png';

        car = myGame.createSprite(100, 400, 'atlas');
        car.frameName = 'supercars_parsec.png';

        mech = myGame.createSprite(250, 100, 'atlas');
        mech.frameName = 'titan_mech.png';

    }

})();
