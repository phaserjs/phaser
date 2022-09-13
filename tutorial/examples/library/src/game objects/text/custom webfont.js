var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#efefef',
    scene: {
        init: init,
        preload: preload,
        create: create,
    }
};

var game = new Phaser.Game(config);

function init ()
{
    //  Inject our CSS
    var element = document.createElement('style');

    document.head.appendChild(element);

    var sheet = element.sheet;

    var styles = '@font-face { font-family: "troika"; src: url("assets/fonts/ttf/troika.otf") format("opentype"); }\n';

    sheet.insertRule(styles, 0);

    styles = '@font-face { font-family: "Caroni"; src: url("assets/fonts/ttf/caroni.otf") format("opentype"); }';

    sheet.insertRule(styles, 0);
}

function preload ()
{
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
}

function create ()
{
    var add = this.add;
    var input = this.input;

    WebFont.load({
        custom: {
            families: [ 'troika', 'Caroni' ]
        },
        active: function ()
        {
            add.text(32, 32, 'The face of the\nmoon was in\nshadow.', { fontFamily: 'troika', fontSize: 80, color: '#ff0000' }).setShadow(2, 2, "#333333", 2, false, true);

            add.text(150, 350, 'Waves flung themselves\nat the blue evening.', { fontFamily: 'Caroni', fontSize: 64, color: '#5656ee' });
        }
    });
}
