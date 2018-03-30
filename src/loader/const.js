/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FILE_CONST = {

    /**
     * The Loader is idle.
     * 
     * @name Phaser.Loader.LOADER_IDLE
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_IDLE: 0,

    /**
     * The Loader is actively loading.
     * 
     * @name Phaser.Loader.LOADER_LOADING
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_LOADING: 1,

    /**
     * The Loader is processing files is has loaded.
     * 
     * @name Phaser.Loader.LOADER_PROCESSING
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_PROCESSING: 2,

    /**
     * The Loader has completed loading and processing.
     * 
     * @name Phaser.Loader.LOADER_COMPLETE
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_COMPLETE: 3,

    /**
     * The Loader is shutting down.
     * 
     * @name Phaser.Loader.LOADER_SHUTDOWN
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_SHUTDOWN: 4,

    /**
     * The Loader has been destroyed.
     * 
     * @name Phaser.Loader.LOADER_DESTROYED
     * @type {integer}
     * @since 3.0.0
     */
    LOADER_DESTROYED: 5,

    /**
     * File is in the load queue but not yet started
     * 
     * @name Phaser.Loader.FILE_PENDING
     * @type {integer}
     * @since 3.0.0
     */
    FILE_PENDING: 10,

    /**
     * File has been started to load by the loader (onLoad called)
     * 
     * @name Phaser.Loader.FILE_LOADING
     * @type {integer}
     * @since 3.0.0
     */
    FILE_LOADING: 11,

    /**
     * File has loaded successfully, awaiting processing    
     * 
     * @name Phaser.Loader.FILE_LOADED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_LOADED: 12,

    /**
     * File failed to load
     * 
     * @name Phaser.Loader.FILE_FAILED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_FAILED: 13,

    /**
     * File is being processed (onProcess callback)
     * 
     * @name Phaser.Loader.FILE_PROCESSING
     * @type {integer}
     * @since 3.0.0
     */
    FILE_PROCESSING: 14,

    /**
     * File is waiting for its linkfile to load.
     * 
     * @name Phaser.Loader.FILE_WAITING_LINKFILE
     * @type {integer}
     * @since 3.0.0
     */
    FILE_WAITING_LINKFILE: 15,

    /**
     * The File has errored somehow during processing.
     * 
     * @name Phaser.Loader.FILE_ERRORED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_ERRORED: 16,

    /**
     * File has finished processing.
     * 
     * @name Phaser.Loader.FILE_COMPLETE
     * @type {integer}
     * @since 3.0.0
     */
    FILE_COMPLETE: 17,

    /**
     * File has been destroyed
     * 
     * @name Phaser.Loader.FILE_DESTROYED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_DESTROYED: 18,

    /**
     * File was populated from local data and doesn't need an HTTP request
     * 
     * @name Phaser.Loader.FILE_POPULATED
     * @type {integer}
     * @since 3.0.0
     */
    FILE_POPULATED: 19,

    /**
     * A special Texture Atlas const.
     * 
     * @name Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY
     * @type {integer}
     * @since 3.0.0
     */
    TEXTURE_ATLAS_JSON_ARRAY: 20,

    /**
     * A special Texture Atlas const.
     * 
     * @name Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
     * @type {integer}
     * @since 3.0.0
     */
    TEXTURE_ATLAS_JSON_HASH: 21

};

module.exports = FILE_CONST;
