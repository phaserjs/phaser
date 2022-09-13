var config = {
    type: Phaser.WEBGL,
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
    this.load.image('turkey', 'assets/pics/turkey-1985086.jpg');
    this.load.image('logo', 'assets/sprites/phaser-large.png');
}

function create ()
{
    var gl = this.sys.game.renderer.gl;

    var consts = [
        gl.ZERO,
        gl.ONE,
        gl.SRC_COLOR,
        gl.ONE_MINUS_SRC_COLOR,
        gl.DST_COLOR,
        gl.ONE_MINUS_DST_COLOR,
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.DST_ALPHA,
        gl.ONE_MINUS_DST_ALPHA,
        gl.CONSTANT_COLOR,
        gl.ONE_MINUS_CONSTANT_COLOR,
        gl.CONSTANT_ALPHA,
        gl.ONE_MINUS_CONSTANT_ALPHA,
        gl.SRC_ALPHA_SATURATE
    ];

    var equations = [
        gl.FUNC_ADD,
        gl.FUNC_SUBTRACT,
        gl.FUNC_REVERSE_SUBTRACT
    ];

    var list = [
        'ZERO',
        'ONE',
        'SRC_COLOR',
        'ONE_MINUS_SRC_COLOR',
        'DST_COLOR',
        'ONE_MINUS_DST_COLOR',
        'SRC_ALPHA',
        'ONE_MINUS_SRC_ALPHA',
        'DST_ALPHA',
        'ONE_MINUS_DST_ALPHA',
        'CONSTANT_COLOR',
        'ONE_MINUS_CONSTANT_COLOR',
        'CONSTANT_ALPHA',
        'ONE_MINUS_CONSTANT_ALPHA',
        'SRC_ALPHA_SATURATE'
    ];

    var list2 = [
        'FUNC_ADD',
        'FUNC_SUBTRACT',
        'FUNC_REVERSE_SUBTRACT'
    ];

    var srcRGBIndex = 1;
    var dstRGBIndex = 7;
    var srcAlphaIndex = 1;
    var dstAlphaIndex = 1;
    var equationIndex = 0;

    var srcRGB = consts[srcRGBIndex];
    var dstRGB = consts[dstRGBIndex];
    var srcAlpha = consts[srcAlphaIndex];
    var dstAlpha = consts[dstAlphaIndex];

    var newMode = [ srcRGB, dstRGB, srcAlpha, dstAlpha ];

    var equation = equations[equationIndex];

    var renderer = this.sys.game.renderer;

    var modeIndex = renderer.addBlendMode(newMode, equation);

    this.add.image(400, 300, 'turkey');

    this.add.rectangle(200, 300, 1, 600, 0xefefef);
    this.add.rectangle(400, 300, 1, 600, 0xefefef);
    this.add.rectangle(600, 300, 1, 600, 0xefefef);
    this.add.rectangle(400, 300, 800, 1, 0xefefef);

    // this.add.image(400, 300, 'logo');
    this.add.image(400, 300, 'logo').setBlendMode(modeIndex);

    var text = this.add.text(0, 0, 'Blend Mode', { color: '#ffffff' });

    text.setText([
        srcRGBIndex + ' = ' + list[srcRGBIndex],
        dstRGBIndex + ' = ' + list[dstRGBIndex],
        srcAlphaIndex + ' = ' + list[srcAlphaIndex],
        dstAlphaIndex + ' = ' + list[dstAlphaIndex],
        '',
        equationIndex + ' = ' + list2[equationIndex] + ' - ASR'
    ]);

    this.input.keyboard.on('keydown_A', function (event) {

        equationIndex = 0;
        equation = equations[equationIndex];

        renderer.updateBlendMode(modeIndex, newMode, equation);

        text.setText([
            srcRGBIndex + ' = ' + list[srcRGBIndex],
            dstRGBIndex + ' = ' + list[dstRGBIndex],
            srcAlphaIndex + ' = ' + list[srcAlphaIndex],
            dstAlphaIndex + ' = ' + list[dstAlphaIndex],
            '',
            equationIndex + ' = ' + list2[equationIndex] + ' - ASR'
        ]);

    });

    this.input.keyboard.on('keydown_S', function (event) {

        equationIndex = 1;
        equation = equations[equationIndex];

        renderer.updateBlendMode(modeIndex, newMode, equation);

        text.setText([
            srcRGBIndex + ' = ' + list[srcRGBIndex],
            dstRGBIndex + ' = ' + list[dstRGBIndex],
            srcAlphaIndex + ' = ' + list[srcAlphaIndex],
            dstAlphaIndex + ' = ' + list[dstAlphaIndex],
            '',
            equationIndex + ' = ' + list2[equationIndex] + ' - ASR'
        ]);

    });

    this.input.keyboard.on('keydown_R', function (event) {

        equationIndex = 2;
        equation = equations[equationIndex];

        renderer.updateBlendMode(modeIndex, newMode, equation);

        text.setText([
            srcRGBIndex + ' = ' + list[srcRGBIndex],
            dstRGBIndex + ' = ' + list[dstRGBIndex],
            srcAlphaIndex + ' = ' + list[srcAlphaIndex],
            dstAlphaIndex + ' = ' + list[dstAlphaIndex],
            '',
            equationIndex + ' = ' + list2[equationIndex] + ' - ASR'
        ]);

    });

    this.input.on('pointerup', function (pointer)
    {
        var x = Phaser.Math.Snap.Floor(pointer.x, 200, 0, true);
        var y = pointer.y;

        if (y > 300)
        {
            if (x === 0)
            {
                srcRGBIndex = Phaser.Math.Wrap(srcRGBIndex + 1, 0, 15);
            }
            else if (x === 1)
            {
                dstRGBIndex = Phaser.Math.Wrap(dstRGBIndex + 1, 0, 15);
            }
            else if (x === 2)
            {
                srcAlphaIndex = Phaser.Math.Wrap(srcAlphaIndex + 1, 0, 15);
            }
            else if (x === 3)
            {
                dstAlphaIndex = Phaser.Math.Wrap(dstAlphaIndex + 1, 0, 15);
            }
        }
        else
        {
            if (x === 0)
            {
                srcRGBIndex = Phaser.Math.Wrap(srcRGBIndex - 1, 0, 15);
            }
            else if (x === 1)
            {
                dstRGBIndex = Phaser.Math.Wrap(dstRGBIndex - 1, 0, 15);
            }
            else if (x === 2)
            {
                srcAlphaIndex = Phaser.Math.Wrap(srcAlphaIndex - 1, 0, 15);
            }
            else if (x === 3)
            {
                dstAlphaIndex = Phaser.Math.Wrap(dstAlphaIndex - 1, 0, 15);
            }
        }

        srcRGB = consts[srcRGBIndex];
        dstRGB = consts[dstRGBIndex];
        srcAlpha = consts[srcAlphaIndex];
        dstAlpha = consts[dstAlphaIndex];

        newMode = [ srcRGB, dstRGB, srcAlpha, dstAlpha ];

        renderer.updateBlendMode(modeIndex, newMode, equation);

        text.setText([
            srcRGBIndex + ' = ' + list[srcRGBIndex],
            dstRGBIndex + ' = ' + list[dstRGBIndex],
            srcAlphaIndex + ' = ' + list[srcAlphaIndex],
            dstAlphaIndex + ' = ' + list[dstAlphaIndex],
            '',
            equationIndex + ' = ' + list2[equationIndex] + ' - ASR'
        ]);
    });
}
