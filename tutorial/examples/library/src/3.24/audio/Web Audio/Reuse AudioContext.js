var audioContext;
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.error(e);
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    pixelArt: true,
    audio: {
        context: audioContext
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('explosion', 'assets/atlas/trimsheet/explosion.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bomb', 'assets/sprites/xenon2_bomb.png', { frameWidth: 8, frameHeight: 16 });
    this.load.audio('explosion', ['assets/audio/SoundEffects/explosion.mp3']);
}

function create ()
{
    this.anims.create({
        key: 'rotate',
        frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 3, first: 3 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23, first: 23 }),
        frameRate: 20
    });

    var bomb = this.add.sprite(400, 300, 'bomb');
    bomb.setScale(6, -6);
    bomb.anims.play('rotate');

    this.input.once('pointerdown', function () {

        bomb.visible = false;

        var boom = this.add.sprite(400, 300, 'explosion');
        boom.setScale(6);
        boom.anims.play('explode');

        var explosion = this.sound.add('explosion', {
            volume: 0.5
        });

        explosion.on('ended', function (sound) {

            setTimeout(function () {

                this.sys.game.destroy(true);

                document.addEventListener('mousedown', function newGame () {

                    game = new Phaser.Game(config);

                    document.removeEventListener('mousedown', newGame);

                });

            }.bind(this));

        }, this);

        explosion.play();

    }, this);
}
