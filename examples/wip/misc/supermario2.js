
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {

    game.load.tilemap('background', 'assets/maps/smb_bg.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tilesBackground', 'assets/maps/smb_bg.png',16,16);

    game.load.tilemap('level1', 'assets/maps/smb_level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tilesLevel1', 'assets/maps/smb_tiles.png',16,16);

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var mapBg;
var tilesetBg;
var layerBg;
var mapLevel1;
var tilesetLevel1;
var layerLevel1;
var cursors;
var balls;

function create() {

    game.stage.backgroundColor = '#787878';

    mapBg = game.add.tilemap('background');

    tilesetBg = game.add.tileset('tilesBackground');


    layerBg = game.add.tilemapLayer(0, 0, mapBg.layers[0].width*tilesetBg.tileWidth, 600, tilesetBg, mapBg, 0);

    layerBg.fixedToCamera=false;
 
    layerBg.resizeWorld();


    mapLevel1 = game.add.tilemap('level1');

    tilesetLevel1 = game.add.tileset('tilesLevel1');

    tilesetLevel1.setCollisionRange(9,11,true,true,true,true);
    tilesetLevel1.setCollisionRange(14,19,true,true,true,true);
    tilesetLevel1.setCollisionRange(22,24,true,true,true,true);
    tilesetLevel1.setCollisionRange(37,38,true,true,true,true);

    tilesetLevel1.setCollision(32,true,true,true,true);


    layerLevel1 = game.add.tilemapLayer(0, 0, mapLevel1.layers[0].width*tilesetLevel1.tileWidth, 600, tilesetLevel1, mapLevel1, 0);

    layerLevel1.fixedToCamera=false;

    layerLevel1.resizeWorld();

    cursors=game.input.keyboard.createCursorKeys();

    balls = game.add.emitter(300, 50, 500);
    balls.bounce = 0.5;
    balls.makeParticles('balls', [0,1,2,3,4,5], 500, 1);
    balls.minParticleSpeed.setTo(-150, 150);
    balls.maxParticleSpeed.setTo(100, 100);
    balls.gravity = 8;
    balls.start(false, 5000, 50);

    game.add.tween(balls).to({ x: 4000 }, 7500, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);

}

function update() {

    game.physics.collide(balls,layerLevel1);

    if (cursors.left.isDown)
    {
        game.camera.x -= 18;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 18;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 18;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 18;
    }

}
