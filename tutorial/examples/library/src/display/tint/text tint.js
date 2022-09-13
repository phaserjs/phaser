class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        const text1 = this.add.text(100, 100, 'Phaser Text with Tint');
        text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        const text2 = this.add.text(100, 200, 'Phaser Text with Tint', { font: '64px Arial' });
        text2.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        const text3 = this.add.text(100, 400, 'Phaser Text with Tint Fill', { font: '64px Arial' });
        text3.setTintFill(0xff00ff, 0xff00ff, 0x0000ff, 0x0000ff);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene:  [ Example ]
};

const game = new Phaser.Game(config);
