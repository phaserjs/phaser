var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('blocks', 'assets/bugs/BlockMap-extruded.png');
    this.load.spritesheet('smileys', 'assets/bugs/SmileyMap.png', { frameWidth: 26, frameHeight: 26 });
}

function create ()
{
    var data = [[0, 0, 0], [0, 0, 0], [9, 9, 9]];

    var map = this.make.tilemap({ data, tileWidth: 16, tileHeight: 16 });

    var tileset = map.addTilesetImage('blocks', null, 16, 16, 1, 2);

    // var tileset = map.addTilesetImage('blocks', null, 16, 16, 0, 0);

    // map.createLayer(0, tileset, 0, 0);

    map.createStaticLayer(0, tileset, 0, 0);

    var player = this.add.sprite(0, 0.5, 'smileys', 0);

    this.cameras.main.startFollow(player);
}
