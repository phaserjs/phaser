var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.audio('synth1', [
        'assets/audio/tech/synth1.ogg',
        'assets/audio/tech/synth1.mp3'
    ]);
}

function create ()
{
    var sound1 = this.sound.add('synth1', { loop: true });
    var sound2 = this.sound.add('synth1', { loop: true });

    sound1.play();
}
