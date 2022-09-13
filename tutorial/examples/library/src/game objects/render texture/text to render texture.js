var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    }
};

var rt;
var text;

var game = new Phaser.Game(config);

function create ()
{
    text = this.add.text(0, 0, 'Hello from a\nRender Texture').setFontSize(48);

    text.setVisible(false);

    rt = this.add.renderTexture(0, 0, 800, 600);
}

function update ()
{
    rt.camera.rotation -= 0.01;

    rt.clear();

    rt.draw(text, 400, 300);
}
