let currentMaze = null;
let vx = 1, vy = 1;

function preload() {

    // this.load.image( 'maze1', 'assets/tilemaps/tiles/ground_1x1.png' );

    this.load.image( 'maze1', 'assets/tilemaps/tiles/gridtiles.png' );
    
    this.load.image( 'logo', 'assets/sprites/128x128.png' );

}


function create() {

    let maze = [
        [ 1, 5, 3, 1, 2, 3, 4, 5, 6, 8, 9, 7, 6, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
        [ 2, 3, 5, 6, 2, 3, 7, 5, 3, 5, 8, 9, 0, 3, 1, 2, 6, 8, 5, 3, 5, 6 ],
        [ 4, 5, 7, 3, 5, 8, 6, 4, 8, 0, 7, 4, 6, 3, 4, 5, 7, 2, 4, 6, 8, 9 ],
        [ 3, 2, 5, 6, 7, 8, 4, 3, 2, 5, 6, 4, 2, 2, 3, 5, 7, 9, 3, 1, 2, 4 ],
        [ 1, 5, 3, 1, 2, 3, 4, 5, 6, 8, 9, 7, 6, 5, 7, 3, 5, 7, 2, 4, 7, 9 ],
        [ 2, 3, 5, 6, 2, 3, 7, 5, 3, 5, 8, 9, 0, 2, 4, 6, 8, 9, 4, 2, 6, 8 ],
        [ 4, 5, 7, 3, 5, 8, 6, 4, 8, 0, 7, 4, 6, 3, 5, 6, 9, 0, 5, 2, 5, 7 ],
        [ 3, 2, 5, 6, 7, 8, 4, 3, 2, 5, 6, 4, 2, 3, 5, 7, 8, 9, 0, 3, 5, 7 ],
        [ 1, 5, 3, 1, 2, 3, 4, 5, 6, 8, 9, 7, 6, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
        [ 2, 3, 5, 6, 2, 3, 7, 5, 3, 5, 8, 9, 0, 3, 1, 2, 6, 8, 5, 3, 5, 6 ],
        [ 4, 5, 7, 3, 5, 8, 6, 4, 8, 0, 7, 4, 6, 3, 4, 5, 7, 2, 4, 6, 8, 9 ],
        [ 3, 2, 5, 6, 7, 8, 4, 3, 2, 5, 6, 4, 2, 2, 3, 5, 7, 9, 3, 1, 2, 4 ],
        [ 1, 5, 3, 1, 2, 3, 4, 5, 6, 8, 9, 7, 6, 5, 7, 3, 5, 7, 2, 4, 7, 9 ],
        [ 2, 3, 5, 6, 2, 3, 7, 5, 3, 5, 8, 9, 0, 2, 4, 6, 8, 9, 4, 2, 6, 8 ],
        [ 4, 5, 7, 3, 5, 8, 6, 4, 8, 0, 7, 4, 6, 3, 5, 6, 9, 0, 5, 2, 5, 7 ],
        [ 3, 2, 5, 6, 7, 8, 4, 3, 2, 5, 6, 4, 2, 3, 5, 7, 8, 9, 0, 3, 5, 7 ],
        [ 3, 2, 5, 6, 7, 8, 4, 3, 2, 5, 6, 4, 2, 2, 3, 5, 7, 9, 3, 1, 2, 4 ],
        [ 1, 5, 3, 1, 2, 3, 4, 5, 6, 8, 9, 7, 6, 5, 7, 3, 5, 7, 2, 4, 7, 9 ],
        [ 2, 3, 5, 6, 2, 3, 7, 5, 3, 5, 8, 9, 0, 2, 4, 6, 8, 9, 4, 2, 6, 8 ],
        [ 4, 5, 7, 3, 5, 8, 6, 4, 8, 0, 7, 4, 6, 3, 5, 6, 9, 0, 5, 2, 5, 7 ],
        [ 3, 2, 5, 6, 7, 8, 4, 3, 2, 5, 6, 4, 2, 3, 5, 7, 8, 9, 0, 3, 5, 7 ],
        [ 1, 5, 3, 1, 2, 3, 4, 5, 6, 8, 9, 7, 6, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
        [ 2, 3, 5, 6, 2, 3, 7, 5, 3, 5, 8, 9, 0, 3, 1, 2, 6, 8, 5, 3, 5, 6 ],
        [ 4, 5, 7, 3, 5, 8, 6, 4, 8, 0, 7, 4, 6, 3, 4, 5, 7, 2, 4, 6, 8, 9 ]
    ];

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    let tilemap = this.make.tilemap(
        {
            key: 'maze',
            data: maze,
            tileWidth: 16,
            tileHeight: 16
        }
    );

    let tiles = tilemap.addTilesetImage( 'maze1' );

    currentMaze = tilemap.createStaticLayer( 0, tiles, 0, 0 );
    // currentMaze = tilemap.createDynamicLayer( 0, tiles, 0, 0 );
    
    let logo = this.add.sprite( 16, 16, 'logo' );
    logo.setOrigin( 0 );


}

const get_game_size = () => {

    let game_width_ratio = window.innerWidth;
    let game_height_ratio = window.innerHeight;

    let game_width = 256;
    let game_height = ( game_width / game_width_ratio ) * game_height_ratio;

    return {
        width: game_width,
        height: game_height
    };

};


const resize_game = () => {

    let game_size = get_game_size();
    // game.scale.resize( game_size.width, game_size.height );
    game.scale.setGameSize( game_size.width, game_size.height );

};

window.addEventListener( 'resize', resize_game );



let game_size = get_game_size();

const sceneProperties = {
    preload,
    create
};

const config = {
    parent: 'phaser-example',
    title: 'MazeMazeMaze',
    url: 'https://mazemazemaze.com',
    type: Phaser.AUTO,
    backgroundColor: 0xff0000,
    scale: {
        mode: Phaser.Scale.NO_SCALE,
        width: game_size.width,
        height: game_size.height
    },
    scene: sceneProperties,
    pixelArt: true,
    roundPixels: true
};

const game = new Phaser.Game( config );
