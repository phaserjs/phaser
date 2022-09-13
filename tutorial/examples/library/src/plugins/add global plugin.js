var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        extend: {
            getCharacter: getCharacter
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.text('3x5', 'assets/loader-tests/3x5.flf');
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    // https://github.com/Marak/asciimo/issues/3
    var font = this.cache.text.get('3x5').split('\n');

    //         flf2a$ 6 5 20 15 3 0 143 229    NOTE: The first five characters in
    //           |  | | | |  |  | |  |   |     the entire file must be "flf2a".
    //          /  /  | | |  |  | |  |   \
    // Signature  /  /  | |  |  | |   \   Codetag_Count
    //   Hardblank  /  /  |  |  |  \   Full_Layout*
    //        Height  /   |  |   \  Print_Direction
    //        Baseline   /    \   Comment_Lines
    //         Max_Length      Old_Layout*


    //  flf2a$ 6 4 6 -1 4
    var data = font[0].split(' ');
    var header = data[0];
    var height = parseInt(data[1]);
    var width = parseInt(data[2]);
    var comments = parseInt(data[5]) + 2;

    // The letters start at space (ASCII 32) and go in ASCII order up to 126

    var text = "PHASER 3";

    var x = 32;

    for (var i = 0; i < text.length; i++)
    {
        var letter = text.charCodeAt(i);

        var offset = comments + ((letter - 32) * height);

        this.getCharacter(font, x, 32, offset, width, height);

        x += (width * 17);
    }
}

function getCharacter (font, dx, dy, offset, width, height)
{
    var sx = dx;
    var sy = dy;

    for (var y = offset; y < offset + height; y++)
    {
        sx = dx;

        for (var x = 0; x < width; x++)
        {
            sx += 17;

            if (font[y][x] === '#')
            {
                this.add.image(sx, sy, 'balls');
            }
        }

        sy += 17;
    }
}
