/**
 * @typedef {object} Phaser.Types.Tilemaps.TilemapConfig
 * @since 3.0.0
 * 
 * @property {string} [key] - The key in the Phaser cache that corresponds to the loaded tilemap data.
 * @property {number[][]} [data] - Instead of loading from the cache, you can also load directly from a 2D array of tile indexes.
 * @property {number} [tileWidth=32] - The width of a tile in pixels.
 * @property {number} [tileHeight=32] - The height of a tile in pixels.
 * @property {number} [width=10] - The width of the map in tiles.
 * @property {number} [height=10] - The height of the map in tiles.
 * @property {boolean} [insertNull=false] - Controls how empty tiles, tiles with an index of -1,
 * in the map data are handled. If `true`, empty locations will get a value of `null`. If `false`,
 * empty location will get a Tile object with an index of -1. If you've a large sparsely populated
 * map and the tile data doesn't need to change then setting this value to `true` will help with
 * memory consumption. However if your map is small or you need to update the tiles dynamically,
 * then leave the default value set.
 */
