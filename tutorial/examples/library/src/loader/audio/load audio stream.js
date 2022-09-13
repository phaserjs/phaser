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

var text;

var game = new Phaser.Game(config);

function preload ()
{
    text = this.add.text(10, 10, 'Loading audio ...', { font: '16px Courier', fill: '#00ff00' });

    this.load.audio('dafunk', [
        'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).ogg',
        'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).mp3',
        'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).m4a'
    ], { stream: true });
}

function create ()
{
    this.sound.pauseOnBlur = false;

    var music = this.sound.add('dafunk');

    music.play();

    text.setText('Playing Dafunk - Hardcore Power (We Believe In Goa - Remix)');
}
