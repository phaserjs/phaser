var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.path = 'assets/atlas/';

    //  The megasetHD is a multi-part texture atlas, split over 4 PNGs and 4 JSON files
    //  called megasetHD-0.png to megasetHD-3.png, and megasetHD-0.json to megasetHD-3.json
    //  
    //  The following will automatically load those, based on the key given.
    //  The number means load 0,1,2 and 3 files.

    this.load.multiatlas('megasetHD', 3);

}

var monster;
var f = 0;

function create() {

    //  create a sprite sheet from a frame embedded in a texture atlas
    //  'boom' is the unique local name we'll give the sprite sheet
    //  'megasetHD' is the key of the texture atlas that contains the sprite sheet
    //  'explosion' is the name of the frame within the texture atlas
    //  The rest of the values are the sprite sheet frame sizes and offsets

    this.textures.addSpriteSheetFromAtlas('boom', 'megasetHD', 'explosion', 64, 64, 0, 22);

    //  There is a new texture available called 'boom', which we can assign to game objects:

    monster = this.add.image(0, 0, 'boom', 0);

}

function update() {

    f++;

    if (f === monster.texture.frameTotal)
    {
        f = 0;
    }

    monster.frame = monster.texture.get(f);

}
