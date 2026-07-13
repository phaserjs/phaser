/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var GetFastValue = require('../../../src/utils/object/GetFastValue');
var ImageFile = require('../../../src/loader/filetypes/ImageFile.js');
var IsPlainObject = require('../../../src/utils/object/IsPlainObject');
var JSONFile = require('../../../src/loader/filetypes/JSONFile.js');
var MultiFile = require('../../../src/loader/MultiFile.js');
var TextFile = require('../../../src/loader/filetypes/TextFile.js');

/**
 * @typedef {object} Phaser.Loader.FileTypes.SpineFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string|string[]} [jsonURL] - The absolute or relative URL to load the JSON file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @property {string} [atlasURL] - The absolute or relative URL to load the texture atlas data file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @property {boolean} [preMultipliedAlpha=false] - Do the textures contain pre-multiplied alpha or not?
 * @property {XHRSettingsObject} [jsonXhrSettings] - An XHR Settings configuration object for the json file. Used in replacement of the Loaders default XHR Settings.
 * @property {XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas data file. Used in replacement of the Loaders default XHR Settings.
 */

/**
 * @classdesc
 * A Spine File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#spine method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#spine.
 *
 * @class SpineFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.SpineFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [jsonURL] - The absolute or relative URL to load the JSON file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {string} [atlasURL] - The absolute or relative URL to load the texture atlas data file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @param {boolean} [preMultipliedAlpha=false] - Do the textures contain pre-multiplied alpha or not?
 * @param {XHRSettingsObject} [jsonXhrSettings] - An XHR Settings configuration object for the json file. Used in replacement of the Loaders default XHR Settings.
 * @param {XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas data file. Used in replacement of the Loaders default XHR Settings.
 */
