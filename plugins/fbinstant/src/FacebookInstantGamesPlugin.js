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
 * [description]
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
         * @since 3.12.0
         */
        this.game = game;

        this.data = new DataManager(this);

        this.on('setdata', this.setDataHandler, this);
        this.on('changedata', this.changeDataHandler, this);

        this.hasLoaded = false;
        this.dataLocked = false;

        this.supportedAPIs = [];

        this.entryPoint = '';
        this.entryPointData = null;
        this.contextID = null;

        // POST - A facebook post.
        // THREAD - A messenger thread.
        // GROUP - A facebook group.
        // SOLO - Default context, where the player is the only participant.
        this.contextType = null;
        this.locale = null;
        this.platform = null;
        this.version = null;

        this.playerID = null;
        this.playerName = null;
        this.playerPhotoURL = null;
        this.playerCanSubscribeBot = false;

        this.paymentsReady = false;
        this.catalog = [];
        this.purchases = [];
        this.leaderboards = {};
        this.ads = [];
    },

    setDataHandler: function (parent, key, value)
    {
        if (this.dataLocked)
        {
            return;
        }

        console.log('set data:', key, value);

        var data = {};
        data[key] = value;

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function ()
        {
            console.log('sdh saved', data);

            _this.emit('savedata', data);
        });
    },

    changeDataHandler: function (parent, key, value)
    {
        if (this.dataLocked)
        {
            return;
        }

        console.log('change data:', key, value);

        var data = {};
        data[key] = value;

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function ()
        {
            console.log('cdh saved', data);

            _this.emit('savedata', data);
        });
    },

    showLoadProgress: function (scene)
    {
        scene.load.on('progress', function (value)
        {

            if (!this.hasLoaded)
            {
                console.log(value);

                FBInstant.setLoadingProgress(value * 100);
            }

        }, this);

        scene.load.on('complete', function ()
        {

            this.hasLoaded = true;

            console.log('loaded');

            FBInstant.startGameAsync().then(this.gameStarted.bind(this));
            
        }, this);

        return this;
    },

    gameStarted: function ()
    {
        console.log('FBP gameStarted');
        
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

        console.log(this.supportedAPIs);

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
                console.log('payments ready');
    
                _this.paymentsReady = true;
            }).catch(function (e)
            {
                console.warn(e);
            });
        }
    },

    checkAPI: function (api)
    {
        if (!this.supportedAPIs[api])
        {
            console.warn(api + ' not supported');

            return false;
        }
        else
        {
            return true;
        }
    },

    getID: function ()
    {
        if (!this.contextID && this.supportedAPIs.contextGetID)
        {
            this.contextID = FBInstant.context.getID();
        }

        return this.contextID;
    },

    getType: function ()
    {
        if (!this.contextType && this.supportedAPIs.contextGetType)
        {
            this.contextType = FBInstant.context.getType();
        }

        return this.contextType;
    },

    getLocale: function ()
    {
        if (!this.locale && this.supportedAPIs.getLocale)
        {
            this.locale = FBInstant.getLocale();
        }

        return this.locale;
    },

    getPlatform: function ()
    {
        if (!this.platform && this.supportedAPIs.getPlatform)
        {
            this.platform = FBInstant.getPlatform();
        }

        return this.platform;
    },

    getSDKVersion: function ()
    {
        if (!this.version && this.supportedAPIs.getSDKVersion)
        {
            this.version = FBInstant.getSDKVersion();
        }

        return this.version;
    },

    getPlayerID: function ()
    {
        if (!this.playerID && this.supportedAPIs.playerGetID)
        {
            this.playerID = FBInstant.player.getID();
        }

        return this.playerID;
    },

    getPlayerName: function ()
    {
        if (!this.playerName && this.supportedAPIs.playerGetName)
        {
            this.playerName = FBInstant.player.getName();
        }

        return this.playerName;
    },

    getPlayerPhotoURL: function ()
    {
        if (!this.playerPhotoURL && this.supportedAPIs.playerGetPhoto)
        {
            this.playerPhotoURL = FBInstant.player.getPhoto();
        }

        return this.playerPhotoURL;
    },

    loadPlayerPhoto: function (scene, key)
    {
        if (this.playerPhotoURL)
        {
            console.log('load');

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

    canSubscribeBot: function ()
    {
        if (this.supportedAPIs.playerCanSubscribeBotAsync)
        {
            var _this = this;

            FBInstant.player.canSubscribeBotAsync().then(function ()
            {
                _this.playerCanSubscribeBot = true;

                _this.emit('cansubscribebot');
            });
        }

        return this;
    },

    subscribeBot: function ()
    {
        if (this.playerCanSubscribeBot)
        {
            var _this = this;

            FBInstant.player.subscribeBotAsync().then(function ()
            {
                _this.emit('subscribebot');
            }).catch(function ()
            {
                _this.emit('subscribebotfailed');
            });
        }

        return this;
    },

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

        console.log('getdata', keys);

        var _this = this;

        FBInstant.player.getDataAsync(keys).then(function (data)
        {
            console.log('getdata req', data);

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

    saveData: function (data)
    {
        if (!this.checkAPI('playerSetDataAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function ()
        {
            console.log('data saved to fb');

            _this.emit('savedata', data);
        });

        return this;
    },

    flushData: function ()
    {
        if (!this.checkAPI('playerFlushDataAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.player.flushDataAsync().then(function ()
        {
            console.log('data flushed');

            _this.emit('flushdata');
        });

        return this;
    },

    getStats: function (keys)
    {
        if (!this.checkAPI('playerGetStatsAsync'))
        {
            return this;
        }

        var _this = this;

        FBInstant.player.getStatsAsync(keys).then(function (data)
        {
            console.log('stats got from fb');

            _this.emit('getstats', data);
        });

        return this;
    },

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
            console.log('stats saved to fb');
            _this.emit('savestats', output);
        });

        return this;
    },

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
            console.log('stats modified');

            _this.emit('incstats', stats);
        });

        return this;
    },

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

    openShare: function (text, key, frame, sessionData)
    {
        return this._share('SHARE', text, key, frame, sessionData);
    },

    openInvite: function (text, key, frame, sessionData)
    {
        return this._share('INVITE', text, key, frame, sessionData);
    },

    openRequest: function (text, key, frame, sessionData)
    {
        return this._share('REQUEST', text, key, frame, sessionData);
    },

    openChallenge: function (text, key, frame, sessionData)
    {
        return this._share('CHALLENGE', text, key, frame, sessionData);
    },

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

        var payload = {
            intent: intent,
            image: imageData,
            text: text,
            data: sessionData
        };

        // console.log(payload);

        // intent ("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") Indicates the intent of the share.
        // image string A base64 encoded image to be shared.
        // text string A text message to be shared.
        // data Object? A blob of data to attach to the share. All game sessions launched from the share will be able to access this blob through FBInstant.getEntryPointData().

        var _this = this;

        FBInstant.shareAsync(payload).then(function ()
        {
            _this.emit('resume');
        });

        return this;
    },

    isSizeBetween: function (min, max)
    {
        if (!this.checkAPI('contextIsSizeBetween'))
        {
            return this;
        }

        return FBInstant.context.isSizeBetween(min, max);
    },

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
            });
        }

        return this;
    },

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
