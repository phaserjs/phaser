var myCustomCanvas = document.createElement('canvas');

myCustomCanvas.id = 'myCustomCanvas';
myCustomCanvas.style = 'border: 8px solid green';

document.body.appendChild(myCustomCanvas);

//  It's important to set the WebGL context values that Phaser needs:
var contextCreationConfig = {
    alpha: false,
    depth: false,
    antialias: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
};

var myCustomContext = myCustomCanvas.getContext('webgl2', contextCreationConfig);

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    canvas: myCustomCanvas,
    context: myCustomContext,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var mesh;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');
    this.load.script('threejs', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js');
}

function create ()
{
    this.add.image(400, 300, 'logo');

    var exten = this.add.extern();

    var camera = new THREE.PerspectiveCamera( 70, 800 / 600, 1, 1000 );

    camera.position.z = 400;

    var scene = new THREE.Scene();

    var texture = new THREE.TextureLoader().load('assets/textures/tiles.jpg');

    var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({ map: texture });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    var renderer = new THREE.WebGLRenderer({ canvas: this.game.canvas, context: this.game.context, antialias: true });

    console.log(renderer.state);

    exten.render = function (prenderer, pcamera, pcalcMatrix)
    {
        renderer.state.reset();

        renderer.render(scene, camera);
    }

    renderer.autoClear = false;

    this.add.image(400, 100, 'logo');

}

function update ()
{
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
}
