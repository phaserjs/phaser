var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#2d2d88',
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
    // this.load.script('threejs', 'assets/tests/three.min.js');
    // this.load.script('threejs', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r117/three.min.js');
    this.load.script('threejs', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js');
}

function create ()
{
    this.add.image(400, 50, 'logo');

    var exten = this.add.extern();

    // this.add.image(400, 300, 'logo');

    var camera = new THREE.PerspectiveCamera( 70, config.width / config.height, 1, 1000 );

    camera.position.z = 400;

    var scene = new THREE.Scene();

    var texture = new THREE.TextureLoader().load('assets/textures/tiles.jpg');

    var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({ map: texture });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    var renderer = new THREE.WebGL1Renderer({ canvas: this.game.canvas, context: this.game.context, antialias: true });

    exten.render = function (prenderer, pcamera, pcalcMatrix)
    {
        renderer.state.reset();

        renderer.render(scene, camera);
    }

    renderer.autoClear = false;
}

function update ()
{
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
}
