class Test extends Phaser.Scene {
    preload() {
        this.load.image('separation', 'assets/bugs/separation.png');
    }

    create() {
        const block = this.add.image(0, 0, 'separation').setOrigin(0);

        this.game.renderer.snapshot((image) => {
            const outputDom = document.createElement('div');
            document.body.appendChild(outputDom);
            outputDom.style.width = `${block.width}px`;
            outputDom.style.height = `${block.height}px`;
            outputDom.innerHTML = `<img src="${image.src}">`
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 49,
    height: 26,
    parent: 'phaser-example',
    scene: [Test]
}

const game = new Phaser.Game(config);
