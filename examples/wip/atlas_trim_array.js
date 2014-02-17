
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    //  Non-trimmed
    // game.load.atlasJSONArray('atlas', 'assets/sprites/atlas_array_no_trim.png', 'assets/sprites/atlas_json_array_no_trim.json');
    // game.load.atlasJSONHash('atlas', 'assets/sprites/atlas_hash_no_trim.png', 'assets/sprites/atlas_json_hash_no_trim.json');

    //  Trimmed
    // game.load.atlasJSONArray('atlas', 'assets/sprites/atlas_array_trim.png', 'assets/sprites/atlas_json_array_trim.json');
    game.load.atlasJSONHash('atlas', 'assets/sprites/atlas_hash_trim.png', 'assets/sprites/atlas_json_hash_trim.json');

}

var sprite;

function create() {

    sprite = game.add.sprite(330, 100, 'atlas', 'nanoha_taiken_blue');

    sprite = game.add.sprite(530, 100, 'atlas', 'ladycop');

}
