class ContainerTest extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
		super(scene, 166, 275);
        console.log("container:constructor");
	}

	addedToScene() {
		super.addedToScene()
		console.log("container:addedToScene");
	}
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{

}

function create ()
{
    console.log("create");

    container = this.add.container(400, 300);

    container2 = new ContainerTest(this, 100, 100);
    container.add(container2);

    this.input.keyboard.on("keyup-T", () => {
        console.log("Input detected")
        this.scene.remove();
    })
}
