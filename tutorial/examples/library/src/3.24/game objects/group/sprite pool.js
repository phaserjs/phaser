var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var group;

var caption;

var captionStyle = {
    fill: '#7fdbff',
    fontFamily: 'monospace',
    lineSpacing: 4
};

var captionTextFormat = (
    'Total:    %1\n' +
    'Max:      %2\n' +
    'Active:   %3\n' +
    'Inactive: %4\n' +
    'Used:     %5\n' +
    'Free:     %6\n' +
    'Full:     %7\n'
);

var game = new Phaser.Game(config);

function preload () {
    this.load.image('space', 'assets/skies/space.jpg');
    this.load.spritesheet('alien', 'assets/tests/invaders/invader1.png', { frameWidth: 32, frameHeight: 32 });
}

function create () {
    this.anims.create({
        key: 'creep',
        frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });

    this.add.image(400, 300, 'space');

    group = this.add.group({
        defaultKey: 'alien',
        maxSize: 100,
        createCallback: function (alien) {
            alien.setName('alien' + this.getLength());
            console.log('Created', alien.name);
        },
        removeCallback: function (alien) {
            console.log('Removed', alien.name);
        }
    });

    // You could also fill the group first:
    // group.createMultiple({
    //     active: false,
    //     key: group.defaultKey,
    //     repeat: group.maxSize - 1
    // });

    caption = this.add.text(16, 16, '', captionStyle);

    this.time.addEvent({
        delay: 100,
        loop: true,
        callback: addAlien
    });
}

function update () {
    Phaser.Actions.IncY(group.getChildren(), 1);

    group.children.iterate(function (alien) {
        if (alien.y > 600) {
            group.killAndHide(alien);
        }
    });

    caption.setText(Phaser.Utils.String.Format(captionTextFormat, [
        group.getLength(),
        group.maxSize,
        group.countActive(true),
        group.countActive(false),
        group.getTotalUsed(),
        group.getTotalFree(),
        group.isFull()
    ]));
}

function activateAlien (alien) {
    alien
    .setActive(true)
    .setVisible(true)
    .setTint(Phaser.Display.Color.RandomRGB().color)
    .play('creep');
}

function addAlien () {
    // Random position above screen
    const x = Phaser.Math.Between(250, 800);
    const y = Phaser.Math.Between(-64, 0);

    // Find first inactive sprite in group or add new sprite, and set position
    const alien = group.get(x, y);

    // None free or already at maximum amount of sprites in group
    if (!alien) return;

    activateAlien(alien);
}
