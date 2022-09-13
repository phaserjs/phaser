class MainScene extends Phaser.Scene {
    constructor ()
    {
        super('MainScene');
    }

    create ()
    {
        this.scene.get('SceneOne').scene.restart();
    }
}

class SceneOne extends Phaser.Scene {
    constructor ()
    {
        super('SceneOne');
    }

    create ()
    {
        let frame = this.add.graphics();
        frame.lineStyle(3, 0xFFFFFF);
        frame.strokeRect(0, 0, 1024, 768);
        this.cameras.main.setZoom(0.5);
        this.cameras.main.setScroll(-100, -100);
    }

    update() {
        console.log(this.input.activePointer.worldX, this.input.activePointer.worldY);
    }
}

let config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: [MainScene, SceneOne]
};

let game = new Phaser.Game(config);
