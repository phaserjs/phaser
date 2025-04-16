/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var Events = require('./events');

/**
 * @classdesc
 * A MultiFile is a special kind of parent that contains two, or more, Files as children and looks after
 * the loading and processing of them all. It is commonly extended and used as a base class for file types such as AtlasJSON or BitmapFont.
 *
 * You shouldn't create an instance of a MultiFile directly, but should extend it with your own class, setting a custom type and processing methods.
 *
 * @class MultiFile
 * @memberof Phaser.Loader
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - The Loader that is going to load this File.
 * @param {string} type - The file type string for sorting within the Loader.
 * @param {string} key - The key of the file within the loader.
 * @param {Phaser.Loader.File[]} files - An array of Files that make-up this MultiFile.
 */
var MultiFile = class {

    constructor(loader, type, key, files)
    {
        var finalFiles = [];

        //  Clean out any potential 'null' or 'undefined' file entries
        files.forEach(function (file)
        {
            if (file)
            {
                finalFiles.push(file);
            }
        });

        /**
         * A reference to the Loader that is going to load this file.
         *
         * @name Phaser.Loader.MultiFile#loader
         * @type {Phaser.Loader.LoaderPlugin}
         * @since 3.7.0
         */
        this.loader = loader;

        /**
         * The file type string for sorting within the Loader.
         *
         * @name Phaser.Loader.MultiFile#type
         * @type {string}
         * @since 3.7.0
         */
        this.type = type;

        /**
         * Unique cache key (unique within its file type)
         *
         * @name Phaser.Loader.MultiFile#key
         * @type {string}
         * @since 3.7.0
         */
        this.key = key;

        var loadKey = this.key;

        if (loader.prefix && loader.prefix !== '')
        {
            this.key = loader.prefix + loadKey;
        }

        /**
         * The current index being used by multi-file loaders to avoid key clashes.
         *
         * @name Phaser.Loader.MultiFile#multiKeyIndex
         * @type {number}
         * @private
         * @since 3.20.0
         */
        this.multiKeyIndex = loader.multiKeyIndex++;

        /**
         * Array of files that make up this MultiFile.
         *
         * @name Phaser.Loader.MultiFile#files
         * @type {Phaser.Loader.File[]}
         * @since 3.7.0
         */
        this.files = finalFiles;

        /**
         * The current state of the file. One of the FILE_CONST values.
         *
         * @name Phaser.Loader.MultiFile#state
         * @type {number}
         * @since 3.60.0
         */
        this.state = CONST.FILE_PENDING;

        /**
         * The completion status of this MultiFile.
         *
         * @name Phaser.Loader.MultiFile#complete
         * @type {boolean}
         * @default false
         * @since 3.7.0
         */
        this.complete = false;

        /**
         * The number of files to load.
         *
         * @name Phaser.Loader.MultiFile#pending
         * @type {number}
         * @since 3.7.0
         */

        this.pending = finalFiles.length;

        /**
         * The number of files that failed to load.
         *
         * @name Phaser.Loader.MultiFile#failed
         * @type {number}
         * @default 0
         * @since 3.7.0
         */
        this.failed = 0;

        /**
         * A storage container for transient data that the loading files need.
         *
         * @name Phaser.Loader.MultiFile#config
         * @type {any}
         * @since 3.7.0
         */
        this.config = {};

        /**
         * A reference to the Loaders baseURL at the time this MultiFile was created.
         * Used to populate child-files.
         *
         * @name Phaser.Loader.MultiFile#baseURL
         * @type {string}
         * @since 3.20.0
         */
        this.baseURL = loader.baseURL;

        /**
         * A reference to the Loaders path at the time this MultiFile was created.
         * Used to populate child-files.
         *
         * @name Phaser.Loader.MultiFile#path
         * @type {string}
         * @since 3.20.0
         */
        this.path = loader.path;

        /**
         * A reference to the Loaders prefix at the time this MultiFile was created.
         * Used to populate child-files.
         *
         * @name Phaser.Loader.MultiFile#prefix
         * @type {string}
         * @since 3.20.0
         */
        this.prefix = loader.prefix;

        //  Link the files
        for (var i = 0; i < finalFiles.length; i++)
        {
            finalFiles[i].multiFile = this;
        }
    }

    /**
     * Checks if this MultiFile is ready to process its children or not.
     *
     * @method Phaser.Loader.MultiFile#isReadyToProcess
     * @since 3.7.0
     *
     * @return {boolean} `true` if all children of this MultiFile have loaded, otherwise `false`.
     */
    isReadyToProcess()
    {
        return (this.pending === 0 && this.failed === 0 && !this.complete);
    }

    /**
     * Adds another child to this MultiFile, increases the pending count and resets the completion status.
     *
     * @method Phaser.Loader.MultiFile#addToMultiFile
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} files - The File to add to this MultiFile.
     *
     * @return {Phaser.Loader.MultiFile} This MultiFile instance.
     */
    addToMultiFile(file)
    {
        this.files.push(file);

        file.multiFile = this;

        this.pending++;

        this.complete = false;

        return this;
    }

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.MultiFile#onFileComplete
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete(file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;
        }
    }

    /**
     * Called by each File that fails to load.
     *
     * @method Phaser.Loader.MultiFile#onFileFailed
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has failed to load.
     */
    onFileFailed(file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.failed++;

            // eslint-disable-next-line no-console
            console.error('File failed: %s "%s" (via %s "%s")', this.type, this.key, file.type, file.key);
        }
    }

    /**
     * Called once all children of this multi file have been added to their caches and is now
     * ready for deletion from the Loader.
     *
     * It will emit a `filecomplete` event from the LoaderPlugin.
     *
     * @method Phaser.Loader.MultiFile#pendingDestroy
     * @fires Phaser.Loader.Events#FILE_COMPLETE
     * @fires Phaser.Loader.Events#FILE_KEY_COMPLETE
     * @since 3.60.0
     */
    pendingDestroy()
    {
        if (this.state === CONST.FILE_PENDING_DESTROY)
        {
            return;
        }

        var key = this.key;
        var type = this.type;

        this.loader.emit(Events.FILE_COMPLETE, key, type);
        this.loader.emit(Events.FILE_KEY_COMPLETE + type + '-' + key, key, type);

        this.loader.flagForRemoval(this);

        for (var i = 0; i < this.files.length; i++)
        {
            this.files[i].pendingDestroy();
        }

        this.state = CONST.FILE_PENDING_DESTROY;
    }

    /**
     * Destroy this Multi File and any references it holds.
     *
     * @method Phaser.Loader.MultiFile#destroy
     * @since 3.60.0
     */
    destroy()
    {
        this.loader = null;
        this.files = null;
        this.config = null;
    }

};

module.exports = MultiFile;
