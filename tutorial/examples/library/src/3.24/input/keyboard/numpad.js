var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('bobs', 'assets/sprites/bobs-by-cleathley.png', { frameWidth: 32, frameHeight: 32 });
}

function create ()
{
    this.input.keyboard.on('keydown_NUMPAD_ZERO', function () {
        this.add.image(0, 0, 'bobs', 0).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_ONE', function () {
        this.add.image(0, 0, 'bobs', 8).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_TWO', function () {
        this.add.image(0, 0, 'bobs', 16).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_THREE', function () {
        this.add.image(0, 0, 'bobs', 24).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_FOUR', function () {
        this.add.image(0, 0, 'bobs', 32).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_FIVE', function () {
        this.add.image(0, 0, 'bobs', 48).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_SIX', function () {
        this.add.image(0, 0, 'bobs', 80).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_SEVEN', function () {
        this.add.image(0, 0, 'bobs', 52).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_EIGHT', function () {
        this.add.image(0, 0, 'bobs', 60).setRandomPosition();
    }, this);

    this.input.keyboard.on('keydown_NUMPAD_NINE', function () {
        this.add.image(0, 0, 'bobs', 68).setRandomPosition();
    }, this);
}