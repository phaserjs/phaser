var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: 0x10bb99,
    scene: {
        init: init,
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function init ()
{
    //  Inject our CSS
    var element = document.createElement('style');

    document.head.appendChild(element);

    var sheet = element.sheet;

    var styles = '@font-face { font-family:"troika"; src: url("assets/fonts/ttf/troika.otf") format("opentype"); }';

    sheet.insertRule(styles, 0);
}

function preload ()
{
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.script('pixi', 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.7.1/pixi.min.js');
}

function create ()
{
    var _this = this;

    WebFont.load({
        custom: {
            families: [ 'troika' ]
        },
        active: function ()
        {
            var text = _this.add.text(30, 180, '1234567890', { fontFamily: 'troika', fontSize: 70, color: '#ffffff' });

            text.setInteractive();

            text.once('pointerup', function () {
                text.setText('1234567890!');
                text.setFontSize(120);
            });

            var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
            
            document.getElementById('phaser-example').appendChild(app.view);

            var style = new PIXI.TextStyle({
                fontFamily: 'troika',
                fontSize: 70,
                fill: ['#ffffff']
            });

            var richText = new PIXI.Text('1234567890', style);

            richText.x = 30;
            richText.y = 180;

            richText.interactive = true;
            richText.buttonMode = true;

            richText.on('pointerdown', function () {

                richText.text = '1234567890!';
                richText.style.fontSize = 120;
                richText.dirty = true;

            });

            app.stage.addChild(richText);
        }
    });
}