var SpineFile = new Class({

    Extends: MultiFile,

    initialize:

    function SpineFile (loader, key, jsonURL, atlasURL, preMultipliedAlpha, jsonXhrSettings, atlasXhrSettings)
    {
        var i;
        var json;
        var atlas;
        var files = [];
        var cache = loader.cacheManager.custom.spine;

        //  atlas can be an array of atlas files, not just a single one

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');

            json = new JSONFile(loader, {
                key: key,
                url: GetFastValue(config, 'jsonURL'),
                extension: GetFastValue(config, 'jsonExtension', 'json'),
                xhrSettings: GetFastValue(config, 'jsonXhrSettings')
            });

            atlasURL = GetFastValue(config, 'atlasURL');
            preMultipliedAlpha = GetFastValue(config, 'preMultipliedAlpha');

            if (!Array.isArray(atlasURL))
            {
                atlasURL = [ atlasURL ];
            }

            for (i = 0; i < atlasURL.length; i++)
            {
                atlas = new TextFile(loader, {
                    key: key + '!' + i,
                    url: atlasURL[i],
                    extension: GetFastValue(config, 'atlasExtension', 'atlas'),
                    xhrSettings: GetFastValue(config, 'atlasXhrSettings')
                });

                atlas.cache = cache;

                files.push(atlas);
            }
        }
        else
        {
            json = new JSONFile(loader, key, jsonURL, jsonXhrSettings);

            if (!Array.isArray(atlasURL))
            {
                atlasURL = [ atlasURL ];
            }

            for (i = 0; i < atlasURL.length; i++)
            {
                atlas = new TextFile(loader, key + '!' + i, atlasURL[i], atlasXhrSettings);
                atlas.cache = cache;

                files.push(atlas);
            }
        }

        files.unshift(json);

        MultiFile.call(this, loader, 'spine', key, files);

        this.config.preMultipliedAlpha = preMultipliedAlpha;
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.FileTypes.SpineFile#onFileComplete
     * @since 3.19.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;

            if (file.type === 'text')
            {
                //  Inspect the data for the files to now load
                var content = file.data.split('\n');

                //  Extract the textures
                var textures = [ content[0] ];

                for (var t = 0; t < content.length; t++)
                {
                    var line = content[t];

                    if (line.trim() === '' && t < content.length - 1)
                    {
                        line = content[t + 1];

                        textures.push(line);
                    }
                }

                var config = this.config;
                var loader = this.loader;

                var currentBaseURL = loader.baseURL;
                var currentPath = loader.path;
                var currentPrefix = loader.prefix;

                var baseURL = GetFastValue(config, 'baseURL', this.baseURL);
                var path = GetFastValue(config, 'path', file.src.match(/^.*\//))[0];
                var prefix = GetFastValue(config, 'prefix', this.prefix);
                var textureXhrSettings = GetFastValue(config, 'textureXhrSettings');

                loader.setBaseURL(baseURL);
                loader.setPath(path);
                loader.setPrefix(prefix);

                // 手機記憶體防護: 由伺服器端 CDN 縮放過大的 spine 頁面
                // 這是唯一能完全避開全解析度解碼的路徑, 因此可修正所有 iOS 版本載入時的閃退
                var memGuard = SpineFile.prototype._getSpineMemoryGuardConfig();
                var cdnResize = !!(memGuard && memGuard.cdnResize);
                var guardMax = memGuard ? (memGuard.maxTextureSize || 1024) : 0;
                var pageSizes = cdnResize
                    ? SpineFile.prototype._parseSpineAtlasPageSizes(file.data)
                    : {};

                for (var i = 0; i < textures.length; i++)
                {
                    var pageName = textures[i];

                    var key = pageName;
                    var loadURL = pageName;
                    var cacheBustQS = GetFastValue(config, 'cacheBustQS', '');
                    if (cacheBustQS)
                    {
                        var qsSep = loadURL.indexOf('?') !== -1 ? '&' : '?';
                        loadURL = loadURL + qsSep + cacheBustQS;
                    }

                    var usedCdn = false;
                    if (cdnResize && guardMax > 0 && pageSizes[pageName])
                    {
                        var d = pageSizes[pageName];
                        var longest = Math.max(d.w, d.h);
                        if (longest > guardMax)
                        {
                            var reqW = Math.max(1, Math.round((d.w * guardMax) / longest));

                            // path 通常已是 atlas 的絕對目錄, 只有在不是時才補上 baseURL
                            var absURL = /^https?:\/\//.test(path)
                                ? path + loadURL
                                : (baseURL || '') + (path || '') + loadURL;
                            var mm = /^(https?:\/\/[^/]+\/)(.*)$/.exec(absURL);
                            if (mm)
                            {
                                var q = memGuard.cdnResizeQuality || 100;
                                loadURL = mm[1] + 'cdn-cgi/image/width=' + reqW + ',quality=' + q + ',fit=scale-down/' + mm[2];
                                usedCdn = true;
                                if (memGuard.debug)
                                {
                                    SpineFile.prototype._spineGuardLog('cdn ' + pageName + ' ' + d.w + 'x' + d.h + ' -> w' + reqW);
                                }
                            }
                        }
                    }

                    // 危險紀錄: 防護開啟時仍以原始尺寸載入的頁面
                    // (cdnResize 關閉, URL 無法改寫, 或尺寸未知)
                    if (memGuard && memGuard.debug && !usedCdn)
                    {
                        var pd = pageSizes[pageName];
                        var full = pd ? pd.w + 'x' + pd.h : '?';
                        if (!pd || Math.max(pd.w, pd.h) > guardMax)
                        {
                            SpineFile.prototype._spineGuardLog('FULL ' + pageName + ' ' + full);
                        }
                    }

                    var image = new ImageFile(loader, key, loadURL, textureXhrSettings);

                    // 經 CDN 縮放的頁面大多仍是預乘 alpha, 但透明區域 RGB 會變白
                    // (Cloudflare 縮放時做了反預乘), 標記它們讓 addToCache 將 RGB 夾到 <= alpha
                    // 否則白色會滲入輪廓邊緣形成白邊
                    image._geFixAlpha = usedCdn;

                    if (!loader.keyExists(image))
                    {
                        this.addToMultiFile(image);

                        loader.addFile(image);
                    }
                }

                //  Reset the loader settings
                loader.setBaseURL(currentBaseURL);
                loader.setPath(currentPath);
                loader.setPrefix(currentPrefix);
            }
        }
    },

    // ========================================================================
    // Spine 手機記憶體防護 輔助函式
    // ========================================================================

    /**
     * 回傳 spine 記憶體防護設定, 若停用則回傳 null
     * 設定來源為 window.__GE_RENDER_SPINE_MEMORY_GUARD__
     *
     * @returns {?object} { enabled, maxTextureSize }
     */
    _getSpineMemoryGuardConfig: function ()
    {
        var config = window.__GE_RENDER_SPINE_MEMORY_GUARD__;
        if (!config || !config.enabled)
        {
            return null;
        }
        return config;
    },

    /**
     * 寫入一筆紀錄到 localStorage, 讓畫面上的除錯 HUD 在 iOS 閃退並重新載入後
     * 仍能顯示發生過的事 (不需要 console)
     */
    _spineGuardLog: function (entry)
    {
        try
        {
            var K = '__GE_SPINE_GUARD_LOG__';
            var arr = JSON.parse(window.localStorage.getItem(K) || '[]');
            arr.push(entry);
            while (arr.length > 100)
            {
                arr.shift();
            }
            window.localStorage.setItem(K, JSON.stringify(arr));
        }
        catch (e)
        {
            // localStorage 無法使用或超出配額, 略過
        }
    },

    /**
     * 將 HTMLImageElement 縮小到 maxSize 以內, 作為 CDN 縮放的安全網 (必要)
     * CDN 縮放偶爾會漏掉某些頁面而回傳原尺寸影像, 這時用它縮小避免整張大圖上傳 GPU
     * 回傳 { image: Canvas|HTMLImageElement, scale: number }
     *
     * @param {HTMLImageElement} image - 來源影像
     * @param {number} maxSize - 最長邊上限 (寬或高)
     * @returns {{ image: (HTMLCanvasElement|HTMLImageElement), scale: number, wasDownscaled: boolean }}
     */
    _downscaleSpineImage: function (image, maxSize)
    {
        var w = image.naturalWidth || image.width;
        var h = image.naturalHeight || image.height;

        if (w <= maxSize && h <= maxSize)
        {
            return { image: image, scale: 1, wasDownscaled: false };
        }

        var ratio = Math.min(maxSize / w, maxSize / h);
        var targetW = Math.max(1, Math.round(w * ratio));
        var targetH = Math.max(1, Math.round(h * ratio));

        // 逐步減半並使用高品質平滑, 單次大幅 drawImage (例如 4096 -> 1024)
        // 會嚴重鋸齒或模糊, 反覆減半直到接近目標 2 倍以內能保持邊緣乾淨
        var src = image;
        var curW = w;
        var curH = h;
        while (curW > targetW * 2 || curH > targetH * 2)
        {
            var halfW = Math.max(targetW, Math.floor(curW / 2));
            var halfH = Math.max(targetH, Math.floor(curH / 2));
            var stepCanvas = document.createElement('canvas');
            stepCanvas.width = halfW;
            stepCanvas.height = halfH;
            var stepCtx = stepCanvas.getContext('2d');
            stepCtx.imageSmoothingEnabled = true;
            stepCtx.imageSmoothingQuality = 'high';
            stepCtx.drawImage(src, 0, 0, halfW, halfH);
            src = stepCanvas;
            curW = halfW;
            curH = halfH;
        }

        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(src, 0, 0, targetW, targetH);

        return { image: canvas, scale: ratio, wasDownscaled: true };
    },

    /**
     * 修正縮放後 spine 頁面的預乘 alpha 白邊
     *
     * 來源圖集是預乘 alpha (RGB <= alpha, 透明處為黑)
     * Cloudflare 影像縮放 (以及一般的 canvas drawImage) 會以直通 alpha 縮放
     * 使透明像素帶有白色 RGB, 少數邊緣像素 RGB > alpha
     * 以預乘混色上傳後, 白色會滲入輪廓邊緣成為淡淡的白邊
     * 將每個通道夾到 <= alpha, 對已經預乘的多數像素沒有影響
     * 可清掉透明處的白色, 並把少數過亮的邊緣拉回範圍, 不會造成二次變暗
     *
     * @param {(HTMLImageElement|HTMLCanvasElement)} image
     * @returns {(HTMLCanvasElement|*)} 夾過像素的 canvas (發生錯誤時回傳原輸入)
     */
    _fixSpinePremultipliedAlpha: function (image)
    {
        try
        {
            var w = image.naturalWidth || image.width;
            var h = image.naturalHeight || image.height;
            if (!w || !h)
            {
                return image;
            }
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(image, 0, 0);
            var imgData = ctx.getImageData(0, 0, w, h);
            var d = imgData.data;
            for (var i = 0; i < d.length; i += 4)
            {
                var a = d[i + 3];
                if (d[i] > a)
                {
                    d[i] = a;
                }
                if (d[i + 1] > a)
                {
                    d[i + 1] = a;
                }
                if (d[i + 2] > a)
                {
                    d[i + 2] = a;
                }
            }
            ctx.putImageData(imgData, 0, 0);
            return canvas;
        }
        catch (e)
        {
            return image;
        }
    },

    /**
     * 從圖集解析每一頁的尺寸, 同時支援精簡的 4.1/4.2 格式 (無縮排, size:W,H)
     * 與舊版有縮排的格式
     *
     * @param {string} atlasText - 原始圖集文字
     * @returns {object} pageName -> { w, h } 的對照表
     */
    _parseSpineAtlasPageSizes: function (atlasText)
    {
        var lines = atlasText.split('\n');
        var sizes = {};
        var cur = null;
        var expecting = true;
        var IMG = /\.(png|webp|jpg|jpeg)$/i;
        for (var i = 0; i < lines.length; i++)
        {
            var raw = lines[i];
            var t = raw.trim();
            var indented = /^\s/.test(raw);
            if (t === '')
            {
                cur = null;
                expecting = true;
                continue;
            }
            if (!indented && (expecting || cur === null) && IMG.test(t))
            {
                cur = t;
                expecting = false;
                continue;
            }
            expecting = false;
            if (cur && /^size\s*:/i.test(t) && !sizes[cur])
            {
                var parts = t.substring(t.indexOf(':') + 1).split(',');
                var w = parseInt(parts[0], 10);
                var h = parseInt(parts[1], 10);
                if (!isNaN(w) && !isNaN(h))
                {
                    sizes[cur] = { w: w, h: h };
                }
            }
        }
        return sizes;
    },

    /**
     * 將圖集座標改寫成實際載入 (已縮小) 的貼圖尺寸
     * 每一頁讀取原本的 size: 行, 依實際載入尺寸算出各軸的精確縮放比例
     * 再縮放每一條座標行 (精簡 4.1/4.2 用 bounds/offsets, 舊版用 xy/size/orig/offset)
     * 以影像檔名判斷頁面, 因此在區塊名稱位於第 0 欄的精簡格式下也能運作
     *
     * @param {string} atlasData - 原始圖集文字
     * @param {object} actualDims - pageName -> { w, h } 實際載入尺寸的對照表
     * @returns {{ data: string, valid: boolean }}
     */
    _scaleSpineAtlasData: function (atlasData, actualDims)
    {
        var lines = atlasData.split('\n');
        var result = [];
        var IMG = /\.(png|webp|jpg|jpeg)$/i;
        var dim = null;
        var sx = 1;
        var sy = 1;
        var seenPageSize = false;
        var expecting = true;

        var lookup = function (page)
        {
            if (actualDims[page])
            {
                return actualDims[page];
            }
            for (var k in actualDims)
            {
                if (actualDims.hasOwnProperty(k) && k.endsWith(page))
                {
                    return actualDims[k];
                }
            }
            return null;
        };
        var scaleCoord = function (line, keys)
        {
            var m = line.match(/^(\s*)([A-Za-z]+)\s*:\s*(.+)$/);
            if (!m || keys.indexOf(m[2].toLowerCase()) === -1)
            {
                return null;
            }
            var vals = m[3].split(',').map(function (v, idx)
            {
                var n = parseInt(v.trim(), 10);
                if (isNaN(n))
                {
                    return v.trim();
                }
                return String(Math.round(n * (idx % 2 === 0 ? sx : sy)));
            });
            return m[1] + m[2] + ':' + vals.join(',');
        };

        for (var i = 0; i < lines.length; i++)
        {
            var raw = lines[i];
            var t = raw.trim();
            var indented = /^\s/.test(raw);

            if (t === '')
            {
                result.push(raw);
                dim = null;
                sx = 1;
                sy = 1;
                seenPageSize = false;
                expecting = true;
                continue;
            }
            if (!indented && (expecting || dim === null) && IMG.test(t))
            {
                dim = lookup(t);
                sx = 1;
                sy = 1;
                seenPageSize = false;
                expecting = false;
                result.push(raw);
                continue;
            }
            expecting = false;

            if (!seenPageSize && /^size\s*:/i.test(t))
            {
                seenPageSize = true;
                var parts = t.substring(t.indexOf(':') + 1).split(',');
                var ow = parseInt(parts[0], 10);
                var oh = parseInt(parts[1], 10);
                if (dim && !isNaN(ow) && !isNaN(oh) && ow > 0 && oh > 0)
                {
                    sx = dim.w / ow;
                    sy = dim.h / oh;
                    var im = raw.match(/^(\s*)/);
                    result.push(im[1] + 'size:' + dim.w + ',' + dim.h);
                    continue;
                }
                result.push(raw);
                continue;
            }

            if (sx !== 1 || sy !== 1)
            {
                var scaled = scaleCoord(raw, [ 'bounds', 'offsets' ]) ||
                    scaleCoord(raw, [ 'xy', 'size', 'orig', 'offset' ]);
                if (scaled !== null)
                {
                    result.push(scaled);
                    continue;
                }
            }
            result.push(raw);
        }

        return { data: result.join('\n'), valid: true };
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.SpineFile#addToCache
     * @since 3.19.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var fileJSON = this.files[0];

            fileJSON.addToCache();

            var atlasCache;
            var atlasKey = '';
            var combinedAtlasData = '';
            var preMultipliedAlpha = (this.config.preMultipliedAlpha) ? true : false;
            var textureManager = this.loader.textureManager;

            // 手機記憶體防護: (安全網) 縮小過大的貼圖並把圖集座標改寫成實際載入的尺寸
            var memGuard = SpineFile.prototype._getSpineMemoryGuardConfig();
            var maxTextureSize = memGuard ? (memGuard.maxTextureSize || 1024) : 0;
            var actualDims = {}; // pageName -> { w, h } 實際上傳的尺寸

            for (var i = 1; i < this.files.length; i++)
            {
                var file = this.files[i];

                if (file.type === 'text')
                {
                    atlasKey = file.key.replace(/![\d]$/, '');

                    atlasCache = file.cache;

                    combinedAtlasData = combinedAtlasData.concat(file.data);
                }
                else
                {
                    var src = file.key.trim();
                    var pos = src.indexOf('!');
                    var key = src.substr(pos + 1);

                    if (!textureManager.exists(key))
                    {
                        var imageSource = file.data;

                        // 經 CDN 縮放 (或下方 canvas 安全網縮小) 的頁面, 透明像素帶有白色 RGB
                        // 將 RGB 夾到 <= alpha 以消除白邊
                        var needsFix = !!file._geFixAlpha;

                        // canvas 安全網 (必要): CDN 縮放偶爾會漏掉某些頁面, 讓它以原尺寸下載
                        // 這時必須把它縮到 maxTextureSize 再上傳, 否則整張大圖上 GPU 會讓 iOS 閃退
                        if (memGuard && maxTextureSize > 0)
                        {
                            var iw0 = imageSource.naturalWidth || imageSource.width || 0;
                            var ih0 = imageSource.naturalHeight || imageSource.height || 0;
                            if (iw0 > maxTextureSize || ih0 > maxTextureSize)
                            {
                                // 一律記錄 (即使 debug 關閉), 代表 CDN 縮放漏掉了這一頁
                                SpineFile.prototype._spineGuardLog('FALLBACK ' + key + ' ' + iw0 + 'x' + ih0);
                                var downscaled = SpineFile.prototype._downscaleSpineImage(imageSource, maxTextureSize);
                                imageSource = downscaled.image;
                                needsFix = true;
                            }
                        }

                        if (needsFix && imageSource)
                        {
                            imageSource = SpineFile.prototype._fixSpinePremultipliedAlpha(imageSource);
                        }

                        if (memGuard)
                        {
                            actualDims[key] = {
                                w: imageSource.naturalWidth || imageSource.width,
                                h: imageSource.naturalHeight || imageSource.height
                            };
                        }

                        textureManager.addImage(key, imageSource);
                    }

                    // 記憶體修正: 盡早把 file.data 設為 null 以釋放已解碼的影像
                    file.data = null;
                }

                file.pendingDestroy();
            }

            // 除錯紀錄: 每一頁最後上傳的尺寸 (閃退後仍可查看)
            if (memGuard && memGuard.debug)
            {
                var dimsStr = [];
                for (var dk in actualDims)
                {
                    if (actualDims.hasOwnProperty(dk))
                    {
                        dimsStr.push(actualDims[dk].w + 'x' + actualDims[dk].h);
                    }
                }
                var spineName = String(atlasKey).split('/').pop();
                SpineFile.prototype._spineGuardLog('OK ' + spineName + ' [' + dimsStr.join(' ') + ']');
            }

            // 將圖集座標改寫成實際 (已縮小) 的尺寸
            if (memGuard && Object.keys(actualDims).length > 0)
            {
                var atlasScaleResult = SpineFile.prototype._scaleSpineAtlasData(combinedAtlasData, actualDims);
                if (atlasScaleResult.valid)
                {
                    combinedAtlasData = atlasScaleResult.data;
                }
            }

            atlasCache.add(atlasKey, { preMultipliedAlpha: preMultipliedAlpha, data: combinedAtlasData, prefix: this.prefix });

            this.complete = true;
        }
    }

});

module.exports = SpineFile;
