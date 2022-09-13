var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#2d2d88',
    scene: {
        preload: preload,
        create: create,
        update: update,
        pack: {
            files: [
                { type: 'script', key: 'THREE', url: 'assets/tests/three.min.js' }
            ]
        }
    }
};

var camera;
var scene;
var renderer;
var gun;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');

    this.load.script('threeOBJ', 'http://3d.test/examples/js/loaders/OBJLoader.js');
    this.load.script('threeRGB', 'http://3d.test/examples/js/loaders/RGBELoader.js');
    this.load.script('threeHDR', 'http://3d.test/examples/js/loaders/HDRCubeTextureLoader.js');
    this.load.script('threePMR', 'http://3d.test/examples/js/pmrem/PMREMGenerator.js');
    this.load.script('threeREM', 'http://3d.test/examples/js/pmrem/PMREMCubeUVPacker.js');
}

function create ()
{
    this.add.image(400, 100, 'logo');

    var e = this.add.extern();

    this.add.image(400, 300, 'logo');

    renderer = new THREE.WebGLRenderer( { canvas: this.game.canvas, context: this.game.context, antialias: true } );

    renderer.autoClear = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, 800 / 600, 0.01, 1000);
    camera.position.z = 2;

    // controls = new THREE.TrackballControls( camera, renderer.domElement );

    scene.add( new THREE.HemisphereLight( 0x443333, 0x222233, 4 ) );

    var material = new THREE.MeshStandardMaterial();

    new THREE.OBJLoader()
        .setPath( 'http://3d.test/examples/models/obj/cerberus/' )
        .load( 'Cerberus.obj', function ( group ) {

            var loader = new THREE.TextureLoader()
                .setPath( 'http://3d.test/examples/models/obj/cerberus/' );

            material.roughness = 1; // attenuates roughnessMap
            material.metalness = 1; // attenuates metalnessMap

            material.map = loader.load( 'Cerberus_A.jpg' );
            // roughness is in G channel, metalness is in B channel
            material.metalnessMap = material.roughnessMap = loader.load( 'Cerberus_RM.jpg' );
            material.normalMap = loader.load( 'Cerberus_N.jpg' );

            material.map.wrapS = THREE.RepeatWrapping;
            material.roughnessMap.wrapS = THREE.RepeatWrapping;
            material.metalnessMap.wrapS = THREE.RepeatWrapping;
            material.normalMap.wrapS = THREE.RepeatWrapping;

            group.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {

                    child.material = material;

                }

            } );

            group.position.x = - 0.45;
            group.rotation.y = - Math.PI / 2;

            scene.add( group );

            gun = group;

        } );

        var genCubeUrls = function ( prefix, postfix ) {

            return [
                prefix + 'px' + postfix, prefix + 'nx' + postfix,
                prefix + 'py' + postfix, prefix + 'ny' + postfix,
                prefix + 'pz' + postfix, prefix + 'nz' + postfix
            ];

        };

        var hdrUrls = genCubeUrls( 'http://3d.test/examples/textures/cube/pisaHDR/', '.hdr' );
        new THREE.HDRCubeTextureLoader().load( THREE.UnsignedByteType, hdrUrls, function ( hdrCubeMap ) {

            var pmremGenerator = new THREE.PMREMGenerator( hdrCubeMap );
            pmremGenerator.update( renderer );

            var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
            pmremCubeUVPacker.update( renderer );

            var hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

            material.envMap = hdrCubeRenderTarget.texture;
            material.needsUpdate = true; // is this needed?

            hdrCubeMap.dispose();
            pmremGenerator.dispose();
            pmremCubeUVPacker.dispose();

        } );


    e.render = function (prenderer, pcamera, pcalcMatrix)
    {
        renderer.state.reset();

        renderer.render(scene, camera);
    }
}

function update ()
{
    if (gun)
    {
        gun.rotation.x += 0.01;
        gun.rotation.y += 0.01;
        gun.rotation.z += 0.01;
    }
}
