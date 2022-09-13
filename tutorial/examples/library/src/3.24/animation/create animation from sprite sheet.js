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
    this.load.spritesheet('brawler', 'assets/animations/brawler48x48.png', { frameWidth: 48, frameHeight: 48 });
    this.load.image('grid', 'assets/textures/grid-ps2.png');
}

function create ()
{
    this.add.tileSprite(400, 300, 800, 600, 'grid');

    this.add.image(0, 0, 'brawler', '__BASE').setOrigin(0, 0);

    this.add.grid(0, 0, 192, 384, 48, 48).setOrigin(0, 0).setOutlineStyle(0x00ff00);

    this.add.text(200, 24, '<- walk', { color: '#00ff00' }).setOrigin(0, 0.5);
    this.add.text(200, 72, '<- idle', { color: '#00ff00' }).setOrigin(0, 0.5);
    this.add.text(200, 120, '<- kick', { color: '#00ff00' }).setOrigin(0, 0.5);
    this.add.text(200, 168, '<- punch', { color: '#00ff00' }).setOrigin(0, 0.5);
    this.add.text(200, 216, '<- jump', { color: '#00ff00' }).setOrigin(0, 0.5);
    this.add.text(200, 264, '<- jump kick', { color: '#00ff00' }).setOrigin(0, 0.5);
    this.add.text(200, 312, '<- win', { color: '#00ff00' }).setOrigin(0, 0.5);
    this.add.text(200, 360, '<- die', { color: '#00ff00' }).setOrigin(0, 0.5);

    this.add.text(48, 440, 'Click to change animation', { color: '#00ff00' });

    var current = this.add.text(48, 460, 'Playing: walk', { color: '#00ff00' });

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 0, 1, 2, 3 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 5, 6, 7, 8 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'kick',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 10, 11, 12, 13, 10 ] }),
        frameRate: 8,
        repeat: -1,
        repeatDelay: 2000
    });

    this.anims.create({
        key: 'punch',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 15, 16, 17, 18, 17, 15 ] }),
        frameRate: 8,
        repeat: -1,
        repeatDelay: 2000
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpkick',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23, 25, 23, 22, 21 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'win',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 30, 31 ] }),
        frameRate: 8,
        repeat: -1,
        repeatDelay: 2000
    });

    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 35, 36, 37 ] }),
        frameRate: 8,
    });

    var keys = [ 'walk', 'idle', 'kick', 'punch', 'jump', 'jumpkick', 'win', 'die' ];
    var c = 0;

    var cody = this.add.sprite(600, 370);

    cody.setScale(8);
    cody.play('walk');

    this.input.on('pointerdown', function () {

        c++;

        if (c === keys.length)
        {
             c = 0;
        }

        cody.play(keys[c]);

        current.setText('Playing: ' + keys[c]);

    });
}
