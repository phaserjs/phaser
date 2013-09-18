/**
* Phaser.Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides progress and completion callbacks.
*/
Phaser.Loader = function (game) {

	/**
	* Local reference to Game.
	*/
	this.game = game;

	/**
	* Array stores assets keys. So you can get that asset by its unique key.
	*/
	this._keys = [];

	/**
	* Contains all the assets file infos.
	*/
	this._fileList = {};

	/**
	* Indicates assets loading progress. (from 0 to 100)
	* @type {number}
	*/
	this._progressChunk = 0;

	/**
	* An XMLHttpRequest object used for loading text and audio data
	* @type {XMLHttpRequest}
	*/
	this._xhr = new XMLHttpRequest();

	/**
	* Length of assets queue.
	* @type {number}
	*/
	this.queueSize = 0;

	/**
	* True if the Loader is in the process of loading the queue.
	* @type {bool}
	*/
	this.isLoading = false;

	/**
	* True if all assets in the queue have finished loading.
	* @type {bool}
	*/
	this.hasLoaded = false;

	/**
	* The Load progress percentage value (from 0 to 100)
	* @type {number}
	*/
	this.progress = 0;

	/**
	* You can optionally link a sprite to the preloader.
	* If you do so the Sprite's width or height will be cropped based on the percentage loaded.
	*/
	this.preloadSprite = null;

	/**
	* The crossOrigin value applied to loaded images
	* @type {string}
	*/
	this.crossOrigin = '';

	/**
	* If you want to append a URL before the path of any asset you can set this here.
	* Useful if you need to allow an asset url to be configured outside of the game code.
	* MUST have / on the end of it!
	* @type {string}
	*/
	this.baseURL = '';

	/**
	 * Event Signals
	 */
	this.onFileComplete = new Phaser.Signal;
	this.onFileError = new Phaser.Signal;
	this.onLoadStart = new Phaser.Signal;
	this.onLoadComplete = new Phaser.Signal;

};

/**
 * TextureAtlas data format constants
 */
Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;
Phaser.Loader.TEXTURE_ATLAS_JSON_HASH = 1;
Phaser.Loader.TEXTURE_ATLAS_XML_STARLING = 2;

