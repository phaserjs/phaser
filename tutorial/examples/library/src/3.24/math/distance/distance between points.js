var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var player;
var ufo;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('eyes', 'assets/sprites/slimeeyes.png');
    this.load.image('ufo', 'assets/sprites/ufo.png');
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();

    player = this.add.image(400, 300, 'eyes');

    ufo = this.add.image(200, 150, 'ufo');

    graphic = this.add.graphics({ lineStyle: { color: 0x00ffff } });
}

function update() {
    if (cursors.left.isDown) {
        player.x -= 5;
    }
    else if (cursors.right.isDown) {
        player.x += 5;
    }

    if (cursors.up.isDown) {
        player.y -= 5;
    }
    else if (cursors.down.isDown) {
        player.y += 5;
    }

    var dist = Phaser.Math.Distance.BetweenPoints(player, ufo);

    graphic
        .clear()
        .strokeCircle(player.x, player.y, dist);
}
