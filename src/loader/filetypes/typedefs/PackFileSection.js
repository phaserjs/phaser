/**
 * @typedef {object} Phaser.Types.Loader.FileTypes.PackFileSection
 *
 * @property {Phaser.Types.Loader.FileConfig[]} files - The files to load. See {@link Phaser.Types.Loader.FileTypes}.
 * @property {string} [baseURL] - A URL used to resolve paths in `files`. Example: 'http://labs.phaser.io/assets/'.
 * @property {string} [defaultType] - The default {@link Phaser.Types.Loader.FileConfig} `type`.
 * @property {string} [path] - A URL path used to resolve relative paths in `files`. Example: 'images/sprites/'.
 * @property {string} [prefix] - An optional prefix that is automatically prepended to each file key.
 *
 * @example
 * var packFileSection = {
 *      "prefix": "TEST2.",
 *      "path": "assets/pics",
 *      "defaultType": "image",
 *      "files": [
 *          {
 *              "key": "donuts",
 *              "extension": "jpg"
 *          },
 *          {
 *              "key": "ayu"
 *          }
 *      ]
 *  }
 * // Result:
 * // --------------------------------------------
 * // assets/pics/ayu.png    -> image TEST2.ayu
 * // assets/pics/donuts.jpg -> image TEST2.donuts
 */
