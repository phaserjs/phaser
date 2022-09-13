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
    this.load.image('face', 'assets/pics/bw-face.png');
    this.load.image('src', 'assets/tests/blendmode/src.png');
    this.load.image('dst', 'assets/tests/blendmode/dst.png');
}

function create ()
{
    //  WebGL only:

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
        { val: 0, text: 'gl.ZERO' },
        { val: 1, text: 'gl.ONE' },
        { val: 2, text: 'gl.SRC_COLOR' },
        { val: 3, text: 'gl.ONE_MINUS_SRC_COLOR' },
        { val: 4, text: 'gl.DST_COLOR' },
        { val: 5, text: 'gl.ONE_MINUS_DST_COLOR' },
        { val: 6, text: 'gl.SRC_ALPHA' },
        { val: 7, text: 'gl.ONE_MINUS_SRC_ALPHA' },
        { val: 8, text: 'gl.DST_ALPHA' },
        { val: 9, text: 'gl.ONE_MINUS_DST_ALPHA' },
        { val: 10, text: 'gl.CONSTANT_COLOR' },
        { val: 11, text: 'gl.ONE_MINUS_CONSTANT_COLOR' },
        { val: 12, text: 'gl.CONSTANT_ALPHA' },
        { val: 13, text: 'gl.ONE_MINUS_CONSTANT_ALPHA' },
        { val: 14, text: 'gl.SRC_ALPHA_SATURATE' }
    ];

    var list2 = [
        { val: 0, text: 'gl.FUNC_ADD' },
        { val: 1, text: 'gl.FUNC_SUBTRACT' },
        { val: 2, text: 'gl.FUNC_REVERSE_SUBTRACT' }
    ];

    var sfactor = gl.ONE;
    var dfactor = gl.ZERO;
    var equation = gl.FUNC_ADD;

    var newMode = [ sfactor, dfactor ];

    var renderer = this.sys.game.renderer;

    var modeIndex = renderer.addBlendMode(newMode, equation);

    this.add.image(400, 300, 'face');
    this.add.image(400, 300, 'dst');
    this.add.image(400, 300, 'src').setBlendMode(modeIndex);

    //  Create some select lists

    var source = $('<select>').attr('id', 'source').appendTo('body');

    $(list).each(function() {
        source.append($("<option>").attr('value', this.val).text(this.text));
    });

    $(source).on('change', function () {

        sfactor = consts[this.value];
        newMode[0] = sfactor;
        renderer.updateBlendMode(modeIndex, newMode, equation);
        
    });

    var dest = $('<select>').attr('id', 'dest').appendTo('body');

    $(list).each(function() {
        dest.append($("<option>").attr('value', this.val).text(this.text));
    });

    $(dest).on('change', function () {

        dfactor = consts[this.value];
        newMode[1] = dfactor;

        renderer.updateBlendMode(modeIndex, newMode, equation);
        
    });

    var equ = $('<select>').attr('id', 'equ').appendTo('body');

    $(list2).each(function() {
        equ.append($("<option>").attr('value', this.val).text(this.text));
    });

    $(equ).on('change', function () {

        equation = equations[this.value];

        renderer.updateBlendMode(modeIndex, newMode, equation);

    });

}
