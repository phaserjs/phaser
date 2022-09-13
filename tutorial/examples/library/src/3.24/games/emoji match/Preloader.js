export default class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');

        this.loadText;
    }

    preload ()
    {
        this.loadText = this.add.text(400, 360, 'Loading ...', { fontFamily: 'Arial', fontSize: 64, color: '#e3f2ed' });

        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);

        this.load.setPath('assets/games/emoji-match/');
        this.load.image([ 'background', 'logo' ]);
        this.load.atlas('emojis', 'emojis.png', 'emojis.json');

        //  Audio ...
        this.load.setPath('assets/games/emoji-match/sounds/');

        this.load.audio('music', [ 'music.ogg', 'music.m4a', 'music.mp3' ]);
        this.load.audio('countdown', [ 'countdown.ogg', 'countdown.m4a', 'countdown.mp3' ]);
        this.load.audio('match', [ 'match.ogg', 'match.m4a', 'match.mp3' ]);
    }

    create ()
    {
        if (this.sound.locked)
        {
            this.loadText.setText('Click to Start');

            this.input.once('pointerdown', () => {

                this.scene.start('MainMenu');

            });
        }
        else
        {
            this.scene.start('MainMenu');
        }
    }
}
