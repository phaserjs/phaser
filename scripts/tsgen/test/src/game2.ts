
let scene:Phaser.Scene = new Phaser.Scene("");

let blitter = new Phaser.GameObjects.Blitter(scene, 10, 10);

let conf:GameConfig = {
    type:Phaser.AUTO,
    width: 100,
    height: 100,
    zoom: 1,
    resolution: 1
}

let tex:Phaser.Textures.Texture = <any>null;

tex.source[0].setFilter(Phaser.Textures.FilterMode.LINEAR);

tex.setFilter(Phaser.Textures.FilterMode.LINEAR);
tex.setFilter(Phaser.Textures.NEAREST);

let sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "test");

class MyVec extends Phaser.Geom.Rectangle {

    public extra() {

    }

}
let p = new MyVec();

sprite.getBounds(p).extra();

let container = scene.add.container(0, 0);
container.getWorldTransformMatrix();
