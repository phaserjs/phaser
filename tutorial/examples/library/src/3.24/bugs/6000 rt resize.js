const parent = 'phaser-example';
const config = {
  canvasStyle: 'width: 100%; height: 100%',
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent,
    resizeInterval: 50,
  },
  backgroundColor: '#adadad',
  disableContextMenu: true,
  parent,
  _width: 1024, _height: 1024,
  type: Phaser.WEBGL,
  scene: {
    preload,
    create,
    update,
  },
};
const game = new Phaser.Game(config);

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = CANVAS_WIDTH;

function preload ()
{
    this.load.image('box', 'assets/sprites/crate.png');
    this.load.image('grid', 'assets/pics/uv-grid.jpg');
}

function create() {

    // Zoom into the top-left corner which has our canvas.
  this.cameras.main.setOrigin(0, 0);

//   this.add.image(0, 0, 'grid').setOrigin(0, 0);

  const rt = this.add.renderTexture(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    rt.fill(0xff0000, 1);
    rt.draw('grid', 0, 0);

  const edgeBrush = this.add.circle(-1_000, -1_000, 20, 0xff0000).setOrigin(0.5, 0.5);

  rt.draw(edgeBrush, 0, 0);
  rt.draw(edgeBrush, CANVAS_WIDTH, 0);
  rt.draw(edgeBrush, 0, CANVAS_HEIGHT);
  rt.draw(edgeBrush, CANVAS_WIDTH, CANVAS_HEIGHT);

  var b = this.add.image(0, 0, 'box').setVisible(false);

  // Events
  this.input.on('pointerdown', (pointer) => {
    // const {x, y} = normalizePoint(pointer, this.scale.canvasBounds);

    if (pointer.which === 3 || pointer.button === 2)
    {
        rt.clear();
    }
    else
    {
        rt.draw(b, pointer.worldX, pointer.worldY);
    }

}, this);

//   this.input.on('pointermove', (pointer) => {
//     if (pointer.isDown) {
//       const {x, y} = normalizePoint(pointer, this.scale.canvasBounds);
//       rt.draw('box', x, y);
//     //   rt.draw(brush, x, y);
//     }
//   }, this);
}

function update(time, delta) {
  const {width, height} = this.scale.canvasBounds;
  // Zoom the camera so that rt spans the full width and height.
  // This would zoom the width and height separately, but that feature
  // was only added in 3.50, so in order to make this example work in 3.24.1,
  // we keep the canvas width and height identical.
  this.cameras.main.setZoom(
    width / CANVAS_WIDTH
  );
}

/** Given a pointer event, returns an x/y coord normalized to CANVAS_WIDTH x CANVAS_HEIGHT. */
function normalizePoint(pointer, canvasBounds) {
  const {width, height} = canvasBounds;
  return {x: pointer.x / width * CANVAS_WIDTH, y: pointer.y / height * CANVAS_HEIGHT};
}
