/**
 * @author    Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */

var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    preload: function ()
    {
        this.load.audio('jungle', [
            'assets/audio/jungle.ogg',
            'assets/audio/jungle.mp3'
        ]);

        this.load.image('wizball', 'assets/sprites/wizball.png');

        this.load.bitmapFont('atari-classic', 'assets/fonts/bitmap/atari-classic.png', 'assets/fonts/bitmap/atari-classic.xml');
    },

    create: function ()
    {
        console.log('SceneA');

        var text = this.add.bitmapText(400, 100, 'atari-classic', '', 30)
            .setOrigin(0.5);

        this.add.image(400, 300, 'wizball');

        var jungle = this.sound.add('jungle');

        jungle.play({
            loop: true
        });

        if(this.sound.locked)
        {
            text.setText('Tap to unlock\nand play music');

            this.sound.once('unlocked', function (soundManager)
            {
                setupSceneInput.call(this, text, jungle);

            }, this);
        }
        else
        {
            setupSceneInput.call(this, text, jungle);
        }
    }
});

setupSceneInput = function (text, jungle)
{
    text.setText(' Tap to load and play\nmusic from child scene');

    this.input.once('pointerup', function () {

        jungle.stop();

        this.scene.start('sceneB');

    }, this);
};

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    preload: function ()
    {
        this.load.audio('theme', [
            'assets/audio/oedipus_wizball_highscore.ogg',
            'assets/audio/oedipus_wizball_highscore.mp3'
        ]);
    },

    create: function ()
    {
        console.log('SceneB');

        this.scene.start('sceneC');
    }

});

var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'sceneC' });
    },

    create: function ()
    {
        console.log('SceneC');

        this.add.image(400, 300, 'wizball').setScale(4);

        var music = this.sound.add('theme');

        music.play({
            loop: true
        });

        if(this.sound.locked)
        {
            var text = this.add.bitmapText(400, 100, 'atari-classic',
                'Tap to unlock and play\nmusic from child scene', 30)
                .setOrigin(0.5);

            this.sound.once('unlocked', function (soundManager)
            {
                text.visible = false;

            }, this);
        }

    }
});

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [ SceneA, SceneB, SceneC ]
};

var game = new Phaser.Game(config);
