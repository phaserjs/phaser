/**
 * @typedef {object} Phaser.Types.Tilemaps.MapDataConfig
 * @since 3.0.0
 * 
 * @property {string} [name] - The key in the Phaser cache that corresponds to the loaded tilemap data.
 * @property {number} [width=0] - The width of the entire tilemap.
 * @property {number} [height=0] - The height of the entire tilemap.
 * @property {number} [tileWidth=0] - The width of the tiles.
 * @property {number} [tileHeight=0] - The height of the tiles.
 * @property {number} [widthInPixels] - The width in pixels of the entire tilemap.
 * @property {number} [heightInPixels] - The height in pixels of the entire tilemap.
 * @property {integer} [format] - The format of the Tilemap, as defined in Tiled.
 * @property {string} [orientation] - The orientation of the map data (i.e. orthogonal, isometric, hexagonal), default 'orthogonal'.
 * @property {string} [renderOrder] - Determines the draw order of tilemap. Default is right-down.
 * @property {number} [version] - The version of Tiled the map uses.
 * @property {number} [properties] - Map specific properties (can be specified in Tiled).
 * @property {Phaser.Tilemaps.LayerData[]} [layers] - The layers of the tilemap.
 * @property {array} [images] - An array with all the layers configured to the MapData.
 * @property {object} [objects] - An array of Tiled Image Layers.
 * @property {object} [collision] - An object of Tiled Object Layers.
 * @property {Phaser.Tilemaps.Tileset[]} [tilesets] - The tilesets the map uses.
 * @property {array} [imageCollections] - The collection of images the map uses(specified in Tiled).
 * @property {array} [tiles] - Array of Tile instances.
 */
