/**
 * @author    Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    },
    pixelArt: true,
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('title', 'assets/pics/catastrophi.png');

    this.load.spritesheet('button', 'assets/ui/flixel-button.png', { frameWidth: 80, frameHeight: 20 });

    this.load.bitmapFont('nokia', 'assets/fonts/bitmap/nokia16black.png', 'assets/fonts/bitmap/nokia16black.xml');

    this.load.audioSprite('sfx', 'assets/audio/SoundEffects/fx_mixdown.json', [
        'assets/audio/SoundEffects/fx_mixdown.ogg',
        'assets/audio/SoundEffects/fx_mixdown.mp3'
    ]);
}

function create ()
{
    this.add.image(400, 300, 'title');

    var spritemap = this.cache.json.get('sfx').spritemap;

    var i = 0;
    for (var spriteName in spritemap)
    {
        if (!spritemap.hasOwnProperty(spriteName))
        {
            continue;
        }

        makeButton.call(this, spriteName, 680, 115 + i*40);

        i++;
    }

    this.input.on('gameobjectover', function (pointer, button)
    {
        setButtonFrame(button, 0);
    });
    this.input.on('gameobjectout', function (pointer, button)
    {
        setButtonFrame(button, 1);
    });
    this.input.on('gameobjectdown', function (pointer, button)
    {
        this.sound.playAudioSprite('sfx', button.name);

        setButtonFrame(button, 2);

    }, this);
    this.input.on('gameobjectup', function (pointer, button)
    {
        setButtonFrame(button, 0);
    });
}

function makeButton(name, x, y)
{
    var button = this.add.image(x, y, 'button', 1).setInteractive();
    button.name = name;
    button.setScale(2, 1.5);

    var text = this.add.bitmapText(x - 40, y - 8, 'nokia', name, 16);
    text.x += (button.width - text.width) / 2;
}

function setButtonFrame(button, frame)
{
    button.frame = button.scene.textures.getFrame('button', frame);
}
