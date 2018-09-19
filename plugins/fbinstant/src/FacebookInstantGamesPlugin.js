/* eslint no-console: 0 */

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AdInstance = require('./AdInstance');
var Class = require('../../../src/utils/Class');
var DataManager = require('../../../src/data/DataManager');
var EventEmitter = require('eventemitter3');
var Leaderboard = require('./Leaderboard');
var Product = require('./Product');
var Purchase = require('./Purchase');

/**
 * @classdesc
 * The Facebook Instant Games Plugin for Phaser 3 provides a seamless bridge between Phaser
 * and the Facebook Instant Games API. Through-out the documentation for this plugin we will
 * refer to the Facebook Instant Games API as the FBIG API.
 *
 * @class FacebookInstantGamesPlugin
 * @memberOf Phaser
 * @constructor
 * @extends Phaser.Events.EventEmitter
 * @since 3.12.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 * @param {FBConfig} config
 */
var FacebookInstantGamesPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function FacebookInstantGamesPlugin (game)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Phaser.Game instance.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#game
         * @type {Phaser.Game}
         * @readOnly
         * @since 3.13.0
         */
        this.game = game;

        /**
         * A Data Manager instance.
         * It allows you to store, query and retrieve any key/value data you may need to store.
         * It's also used internally by the plugin to store FBIG API data.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#data
         * @type {Phaser.Data.DataManager}
         * @since 3.13.0
         */
        this.data = new DataManager(this);

        this.on('setdata', this.setDataHandler, this);
        this.on('changedata', this.changeDataHandler, this);

        /**
         * Has the Facebook Instant Games API loaded yet?
         * This is set automatically during the boot process.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#hasLoaded
         * @type {boolean}
         * @since 3.13.0
         */
        this.hasLoaded = false;

        /**
         * Is the Data Manager currently locked?
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#dataLocked
         * @type {boolean}
         * @since 3.13.0
         */
        this.dataLocked = false;

        /**
         * A list of the Facebook Instant Games APIs that are available,
         * based on the given platform, context and user privacy settings.
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#supportedAPIs
         * @type {string[]}
         * @since 3.13.0
         */
        this.supportedAPIs = [];

        /**
         * Holds the entry point that the game was launched from.
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#entryPoint
         * @type {string}
         * @since 3.13.0
         */
        this.entryPoint = '';

        /**
         * An object that contains any data associated with the entry point that the game was launched from.
         * The contents of the object are developer-defined, and can occur from entry points on different platforms.
         * This will return null for older mobile clients, as well as when there is no data associated with the particular entry point.
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#entryPointData
         * @type {any}
         * @since 3.13.0
         */
        this.entryPointData = null;

        /**
         * A unique identifier for the current game context. This represents a specific context
         * that the game is being played in (for example, a particular messenger conversation or facebook post).
         * The identifier will be null if game is being played in a solo context.
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#contextID
         * @type {string}
         * @since 3.13.0
         */
        this.contextID = null;

        /**
         * The current context in which your game is running. This can be either `null` or
         * one of:
         * 
         * `POST` - The game is running inside of a Facebook post.
         * `THREAD` - The game is running inside a Facebook Messenger thread.
         * `GROUP` - The game is running inside a Facebook Group.
         * `SOLO` - This is the default context, the player is the only participant.
         * 
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#contextType
         * @type {?string}
         * @since 3.13.0
         */
        this.contextType = null;

        /**
         * The current locale.
         * See https://origincache.facebook.com/developers/resources/?id=FacebookLocales.xml for a complete list of supported locale values.
         * Use this to determine what languages the current game should be localized with.
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#locale
         * @type {?string}
         * @since 3.13.0
         */
        this.locale = null;

        /**
         * The platform on which the game is currently running, i.e. `IOS`.
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#platform
         * @type {?string}
         * @since 3.13.0
         */
        this.platform = null;

        /**
         * The string representation of the Facebook Instant Games SDK version being used.
         * This value is populated automatically during boot.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#version
         * @type {?string}
         * @since 3.13.0
         */
        this.version = null;

        /**
         * Holds the id of the player. This is a string based ID, the same as `FBInstant.player.getID()`.
         * This value is populated automatically during boot if the API is supported.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#playerID
         * @type {?string}
         * @since 3.13.0
         */
        this.playerID = null;

        /**
         * The player's localized display name.
         * This value is populated automatically during boot if the API is supported.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#playerName
         * @type {?string}
         * @since 3.13.0
         */
        this.playerName = null;

        /**
         * A url to the player's public profile photo. The photo will always be a square, and with dimensions
         * of at least 200x200. When rendering it in the game, the exact dimensions should never be assumed to be constant.
         * It's recommended to always scale the image to a desired size before rendering.
         * This value is populated automatically during boot if the API is supported.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#playerPhotoURL
         * @type {?string}
         * @since 3.13.0
         */
        this.playerPhotoURL = null;

        /**
         * Whether a player can subscribe to the game bot or not.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#playerCanSubscribeBot
         * @type {boolean}
         * @since 3.13.0
         */
        this.playerCanSubscribeBot = false;

        /**
         * Does the current platform and context allow for use of the payments API?
         * Currently this is only available on Facebook.com and Android 6+.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#paymentsReady
         * @type {boolean}
         * @since 3.13.0
         */
        this.paymentsReady = false;

        /**
         * The set of products that are registered to the game.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#catalog
         * @type {array}
         * @since 3.13.0
         */
        this.catalog = [];

        /**
         * Contains all of the player's unconsumed purchases.
         * The game must fetch the current player's purchases as soon as the client indicates that it is ready to perform payments-related operations,
         * i.e. at game start. The game can then process and consume any purchases that are waiting to be consumed.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#purchases
         * @type {array}
         * @since 3.13.0
         */
        this.purchases = [];

        /**
         * Contains all of the leaderboard data, as populated by the `getLeaderboard()` method.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#leaderboards
         * @type {any}
         * @since 3.13.0
         */
        this.leaderboards = {};

        /**
         * Contains AdInstance objects, as created by the `preloadAds()` method.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#ads
         * @type {array}
         * @since 3.13.0
         */
        this.ads = [];
    },

    /**
     * Internal set data handler.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#setDataHandler
     * @private
     * @since 3.13.0
     *
     * @param {Phaser.Data.DataManager} parent - The parent Data Manager instance.
     * @param {string} key - The key of the data.
     * @param {any} value - The value of the data.
     */
    setDataHandler: function (parent, key, value)
    {
        if (this.dataLocked)
        {
            return;
        }

        var data = {};

        data[key] = value;

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function ()
        {
            _this.emit('savedata', data);
        });
    },

    /**
     * Internal change data handler.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#changeDataHandler
     * @private
     * @since 3.13.0
     *
     * @param {Phaser.Data.DataManager} parent - The parent Data Manager instance.
     * @param {string} key - The key of the data.
     * @param {any} value - The value of the data.
     */
    changeDataHandler: function (parent, key, value)
    {
        if (this.dataLocked)
        {
            return;
        }

        var data = {};

        data[key] = value;

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function ()
        {
            _this.emit('savedata', data);
        });
    },

    /**
     * Call this method from your `Scene.preload` in order to sync the load progress
     * of the Phaser Loader with the Facebook Instant Games loader display, i.e.:
     * 
     * ```javascript
     * this.facebook.showLoadProgress(this);
     * this.facebook.once('startgame', this.startGame, this);
     * ```
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#showLoadProgress
     * @since 3.13.0
     *
     * @param {Phaser.Scene} scene - The Scene for which you want to show loader progress for.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    showLoadProgress: function (scene)
    {
        scene.load.on('progress', function (value)
        {
            if (!this.hasLoaded)
            {
                FBInstant.setLoadingProgress(value * 100);
            }

        }, this);

        scene.load.on('complete', function ()
        {
            if (!this.hasLoaded)
            {
                this.hasLoaded = true;

                FBInstant.startGameAsync().then(this.gameStarted.bind(this));
            }
            
        }, this);

        return this;
    },

    /**
     * This method is called automatically when the game has finished loading,
     * if you used the `showLoadProgress` method. If your game doesn't need to
     * load any assets, or you're managing the load yourself, then call this
     * method directly to start the API running.
     * 
     * When the API has finished starting this plugin will emit a `startgame` event
     * which you should listen for.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#gameStarted
     * @since 3.13.0
     */
    gameStarted: function ()
    {
        var APIs = FBInstant.getSupportedAPIs();

        var supported = {};

        var dotToUpper = function (match)
        {
            return match[1].toUpperCase();
        };

        APIs.forEach(function (api)
        {
            api = api.replace(/\../g, dotToUpper);

            supported[api] = true;
        });

        this.supportedAPIs = supported;

        this.getID();
        this.getType();
        this.getLocale();
        this.getPlatform();
        this.getSDKVersion();

        this.getPlayerID();
        this.getPlayerName();
        this.getPlayerPhotoURL();

        var _this = this;

        FBInstant.onPause(function ()
        {
            _this.emit('pause');
        });

        FBInstant.getEntryPointAsync().then(function (entrypoint)
        {
            _this.entryPoint = entrypoint;
            _this.entryPointData = FBInstant.getEntryPointData();

            _this.emit('startgame');

        }).catch(function (e)
        {
            console.warn(e);
        });

        //  Facebook.com and Android 6 only
        if (this.supportedAPIs.paymentsPurchaseAsync)
        {
            FBInstant.payments.onReady(function ()
            {
                _this.paymentsReady = true;

            }).catch(function (e)
            {
                console.warn(e);
            });
        }
    },

    /**
     * Checks to see if a given Facebook Instant Games API is available or not.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#checkAPI
     * @since 3.13.0
     * 
     * @param {string} api - The API to check for, i.e. `player.getID`.
     * 
     * @return {boolean} `true` if the API is supported, otherwise `false`.
     */
    checkAPI: function (api)
    {
        if (!this.supportedAPIs[api])
        {
            return false;
        }
        else
        {
            return true;
        }
    },

    /**
     * Returns the unique identifier for the current game context. This represents a specific context
     * that the game is being played in (for example, a particular messenger conversation or facebook post).
     * The identifier will be null if game is being played in a solo context.
     * 
     * It is only populated if `contextGetID` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getID
     * @since 3.13.0
     * 
     * @return {string} The context ID.
     */
    getID: function ()
    {
        if (!this.contextID && this.supportedAPIs.contextGetID)
        {
            this.contextID = FBInstant.context.getID();
        }

        return this.contextID;
    },

    /**
     * Returns the current context in which your game is running. This can be either `null` or one of:
     * 
     * `POST` - The game is running inside of a Facebook post.
     * `THREAD` - The game is running inside a Facebook Messenger thread.
     * `GROUP` - The game is running inside a Facebook Group.
     * `SOLO` - This is the default context, the player is the only participant.
     * 
     * It is only populated if `contextGetType` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getType
     * @since 3.13.0
     * 
     * @return {?string} The context type.
     */
    getType: function ()
    {
        if (!this.contextType && this.supportedAPIs.contextGetType)
        {
            this.contextType = FBInstant.context.getType();
        }

        return this.contextType;
    },

    /**
     * Returns the current locale.
     * See https://origincache.facebook.com/developers/resources/?id=FacebookLocales.xml for a complete list of supported locale values.
     * Use this to determine what languages the current game should be localized with.
     * It is only populated if `getLocale` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getLocale
     * @since 3.13.0
     * 
     * @return {?string} The current locale.
     */
    getLocale: function ()
    {
        if (!this.locale && this.supportedAPIs.getLocale)
        {
            this.locale = FBInstant.getLocale();
        }

        return this.locale;
    },

    /**
     * Returns the platform on which the game is currently running, i.e. `IOS`.
     * It is only populated if `getPlatform` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getPlatform
     * @since 3.13.0
     * 
     * @return {?string} The current platform.
     */
    getPlatform: function ()
    {
        if (!this.platform && this.supportedAPIs.getPlatform)
        {
            this.platform = FBInstant.getPlatform();
        }

        return this.platform;
    },

    /**
     * Returns the string representation of the Facebook Instant Games SDK version being used.
     * It is only populated if `getSDKVersion` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getSDKVersion
     * @since 3.13.0
     * 
     * @return {?string} The sdk version.
     */
    getSDKVersion: function ()
    {
        if (!this.version && this.supportedAPIs.getSDKVersion)
        {
            this.version = FBInstant.getSDKVersion();
        }

        return this.version;
    },

    /**
     * Returns the id of the player. This is a string based ID, the same as `FBInstant.player.getID()`.
     * It is only populated if `playerGetID` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getPlayerID
     * @since 3.13.0
     * 
     * @return {?string} The player ID.
     */
    getPlayerID: function ()
    {
        if (!this.playerID && this.supportedAPIs.playerGetID)
        {
            this.playerID = FBInstant.player.getID();
        }

        return this.playerID;
    },

    /**
     * Returns the player's localized display name.
     * It is only populated if `playerGetName` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getPlayerName
     * @since 3.13.0
     * 
     * @return {?string} The player's localized display name.
     */
    getPlayerName: function ()
    {
        if (!this.playerName && this.supportedAPIs.playerGetName)
        {
            this.playerName = FBInstant.player.getName();
        }

        return this.playerName;
    },

    /**
     * Returns the url to the player's public profile photo. The photo will always be a square, and with dimensions
     * of at least 200x200. When rendering it in the game, the exact dimensions should never be assumed to be constant.
     * It's recommended to always scale the image to a desired size before rendering.
     * It is only populated if `playerGetPhoto` is in the list of supported APIs.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getPlayerPhotoURL
     * @since 3.13.0
     * 
     * @return {?string} The player's photo url.
     */
    getPlayerPhotoURL: function ()
    {
        if (!this.playerPhotoURL && this.supportedAPIs.playerGetPhoto)
        {
            this.playerPhotoURL = FBInstant.player.getPhoto();
        }

        return this.playerPhotoURL;
    },

    /**
     * Load the player's photo and store it in the Texture Manager, ready for use in-game.
     * 
     * This method works by using a Scene Loader instance and then asking the Loader to
     * retrieve the image.
     * 
     * When complete the plugin will emit a `photocomplete` event, along with the key of the photo.
     * 
     * ```javascript
     * this.facebook.loadPlayerPhoto(this, 'player').once('photocomplete', function (key) {
     *   this.add.image(x, y, 'player);
     * }, this);
     * ```
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#loadPlayerPhoto
     * @since 3.13.0
     * 
     * @param {Phaser.Scene} scene - The Scene that will be responsible for loading this photo.
     * @param {string} key - The key to use when storing the photo in the Texture Manager.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    loadPlayerPhoto: function (scene, key)
    {
        if (this.playerPhotoURL)
        {
            scene.load.setCORS('anonymous');
    
            scene.load.image(key, this.playerPhotoURL);
    
            scene.load.on('complete', function ()
            {
                this.emit('photocomplete', key);

            }, this);
    
            scene.load.start();
        }

        return this;
    },

    /**
     * Checks if the current player can subscribe to the game bot.
     * 
     * It makes an async call to the API, so the result isn't available immediately.
     * 
     * If they can subscribe, the `playerCanSubscribeBot` property is set to `true`
     * and this plugin will emit the `cansubscribebot` event.
     * 
     * If they cannot, i.e. it's not in the list of supported APIs, or the request
     * was rejected, it will emit a `cansubscribebotfail` event instead.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#canSubscribeBot
     * @since 3.13.0
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    canSubscribeBot: function ()
    {
        if (this.supportedAPIs.playerCanSubscribeBotAsync)
        {
            var _this = this;

            FBInstant.player.canSubscribeBotAsync().then(function ()
            {
                _this.playerCanSubscribeBot = true;

                _this.emit('cansubscribebot');

            }).catch(function (e)
            {
                _this.emit('cansubscribebotfail', e);
            });
        }
        else
        {
            this.emit('cansubscribebotfail');
        }

        return this;
    },

    /**
     * Subscribes the current player to the game bot.
     * 
     * It makes an async call to the API, so the result isn't available immediately.
     * 
     * If they are successfully subscribed this plugin will emit the `subscribebot` event.
     * 
     * If they cannot, i.e. it's not in the list of supported APIs, or the request
     * was rejected, it will emit a `subscribebotfail` event instead.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#subscribeBot
     * @since 3.13.0
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    subscribeBot: function ()
    {
        if (this.playerCanSubscribeBot)
        {
            var _this = this;

            FBInstant.player.subscribeBotAsync().then(function ()
            {
                _this.emit('subscribebot');

            }).catch(function (e)
            {
                _this.emit('subscribebotfail', e);
            });
        }
        else
        {
            this.emit('subscribebotfail');
        }

        return this;
    },

    /**
     * Gets the associated data from the player based on the given key, or array of keys.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes the data is set into this plugins Data Manager and the
     * `getdata` event will be emitted.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getData
     * @since 3.13.0
     * 
     * @param {(string|string[])} keys - The key/s of the data to retrieve.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    getData: function (keys)
    {
        if (!this.checkAPI('playerGetDataAsync'))
        {
            return this;
        }

        if (!Array.isArray(keys))
        {
            keys = [ keys ];
        }

        var _this = this;

        FBInstant.player.getDataAsync(keys).then(function (data)
        {
            _this.dataLocked = true;

            for (var key in data)
            {
                _this.data.set(key, data[key]);
            }

            _this.dataLocked = false;

            _this.emit('getdata', data);
        });

        return this;
    },

    /**
     * Set data to be saved to the designated cloud storage of the current player. The game can store up to 1MB of data for each unique player.
     * 
     * The data save is requested in an async call, so the result isn't available immediately.
     * 
     * Data managed via this plugins Data Manager instance is automatically synced with Facebook. However, you can call this
     * method directly if you need to replace the data object directly.
     * 
     * When the APIs `setDataAsync` call resolves it will emit the `savedata` event from this plugin. If the call fails for some
     * reason it will emit `savedatafail` instead.
     * 
     * The call resolving does not necessarily mean that the input has already been persisted. Rather, it means that the data was valid and
     * has been scheduled to be saved. It also guarantees that all values that were set are now available in `getData`.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#saveData
     * @since 3.13.0
     * 
     * @param {object} data - An object containing a set of key-value pairs that should be persisted to cloud storage.
     * The object must contain only serializable values - any non-serializable values will cause the entire modification to be rejected.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    saveData: function (data)
    {
        if (!this.checkAPI('playerSetDataAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function ()
        {
            _this.emit('savedata', data);

        }).catch(function (e)
        {
            _this.emit('savedatafail', e);
        });

        return this;
    },

    /**
     * Immediately flushes any changes to the player data to the designated cloud storage.
     * This function is expensive, and should primarily be used for critical changes where persistence needs to be immediate
     * and known by the game. Non-critical changes should rely on the platform to persist them in the background.
     * NOTE: Calls to player.setDataAsync will be rejected while this function's result is pending.
     * 
     * Data managed via this plugins Data Manager instance is automatically synced with Facebook. However, you can call this
     * method directly if you need to flush the data directly.
     * 
     * When the APIs `flushDataAsync` call resolves it will emit the `flushdata` event from this plugin. If the call fails for some
     * reason it will emit `flushdatafail` instead.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#flushData
     * @since 3.13.0
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    flushData: function ()
    {
        if (!this.checkAPI('playerFlushDataAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.player.flushDataAsync().then(function ()
        {
            _this.emit('flushdata');

        }).catch(function (e)
        {
            _this.emit('flushdatafail', e);
        });

        return this;
    },

    /**
     * Retrieve stats from the designated cloud storage of the current player.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes the `getstats` event will be emitted along with the data object returned.
     * 
     * If the call fails, i.e. it's not in the list of supported APIs, or the request was rejected,
     * it will emit a `getstatsfail` event instead.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#getStats
     * @since 3.13.0
     * 
     * @param {string[]} [keys] - An optional array of unique keys to retrieve stats for. If the function is called without it, it will fetch all stats.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    getStats: function (keys)
    {
        if (!this.checkAPI('playerGetStatsAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.player.getStatsAsync(keys).then(function (data)
        {
            _this.emit('getstats', data);

        }).catch(function (e)
        {
            _this.emit('getstatsfail', e);
        });

        return this;
    },

    /**
     * Save the stats of the current player to the designated cloud storage.
     * 
     * Stats in the Facebook Instant Games API are purely numerical values paired with a string-based key. Only numbers can be saved as stats,
     * all other data types will be ignored.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes the `savestats` event will be emitted along with the data object returned.
     * 
     * If the call fails, i.e. it's not in the list of supported APIs, or the request was rejected,
     * it will emit a `savestatsfail` event instead.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#saveStats
     * @since 3.13.0
     * 
     * @param {object} data - An object containing a set of key-value pairs that should be persisted to cloud storage as stats. Note that only numerical values are stored.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    saveStats: function (data)
    {
        if (!this.checkAPI('playerSetStatsAsync'))
        {
            return this;
        }

        var output = {};

        for (var key in data)
        {
            if (typeof data[key] === 'number')
            {
                output[key] = data[key];
            }
        }

        var _this = this;

        FBInstant.player.setStatsAsync(output).then(function ()
        {
            _this.emit('savestats', output);

        }).catch(function (e)
        {
            _this.emit('savestatsfail', e);
        });

        return this;
    },

    /**
     * Increment the stats of the current player and save them to the designated cloud storage.
     * 
     * Stats in the Facebook Instant Games API are purely numerical values paired with a string-based key. Only numbers can be saved as stats,
     * all other data types will be ignored.
     * 
     * The data object provided for this call should contain offsets for how much to modify the stats by:
     * 
     * ```javascript
     * this.facebook.incStats({
     *     level: 1,
     *     zombiesSlain: 17,
     *     rank: -1
     * });
     * ```
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes the `incstats` event will be emitted along with the data object returned.
     * 
     * If the call fails, i.e. it's not in the list of supported APIs, or the request was rejected,
     * it will emit a `incstatsfail` event instead.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#incStats
     * @since 3.13.0
     * 
     * @param {object} data - An object containing a set of key-value pairs indicating how much to increment each stat in cloud storage. Note that only numerical values are processed.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    incStats: function (data)
    {
        if (!this.checkAPI('playerIncrementStatsAsync'))
        {
            return this;
        }

        var output = {};

        for (var key in data)
        {
            if (typeof data[key] === 'number')
            {
                output[key] = data[key];
            }
        }

        var _this = this;

        FBInstant.player.incrementStatsAsync(output).then(function (stats)
        {
            _this.emit('incstats', stats);

        }).catch(function (e)
        {
            _this.emit('incstatsfail', e);
        });

        return this;
    },

    /**
     * Sets the data associated with the individual gameplay session for the current context.
     * 
     * This function should be called whenever the game would like to update the current session data.
     * 
     * This session data may be used to populate a variety of payloads, such as game play webhooks.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#saveSession
     * @since 3.13.0
     * 
     * @param {object} data - An arbitrary data object, which must be less than or equal to 1000 characters when stringified.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    saveSession: function (data)
    {
        if (!this.checkAPI('setSessionData'))
        {
            return this;
        }

        var test = JSON.stringify(data);

        if (test.length <= 1000)
        {
            FBInstant.setSessionData(data);
        }
        else
        {
            console.warn('Session data too long. Max 1000 chars.');
        }

        return this;
    },

    /**
     * This invokes a dialog to let the user share specified content, either as a message in Messenger or as a post on the user's timeline.
     * 
     * A blob of data can be attached to the share which every game session launched from the share will be able to access via the `this.entryPointData` property.
     * 
     * This data must be less than or equal to 1000 characters when stringified.
     * 
     * When this method is called you should consider your game paused. Listen out for the `resume` event from this plugin to know when the dialog has been closed.
     * 
     * The user may choose to cancel the share action and close the dialog. The resulting `resume` event will be dispatched regardless if the user actually shared the content or not.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#openShare
     * @since 3.13.0
     * 
     * @param {string} text - A text message to be shared.
     * @param {string} key - The key of the texture to use as the share image.
     * @param {string} [frame] - The frame of the texture to use as the share image. Set to `null` if you don't require a frame, but do need to set session data.
     * @param {object} [sessionData] - A blob of data to attach to the share.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    openShare: function (text, key, frame, sessionData)
    {
        return this._share('SHARE', text, key, frame, sessionData);
    },

    /**
     * This invokes a dialog to let the user invite a friend to play this game, either as a message in Messenger or as a post on the user's timeline.
     * 
     * A blob of data can be attached to the share which every game session launched from the share will be able to access via the `this.entryPointData` property.
     * 
     * This data must be less than or equal to 1000 characters when stringified.
     * 
     * When this method is called you should consider your game paused. Listen out for the `resume` event from this plugin to know when the dialog has been closed.
     * 
     * The user may choose to cancel the share action and close the dialog. The resulting `resume` event will be dispatched regardless if the user actually shared the content or not.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#openInvite
     * @since 3.13.0
     * 
     * @param {string} text - A text message to be shared.
     * @param {string} key - The key of the texture to use as the share image.
     * @param {string} [frame] - The frame of the texture to use as the share image. Set to `null` if you don't require a frame, but do need to set session data.
     * @param {object} [sessionData] - A blob of data to attach to the share.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    openInvite: function (text, key, frame, sessionData)
    {
        return this._share('INVITE', text, key, frame, sessionData);
    },

    /**
     * This invokes a dialog to let the user share specified content, either as a message in Messenger or as a post on the user's timeline.
     * 
     * A blob of data can be attached to the share which every game session launched from the share will be able to access via the `this.entryPointData` property.
     * 
     * This data must be less than or equal to 1000 characters when stringified.
     * 
     * When this method is called you should consider your game paused. Listen out for the `resume` event from this plugin to know when the dialog has been closed.
     * 
     * The user may choose to cancel the share action and close the dialog. The resulting `resume` event will be dispatched regardless if the user actually shared the content or not.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#openRequest
     * @since 3.13.0
     * 
     * @param {string} text - A text message to be shared.
     * @param {string} key - The key of the texture to use as the share image.
     * @param {string} [frame] - The frame of the texture to use as the share image. Set to `null` if you don't require a frame, but do need to set session data.
     * @param {object} [sessionData] - A blob of data to attach to the share.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    openRequest: function (text, key, frame, sessionData)
    {
        return this._share('REQUEST', text, key, frame, sessionData);
    },

    /**
     * This invokes a dialog to let the user share specified content, either as a message in Messenger or as a post on the user's timeline.
     * 
     * A blob of data can be attached to the share which every game session launched from the share will be able to access via the `this.entryPointData` property.
     * 
     * This data must be less than or equal to 1000 characters when stringified.
     * 
     * When this method is called you should consider your game paused. Listen out for the `resume` event from this plugin to know when the dialog has been closed.
     * 
     * The user may choose to cancel the share action and close the dialog. The resulting `resume` event will be dispatched regardless if the user actually shared the content or not.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#openChallenge
     * @since 3.13.0
     * 
     * @param {string} text - A text message to be shared.
     * @param {string} key - The key of the texture to use as the share image.
     * @param {string} [frame] - The frame of the texture to use as the share image. Set to `null` if you don't require a frame, but do need to set session data.
     * @param {object} [sessionData] - A blob of data to attach to the share.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    openChallenge: function (text, key, frame, sessionData)
    {
        return this._share('CHALLENGE', text, key, frame, sessionData);
    },

    /**
     * Internal share handler.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#_share
     * @private
     * @since 3.13.0
     * 
     * @param {string} intent - ("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") Indicates the intent of the share.
     * @param {string} text - A text message to be shared.
     * @param {string} key - The key of the texture to use as the share image.
     * @param {string} [frame] - The frame of the texture to use as the share image. Set to `null` if you don't require a frame, but do need to set session data.
     * @param {object} [sessionData] - A blob of data to attach to the share.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    _share: function (intent, text, key, frame, sessionData)
    {
        if (!this.checkAPI('shareAsync'))
        {
            return this;
        }

        if (sessionData === undefined) { sessionData = {}; }

        if (key)
        {
            var imageData = this.game.textures.getBase64(key, frame);
        }

        // intent ("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") Indicates the intent of the share.
        // image string A base64 encoded image to be shared.
        // text string A text message to be shared.
        // data Object? A blob of data to attach to the share. All game sessions launched from the share will be able to access this blob through FBInstant.getEntryPointData().

        var payload = {
            intent: intent,
            image: imageData,
            text: text,
            data: sessionData
        };

        var _this = this;

        FBInstant.shareAsync(payload).then(function ()
        {
            _this.emit('resume');
        });

        return this;
    },

    /**
     * This function determines whether the number of participants in the current game context is between a given minimum and maximum, inclusive.
     * If one of the bounds is null only the other bound will be checked against.
     * It will always return the original result for the first call made in a context in a given game play session.
     * Subsequent calls, regardless of arguments, will return the answer to the original query until a context change occurs and the query result is reset.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#isSizeBetween
     * @since 3.13.0
     * 
     * @param {integer} [min] - The minimum bound of the context size query.
     * @param {integer} [max] - The maximum bound of the context size query.
     * 
     * @return {object} The Context Size Response object in the format: `{answer: boolean, minSize: number?, maxSize: number?}`.
     */
    isSizeBetween: function (min, max)
    {
        if (!this.checkAPI('contextIsSizeBetween'))
        {
            return this;
        }

        return FBInstant.context.isSizeBetween(min, max);
    },

    /**
     * Request a switch into a specific context. If the player does not have permission to enter that context,
     * or if the player does not provide permission for the game to enter that context, this will emit a `switchfail` event.
     * 
     * Otherwise, the plugin will emit the `switch` event when the game has switched into the specified context.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#switchContext
     * @since 3.13.0
     * 
     * @param {string} contextID - The ID of the desired context.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    switchContext: function (contextID)
    {
        if (!this.checkAPI('contextSwitchAsync'))
        {
            return this;
        }

        if (contextID !== this.contextID)
        {
            var _this = this;

            FBInstant.context.switchAsync(contextID).then(function ()
            {
                _this.contextID = FBInstant.context.getID();

                _this.emit('switch', _this.contextID);

            }).catch(function (e)
            {
                _this.emit('switchfail', e);
            });
        }

        return this;
    },

    /**
     * Opens a context selection dialog for the player. If the player selects an available context,
     * the client will attempt to switch into that context, and emit th `choose` event if successful.
     * Otherwise, if the player exits the menu or the client fails to switch into the new context, the `choosefail` event will be emitted.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#chooseContext
     * @since 3.13.0
     * 
     * @param {string} contextID - The ID of the desired context.
     * 
     * @return {this} This Facebook Instant Games Plugin instance.
     */
    chooseContext: function (options)
    {
        if (!this.checkAPI('contextChoseAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.context.chooseAsync(options).then(function ()
        {
            _this.contextID = FBInstant.context.getID();
            _this.emit('choose', _this.contextID);

        }).catch(function (e)
        {
            _this.emit('choosefail', e);
        });

        return this;
    },

    createContext: function (playerID)
    {
        if (!this.checkAPI('contextCreateAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.context.createAsync(playerID).then(function ()
        {
            _this.contextID = FBInstant.context.getID();
            _this.emit('create', _this.contextID);
        });

        return this;
    },

    getPlayers: function ()
    {
        if (!this.checkAPI('playerGetConnectedPlayersAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.player.getConnectedPlayersAsync().then(function (players)
        {
            console.log('got player data');
            console.log(players);

            _this.emit('players', players);
        });

        return this;
    },

    getCatalog: function ()
    {
        if (!this.paymentsReady)
        {
            return this;
        }

        var _this = this;
        var catalog = this.catalog;

        FBInstant.payments.getCatalogAsync().then(function (data)
        {
            console.log('got catalog');

            catalog = [];

            data.forEach(function (item)
            {

                catalog.push(Product(item));

            });

            _this.emit('getcatalog', catalog);
        });

        return this;
    },

    purchase: function (productID, developerPayload)
    {
        if (!this.paymentsReady)
        {
            return this;
        }

        var config = {productID: productID};

        if (developerPayload)
        {
            config.developerPayload = developerPayload;
        }

        var _this = this;

        FBInstant.payments.purchaseAsync(config).then(function (data)
        {
            var purchase = Purchase(data);

            console.log('product purchase', purchase);

            _this.emit('purchase', purchase);
        });

        return this;
    },

    getPurchases: function ()
    {
        if (!this.paymentsReady)
        {
            return this;
        }

        var _this = this;
        var purchases = this.purchases;

        FBInstant.payments.getPurchasesAsync().then(function (data)
        {
            console.log('got purchases');

            purchases = [];

            data.forEach(function (item)
            {

                purchases.push(Purchase(item));

            });

            _this.emit('getpurchases', purchases);
        });

        return this;
    },

    consumePurchases: function (purchaseToken)
    {
        if (!this.paymentsReady)
        {
            return this;
        }

        var _this = this;

        FBInstant.payments.consumePurchaseAsync(purchaseToken).then(function ()
        {
            console.log('purchase consumed');

            _this.emit('consumepurchase', purchaseToken);
        });

        return this;
    },

    update: function (cta, text, key, frame, template, updateData)
    {
        return this._update('CUSTOM', cta, text, key, frame, template, updateData);
    },

    updateLeaderboard: function (cta, text, key, frame, template, updateData)
    {
        return this._update('LEADERBOARD', cta, text, key, frame, template, updateData);
    },

    _update: function (action, cta, text, key, frame, template, updateData)
    {
        if (!this.checkAPI('shareAsync'))
        {
            return this;
        }

        if (cta === undefined) { cta = ''; }

        if (typeof text === 'string')
        {
            text = {default: text};
        }

        if (updateData === undefined) { updateData = {}; }

        if (key)
        {
            var imageData = this.game.textures.getBase64(key, frame);
        }

        var payload = {
            action: action,
            cta: cta,
            image: imageData,
            text: text,
            template: template,
            data: updateData,
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH'
        };

        var _this = this;

        FBInstant.updateAsync(payload).then(function ()
        {
            _this.emit('update');
        });

        return this;
    },

    switchGame: function (appID, data)
    {
        if (!this.checkAPI('switchGameAsync'))
        {
            return this;
        }

        if (data)
        {
            var test = JSON.stringify(data);

            if (test.length > 1000)
            {
                console.warn('Switch Game data too long. Max 1000 chars.');
                return this;
            }
        }

        var _this = this;

        FBInstant.switchGameAsync(appID, data).then(function ()
        {
            _this.emit('switchgame', appID);
        });

        return this;
    },

    createShortcut: function ()
    {
        var _this = this;

        FBInstant.canCreateShortcutAsync().then(function (canCreateShortcut)
        {
            if (canCreateShortcut)
            {
                FBInstant.createShortcutAsync().then(function ()
                {
                    _this.emit('shortcutcreated');
                }).catch(function ()
                {
                    _this.emit('shortcutfailed');
                });
            }

        });
    },

    quit: function ()
    {
        FBInstant.quit();
    },

    log: function (name, value, params)
    {
        if (!this.checkAPI('logEvent'))
        {
            return this;
        }

        if (params === undefined) { params = {}; }

        if (name.length >= 2 && name.length <= 40)
        {
            FBInstant.logEvent(name, parseFloat(value), params);
        }

        return this;
    },

    preloadAds: function (placementID)
    {
        if (!this.checkAPI('getInterstitialAdAsync'))
        {
            return this;
        }

        if (!Array.isArray(placementID))
        {
            placementID = [ placementID ];
        }

        var i;
        var _this = this;

        var total = 0;

        for (i = 0; i < this.ads.length; i++)
        {
            if (!this.ads[i].shown)
            {
                total++;
            }
        }

        if (total + placementID.length >= 3)
        {
            console.warn('Too many AdInstances. Show an ad before loading more');
            return this;
        }

        for (i = 0; i < placementID.length; i++)
        {
            var id = placementID[i];

            FBInstant.getInterstitialAdAsync(id).then(function (data)
            {
                console.log('ad preloaded');
    
                var ad = AdInstance(data, true);
    
                _this.ads.push(ad);
    
                return ad.loadAsync();
    
            }).catch(function (e)
            {
                console.error(e);
            });
        }

        return this;
    },

    preloadVideoAds: function (placementID)
    {
        if (!this.checkAPI('getRewardedVideoAsync'))
        {
            return this;
        }

        if (!Array.isArray(placementID))
        {
            placementID = [ placementID ];
        }

        var i;
        var _this = this;

        var total = 0;

        for (i = 0; i < this.ads.length; i++)
        {
            if (!this.ads[i].shown)
            {
                total++;
            }
        }

        if (total + placementID.length >= 3)
        {
            console.warn('Too many AdInstances. Show an ad before loading more');
            return this;
        }

        for (i = 0; i < placementID.length; i++)
        {
            var id = placementID[i];

            FBInstant.getRewardedVideoAsync(id).then(function (data)
            {
                console.log('video ad preloaded');

                var ad = AdInstance(data, true);
    
                _this.ads.push(ad);
    
                return ad.loadAsync();
    
            }).catch(function (e)
            {
                console.error(e);
            });
        }

        return this;
    },

    showAd: function (placementID)
    {
        var _this = this;

        for (var i = 0; i < this.ads.length; i++)
        {
            var ad = this.ads[i];

            if (ad.placementID === placementID)
            {
                ad.instance.showAsync().then(function ()
                {
                    ad.shown = true;

                    _this.emit('showad', ad);
                }).catch(function (e)
                {
                    if (e.code === 'ADS_NO_FILL')
                    {
                        _this.emit('adsnofill');
                    }
                    else
                    {
                        console.error(e);
                    }
                });
            }
        }

        return this;
    },

    showVideo: function (placementID)
    {
        var _this = this;

        for (var i = 0; i < this.ads.length; i++)
        {
            var ad = this.ads[i];

            if (ad.placementID === placementID && ad.video)
            {
                ad.instance.showAsync().then(function ()
                {
                    ad.shown = true;

                    _this.emit('showvideo', ad);
                }).catch(function (e)
                {
                    if (e.code === 'ADS_NO_FILL')
                    {
                        _this.emit('adsnofill');
                    }
                    else
                    {
                        console.error(e);
                    }
                });
            }
        }

        return this;
    },

    matchPlayer: function (matchTag, switchImmediately)
    {
        if (matchTag === undefined) { matchTag = null; }
        if (switchImmediately === undefined) { switchImmediately = false; }

        if (!this.checkAPI('matchPlayerAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.matchPlayerAsync(matchTag, switchImmediately).then(function ()
        {
            console.log('match player');

            _this.getID();
            _this.getType();

            _this.emit('matchplayer', _this.contextID, _this.contextType);
        });

        return this;
    },

    //  TODO: checkCanPlayerMatchAsync ?

    getLeaderboard: function (name)
    {
        if (!this.checkAPI('getLeaderboardAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.getLeaderboardAsync(name).then(function (data)
        {
            console.log('leaderboard');
            console.log(data);

            var leaderboard = new Leaderboard(_this, data);

            _this.leaderboards[name] = leaderboard;

            _this.emit('getleaderboard', leaderboard);
        }).catch(function (e)
        {
            console.warn(e);
        });

        return this;
    },

    /**
     * Destroys the FacebookInstantGamesPlugin.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#destroy
     * @since 3.12.0
     */
    destroy: function ()
    {
        FBInstant.quit();

        this.game = null;
    }

});

module.exports = FacebookInstantGamesPlugin;
