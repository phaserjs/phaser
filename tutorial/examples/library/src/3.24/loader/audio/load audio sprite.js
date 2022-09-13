var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setPath('assets/audio/kyobi/');

    this.load.audioSprite('kyobi', 'kyobi.json', [
        'kyobi.ogg',
        'kyobi.mp3',
        'kyobi.m4a'
    ]);
}

function create ()
{
    var music = this.sound.addAudioSprite('kyobi');

    music.play('title');
    // music.play('gameOver');
    // music.play('nextLevel');

    // text.setText('Playing Dafunk - Hardcore Power (We Believe In Goa - Remix)');
}
