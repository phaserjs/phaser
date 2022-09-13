class Test extends Phaser.Scene {

    preload ()
    {
        this.load.image('image0', 'assets/pics/ra-einstein.png');
        this.load.image('image1', 'assets/sprites/mushroom2.png');
    }

    create ()
    {
        this.add.tileSprite(400, 300, 800, 600, 'image1');

        const text = this.add.text(10, 10, "Hello!", {
			fontSize: "48px"
		});

		const renderTextrure = this.add.renderTexture(10, 100, 300, 300);

        renderTextrure.draw(text);

        this.input.once('pointerdown', () => {

            this.sys.renderer.snapshot(img => {
                img.style.position = "fixed";
                img.style.left = window.innerWidth / 2 - 350 + "px";
                img.style.top = window.innerHeight / 2 - 150 + "px";
                img.style.border = "solid 1px red";
                document.body.appendChild(img);
            });

            /*
            renderTextrure.snapshot(img => {
                img.style.position = "fixed";
                img.style.left = window.innerWidth / 2 - 350 + "px";
                img.style.top = window.innerHeight / 2 - 150 + "px";
                img.style.border = "solid 1px red";
                document.body.appendChild(img);
            });
            */

        });
	}
}

var game = new Phaser.Game({
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: "#242424",
    scene: Test
});