Phaser.Loader.prototype = {

	setPreloadSprite: function (sprite, direction) {

		direction = direction || 0;

		this.preloadSprite = { sprite: sprite, direction: direction, width: sprite.width, height: sprite.height, crop: null };

		if (direction == 0)
		{
			//	Horizontal crop
			this.preloadSprite.crop = new Phaser.Rectangle(0, 0, 0, sprite.height);
		}
		else
		{
			//	Vertical crop
			this.preloadSprite.crop = new Phaser.Rectangle(0, 0, sprite.width, 0);
		}

		sprite.crop = this.preloadSprite.crop;

	},

	/**
	* Check whether asset exists with a specific key.
	* @param key {string} Key of the asset you want to check.
	* @return {bool} Return true if exists, otherwise return false.
	*/
	checkKeyExists: function (key) {

		if (this._fileList[key])
		{
			return true;
		}
		else
		{
			return false;
		}
		
	},

	/**
	 * Reset loader, this will remove all loaded assets.
	 */
	reset: function () {

		this.preloadSprite = null;
		this.queueSize = 0;
		this.isLoading = false;

	},

	/**
	* Internal function that adds a new entry to the file list.
	*/
	addToFileList: function (type, key, url, properties) {

		var entry = {
			type: type,
			key: key,
			url: url,
			data: null,
			error: false,
			loaded: false
		};

		if (typeof properties !== "undefined")
		{
			for (var prop in properties)
			{
				entry[prop] = properties[prop];
			}
		}

		this._fileList[key] = entry;

		this._keys.push(key);

		this.queueSize++;

	},

	/**
	* Add an image to the Loader.
	* @param key {string} Unique asset key of this image file.
	* @param url {string} URL of image file.
	* @param overwrite {boolean} If an entry with a matching key already exists this will over-write it
	*/
	image: function (key, url, overwrite) {

		if (typeof overwrite === "undefined") { overwrite = false; }

		if (overwrite || this.checkKeyExists(key) == false)
		{
			this.addToFileList('image', key, url);
		}

	},

	/**
	* Add a text file to the Loader.
	* @param key {string} Unique asset key of the text file.
	* @param url {string} URL of the text file.
	*/
	text: function (key, url, overwrite) {

		if (typeof overwrite === "undefined") { overwrite = false; }

		if (overwrite || this.checkKeyExists(key) == false)
		{
			this.addToFileList('text', key, url);
		}

	},

	/**
	* Add a new sprite sheet loading request.
	* @param key {string} Unique asset key of the sheet file.
	* @param url {string} URL of sheet file.
	* @param frameWidth {number} Width of each single frame.
	* @param frameHeight {number} Height of each single frame.
	* @param frameMax {number} How many frames in this sprite sheet.
	*/
	spritesheet: function (key, url, frameWidth, frameHeight, frameMax) {

		if (typeof frameMax === "undefined") { frameMax = -1; }

		if (this.checkKeyExists(key) === false)
		{
			this.addToFileList('spritesheet', key, url, { frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax });
		}

	},

	/**
	* Add a new audio file loading request.
	* @param key {string} Unique asset key of the audio file.
	* @param urls {Array} An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ]
	* @param autoDecode {bool} When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
	*/
	audio: function (key, urls, autoDecode) {

		if (typeof autoDecode === "undefined") { autoDecode = true; }

		if (this.checkKeyExists(key) === false)
		{
			this.addToFileList('audio', key, urls, { buffer: null, autoDecode: autoDecode });
		}

	},

	/**
	* Add a new tilemap loading request.
	* @param key {string} Unique asset key of the tilemap data.
	* @param tilesetURL {string} The url of the tile set image file.
	* @param [mapDataURL] {string} The url of the map data file (csv/json)
	* @param [mapData] {object} An optional JSON data object (can be given in place of a URL).
	* @param [format] {string} The format of the map data.
	*/
	tilemap: function (key, tilesetURL, mapDataURL, mapData, format) {

		if (typeof mapDataURL === "undefined") { mapDataURL = null; }
		if (typeof mapData === "undefined") { mapData = null; }
		if (typeof format === "undefined") { format = Phaser.Tilemap.CSV; }

		if (this.checkKeyExists(key) === false)
		{
			//  A URL to a json/csv file has been given
			if (mapDataURL)
			{
				this.addToFileList('tilemap', key, tilesetURL, { mapDataURL: mapDataURL, format: format });
			}
			else
			{
				switch (format)
				{
					//  A csv string or object has been given
					case Phaser.Tilemap.CSV:
						break;

					//  An xml string or object has been given
					case Phaser.Tilemap.JSON:

						if (typeof mapData === 'string')
						{
							mapData = JSON.parse(mapData);
						}
						break;
				}

				this.addToFileList('tilemap', key, tilesetURL, { mapDataURL: null, mapData: mapData, format: format });

			}
		}

	},

	/**
	* Add a new bitmap font loading request.
	* @param key {string} Unique asset key of the bitmap font.
	* @param textureURL {string} The url of the font image file.
	* @param [xmlURL] {string} The url of the font data file (xml/fnt)
	* @param [xmlData] {object} An optional XML data object.
	*/
	bitmapFont: function (key, textureURL, xmlURL, xmlData) {

		if (typeof xmlURL === "undefined") { xmlURL = null; }
		if (typeof xmlData === "undefined") { xmlData = null; }

		if (this.checkKeyExists(key) === false)
		{
			//  A URL to a json/xml file has been given
			if (xmlURL)
			{
				this.addToFileList('bitmapfont', key, textureURL, { xmlURL: xmlURL });
			}
			else
			{
				//  An xml string or object has been given
				if (typeof xmlData === 'string')
				{
					var xml;

					try  {
						if (window['DOMParser'])
						{
							var domparser = new DOMParser();
							xml = domparser.parseFromString(xmlData, "text/xml");
						}
						else
						{
							xml = new ActiveXObject("Microsoft.XMLDOM");
							xml.async = 'false';
							xml.loadXML(xmlData);
						}
					}
					catch (e)
					{
						xml = undefined;
					}

					if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
					{
						throw new Error("Phaser.Loader. Invalid Bitmap Font XML given");
					}
					else
					{
						this.addToFileList('bitmapfont', key, textureURL, { xmlURL: null, xmlData: xml });
					}
				}
			}
		}

	},

	atlasJSONArray: function (key, textureURL, atlasURL, atlasData) {

		this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

	},

	atlasJSONHash: function (key, textureURL, atlasURL, atlasData) {

		this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

	},

	atlasXML: function (key, textureURL, atlasURL, atlasData) {

		this.atlas(key, textureURL, atlasURL, atlasData, Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);

	},

	/**
	* Add a new texture atlas loading request.
	* @param key {string} Unique asset key of the texture atlas file.
	* @param textureURL {string} The url of the texture atlas image file.
	* @param [atlasURL] {string} The url of the texture atlas data file (json/xml)
	* @param [atlasData] {object} A JSON or XML data object.
	* @param [format] {number} A value describing the format of the data.
	*/
	atlas: function (key, textureURL, atlasURL, atlasData, format) {

		if (typeof atlasURL === "undefined") { atlasURL = null; }
		if (typeof atlasData === "undefined") { atlasData = null; }
		if (typeof format === "undefined") { format = Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY; }

		if (this.checkKeyExists(key) === false)
		{
			//  A URL to a json/xml file has been given
			if (atlasURL)
			{
				this.addToFileList('textureatlas', key, textureURL, { atlasURL: atlasURL, format: format });
			}
			else
			{
				switch (format)
				{
					//  A json string or object has been given
					case Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY: 

						if (typeof atlasData === 'string')
						{
							atlasData = JSON.parse(atlasData);
						}
						break;

					//  An xml string or object has been given
					case Phaser.Loader.TEXTURE_ATLAS_XML_STARLING:

						if (typeof atlasData === 'string')
						{
							var xml;

							try  {
								if (window['DOMParser'])
								{
									var domparser = new DOMParser();
									xml = domparser.parseFromString(atlasData, "text/xml");
								}
								else
								{
									xml = new ActiveXObject("Microsoft.XMLDOM");
									xml.async = 'false';
									xml.loadXML(atlasData);
								}
							}
							catch (e)
							{
								xml = undefined;
							}

							if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
							{
								throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
							}
							else
							{
								atlasData = xml;
							}
						}
						break;
				}

				this.addToFileList('textureatlas', key, textureURL, { atlasURL: null, atlasData: atlasData, format: format });

			}

		}

	},

	/**
	 * Remove loading request of a file.
	 * @param key {string} Key of the file you want to remove.
	 */
	removeFile: function (key) {

		delete this._fileList[key];

	},

	/**
	 * Remove all file loading requests.
	 */
	removeAll: function () {

		this._fileList = {};

	},

	/**
	 * Load assets.
	 */
	start: function () {

		if (this.isLoading)
		{
			return;
		}

		this.progress = 0;
		this.hasLoaded = false;
		this.isLoading = true;

		this.onLoadStart.dispatch(this.queueSize);

		if (this._keys.length > 0)
		{
			this._progressChunk = 100 / this._keys.length;
			this.loadFile();
		}
		else
		{
			this.progress = 100;
			this.hasLoaded = true;
			this.onLoadComplete.dispatch();
		}

	},

	/**
	* Load files. Private method ONLY used by loader.
	* @private
	*/
	loadFile: function () {

		var file = this._fileList[this._keys.shift()];
		var _this = this;

		//  Image or Data?
		switch (file.type)
		{
			case 'image':
			case 'spritesheet':
			case 'textureatlas':
			case 'bitmapfont':
			case 'tilemap':
				file.data = new Image();
				file.data.name = file.key;
				file.data.onload = function () {
					return _this.fileComplete(file.key);
				};
				file.data.onerror = function () {
					return _this.fileError(file.key);
				};
				file.data.crossOrigin = this.crossOrigin;
				file.data.src = this.baseURL + file.url;
				break;

			case 'audio':
				file.url = this.getAudioURL(file.url);

				if (file.url !== null)
				{
					//  WebAudio or Audio Tag?
					if (this.game.sound.usingWebAudio)
					{
						this._xhr.open("GET", this.baseURL + file.url, true);
						this._xhr.responseType = "arraybuffer";
						this._xhr.onload = function () {
							return _this.fileComplete(file.key);
						};
						this._xhr.onerror = function () {
							return _this.fileError(file.key);
						};
						this._xhr.send();
					}
					else if (this.game.sound.usingAudioTag)
					{
						if (this.game.sound.touchLocked)
						{
							//  If audio is locked we can't do this yet, so need to queue this load request. Bum.
							file.data = new Audio();
							file.data.name = file.key;
							file.data.preload = 'auto';
							file.data.src = this.baseURL + file.url;
							this.fileComplete(file.key);
						}
						else
						{
							file.data = new Audio();
							file.data.name = file.key;
							file.data.onerror = function () {
								return _this.fileError(file.key);
							};
							file.data.preload = 'auto';
							file.data.src = this.baseURL + file.url;
							file.data.addEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete(file.key), false);
							file.data.load();
						}
					}
				}
				else
				{
					this.fileError(file.key);
				}

				break;

			case 'text':
				this._xhr.open("GET", this.baseURL + file.url, true);
				this._xhr.responseType = "text";
				this._xhr.onload = function () {
					return _this.fileComplete(file.key);
				};
				this._xhr.onerror = function () {
					return _this.fileError(file.key);
				};
				this._xhr.send();
				break;
		}

	},

	getAudioURL: function (urls) {

		var extension;

		for (var i = 0; i < urls.length; i++)
		{
			extension = urls[i].toLowerCase();
			extension = extension.substr((Math.max(0, extension.lastIndexOf(".")) || Infinity) + 1);

			if (this.game.device.canPlayAudio(extension))
			{
				return urls[i];
			}

		}

		return null;

	},

	/**
	 * Error occured when load a file.
	 * @param key {string} Key of the error loading file.
	 */
	fileError: function (key) {

		this._fileList[key].loaded = true;
		this._fileList[key].error = true;

		this.onFileError.dispatch(key);

		console.warn("Phaser.Loader error loading file: " + key);

		this.nextFile(key, false);

	},

	/**
	 * Called when a file is successfully loaded.
	 * @param key {string} Key of the successfully loaded file.
	 */
	fileComplete: function (key) {

		if (!this._fileList[key])
		{
			console.warn('Phaser.Loader fileComplete invalid key ' + key);
			return;
		}
		
		this._fileList[key].loaded = true;

		var file = this._fileList[key];
		var loadNext = true;
		var _this = this;

		switch (file.type)
		{
			case 'image':

				this.game.cache.addImage(file.key, file.url, file.data);
				break;

			case 'spritesheet':

				this.game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
				break;

			case 'tilemap':

				if (file.mapDataURL == null)
				{
					this.game.cache.addTilemap(file.key, file.url, file.data, file.mapData, file.format);
				}
				else
				{
					//  Load the JSON or CSV before carrying on with the next file
					loadNext = false;
					this._xhr.open("GET", this.baseURL + file.mapDataURL, true);
					this._xhr.responseType = "text";

					if (file.format == Phaser.Tilemap.JSON)
					{
						this._xhr.onload = function () {
							return _this.jsonLoadComplete(file.key);
						};
					}
					else if (file.format == Phaser.Tilemap.CSV)
					{
						this._xhr.onload = function () {
							return _this.csvLoadComplete(file.key);
						};
					}

					this._xhr.onerror = function () {
						return _this.dataLoadError(file.key);
					};
					this._xhr.send();
				}
				break;

			case 'textureatlas':

				if (file.atlasURL == null)
				{
					this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
				}
				else
				{
					//  Load the JSON or XML before carrying on with the next file
					loadNext = false;
					this._xhr.open("GET", this.baseURL + file.atlasURL, true);
					this._xhr.responseType = "text";

					if (file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY || file.format == Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
					{
						this._xhr.onload = function () {
							return _this.jsonLoadComplete(file.key);
						};
					}
					else if (file.format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
					{
						this._xhr.onload = function () {
							return _this.xmlLoadComplete(file.key);
						};
					}

					this._xhr.onerror = function () {
						return _this.dataLoadError(file.key);
					};
					this._xhr.send();
				}
				break;

			case 'bitmapfont':

				if (file.xmlURL == null)
				{
					this.game.cache.addBitmapFont(file.key, file.url, file.data, file.xmlData);
				}
				else
				{
					//  Load the XML before carrying on with the next file
					loadNext = false;
					this._xhr.open("GET", this.baseURL + file.xmlURL, true);
					this._xhr.responseType = "text";

					this._xhr.onload = function () {
						return _this.xmlLoadComplete(file.key);
					};

					this._xhr.onerror = function () {
						return _this.dataLoadError(file.key);
					};
					this._xhr.send();
				}
				break;

			case 'audio':

				if (this.game.sound.usingWebAudio)
				{
					file.data = this._xhr.response;

					this.game.cache.addSound(file.key, file.url, file.data, true, false);

					if (file.autoDecode)
					{
						this.game.cache.updateSound(key, 'isDecoding', true);

						var that = this;
						var key = file.key;

						this.game.sound.context.decodeAudioData(file.data, function (buffer) {
							if (buffer)
							{
								that.game.cache.decodedSound(key, buffer);
							}
						});
					}
				}
				else
				{
					file.data.removeEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete);
					this.game.cache.addSound(file.key, file.url, file.data, false, true);
				}
				break;

			case 'text':
				file.data = this._xhr.response;
				this.game.cache.addText(file.key, file.url, file.data);
				break;
		}

		if (loadNext)
		{
			this.nextFile(key, true);
		}

	},

	/**
	 * Successfully loaded a JSON file.
	 * @param key {string} Key of the loaded JSON file.
	 */
	jsonLoadComplete: function (key) {

		var data = JSON.parse(this._xhr.response);
		var file = this._fileList[key];

		if (file.type == 'tilemap')
		{
			this.game.cache.addTilemap(file.key, file.url, file.data, data, file.format);
		}
		else
		{
			this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
		}

		this.nextFile(key, true);

	},

	/**
	 * Successfully loaded a CSV file.
	 * @param key {string} Key of the loaded CSV file.
	 */
	csvLoadComplete: function (key) {

		var data = this._xhr.response;
		var file = this._fileList[key];

		this.game.cache.addTilemap(file.key, file.url, file.data, data, file.format);

		this.nextFile(key, true);

	},

	/**
	 * Error occured when load a JSON.
	 * @param key {string} Key of the error loading JSON file.
	 */
	dataLoadError: function (key) {

		var file = this._fileList[key];

		file.error = true;

		console.warn("Phaser.Loader dataLoadError: " + key);

		this.nextFile(key, true);

	},

	xmlLoadComplete: function (key) {

		var data = this._xhr.response;
		var xml;

		try
		{
			if (window['DOMParser'])
			{
				var domparser = new DOMParser();
				xml = domparser.parseFromString(data, "text/xml");
			}
			else
			{
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = 'false';
				xml.loadXML(data);
			}
		}
		catch (e)
		{
			xml = undefined;
		}

		if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
		{
			throw new Error("Phaser.Loader. Invalid XML given");
		}

		var file = this._fileList[key];

		if (file.type == 'bitmapfont')
		{
			this.game.cache.addBitmapFont(file.key, file.url, file.data, xml);
		}
		else if (file.type == 'textureatlas')
		{
			this.game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
		}

		this.nextFile(key, true);

	},

	/**
	 * Handle loading next file.
	 * @param previousKey {string} Key of previous loaded asset.
	 * @param success {bool} Whether the previous asset loaded successfully or not.
	 */
	nextFile: function (previousKey, success) {

		this.progress = Math.round(this.progress + this._progressChunk);

		if (this.progress > 100)
		{
			this.progress = 100;
		}

		if (this.preloadSprite !== null)
		{
			if (this.preloadSprite.direction == 0)
			{
				this.preloadSprite.crop.width = (this.preloadSprite.width / 100) * this.progress;
			}
			else
			{
				this.preloadSprite.crop.height = (this.preloadSprite.height / 100) * this.progress;
			}

			this.preloadSprite.sprite.crop = this.preloadSprite.crop;
		}

		this.onFileComplete.dispatch(this.progress, previousKey, success, this.queueSize - this._keys.length, this.queueSize);

		if (this._keys.length > 0)
		{
			this.loadFile();
		}
		else
		{
			this.hasLoaded = true;
			this.isLoading = false;
			
			this.removeAll();

			this.onLoadComplete.dispatch();
		}

	}

};