var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        create: create,
        update: update
    }
};

var hsv;
var i = 0;
var text1;
var text2;

var game = new Phaser.Game(config);

function create ()
{
    hsv = Phaser.Display.Color.HSVColorWheel();

    //  Rainbow Text
    text1 = this.add.text(50, 100, 'Rainbow Text', { font: "74px Arial Black", fill: "#fff" });
    text1.setStroke('#00f', 16);
    text1.setShadow(2, 2, "#333333", 2, true, true);

    //  Rainbow Stroke
    text2 = this.add.text(50, 300, 'Rainbow Stroke', { font: "74px Arial Black", fill: "#000" });
    text2.setStroke('#fff', 16);
    text2.setShadow(2, 2, "#333333", 2, true, true);
}

function update ()
{
    var top = hsv[i].color;
    var bottom = hsv[359 - i].color;

    text1.setTint(top, top, bottom, bottom);
    text2.setTint(top, bottom, top, bottom);

    i++;

    if (i === 360)
    {
        i = 0;
    }
}
