/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class LinkFile
 * @memberOf Phaser.Loader
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - The Loader that is going to load this File.
 * @param {string} type - The file type string for sorting within the Loader.
 * @param {string} key - The key of the file within the loader.
 * @param {Phaser.Loader.File[]} files - An array of Files that make-up this LinkFile.
 */
var LinkFile = new Class({

    initialize:

    function LinkFile (loader, type, key, files)
    {
        /**
         * A reference to the Loader that is going to load this file.
         *
         * @name Phaser.Loader.LinkFile#loader
         * @type {Phaser.Loader.LoaderPlugin}
         * @since 3.7.0
         */
        this.loader = loader;

        /**
         * The file type string for sorting within the Loader.
         *
         * @name Phaser.Loader.LinkFile#type
         * @type {string}
         * @since 3.7.0
         */
        this.type = type;

        /**
         * Unique cache key (unique within its file type)
         *
         * @name Phaser.Loader.LinkFile#key
         * @type {string}
         * @since 3.7.0
         */
        this.key = key;

        /**
         * Array of files that make up this LinkFile.
         *
         * @name Phaser.Loader.LinkFile#files
         * @type {Phaser.Loader.File[]}
         * @since 3.7.0
         */
        this.files = files;

        /**
         * The completion status of this LinkFile.
         *
         * @name Phaser.Loader.LinkFile#complete
         * @type {boolean}
         * @since 3.7.0
         */
        this.complete = false;

        /**
         * The number of files to load.
         *
         * @name Phaser.Loader.LinkFile#pending
         * @type {integer}
         * @since 3.7.0
         */

        this.pending = files.length;

        /**
         * The number of files that failed to load.
         *
         * @name Phaser.Loader.LinkFile#failed
         * @type {integer}
         * @default 0
         * @since 3.7.0
         */
        this.failed = 0;

        this.config = {};

        //  Link the files
        for (var i = 0; i < files.length; i++)
        {
            files[i].linkFile = this;
        }
    },

    isReadyToProcess: function ()
    {
        return (this.pending === 0 && this.failed === 0);
    },

    addToLinkFile: function (file)
    {
        console.log('LinkFile - new file added: ', file.key);

        this.files.push(file);

        file.linkFile = this;

        this.pending++;

        this.complete = false;

        return this;
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.LinkFile#onFileComplete
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;
        }
    },

    /**
     * Called by each File that fails to load.
     *
     * @method Phaser.Loader.LinkFile#onFileFailed
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has failed to load.
     */
    onFileFailed: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.failed++;
        }
    }

});

module.exports = LinkFile;
