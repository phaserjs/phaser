// import XHRLoader from 'loader/XHRLoader.js';
// import XHRSettings from 'loader/XHRSettings.js';



//  Our base File object (from which all File Types extend)

//  key = user level file key (can be filename or other string based value)
//  url = the URL to load the file from, doesn't include baseURL or Path (which are both set by the Loader)
//  type = a user-level value that can control which cache the file is added to

var File = function (key, url, type)
{
    if (!key)
    {
        console.warn('Invalid File key');
        return;
    }

    return {

        key: key,

        url: url,

        //  Both of these are overridden by the BaseLoader (if being used)
        path: '',
        src: url,

        tag: '',    // Tag this file, this is a non-unique string. For example you could tag a collection of files as 'level1', or 'mainmenu'.

        type: type, // the file type, i.e. 'image', 'json', etc which can be used to control which cache it gets added to

        state: PENDING,

        //  Multipart file? (i.e. an atlas and its json)
        multipart: undefined,
        linkFile: undefined,

        //  The actual processed file data
        data: undefined,

        //  For CORs based loading.
        //  If this is undefined then the File will check BaseLoader.crossOrigin and use that (if set)
        crossOrigin: undefined,

        //  Optionally set by the Promise returned from BaseLoader.addFile.
        resolve: undefined,
        reject: undefined,

        //  maybe you have to set it in the Promise?
        processCallback: undefined,

        //  xhr specific settings (ignored by TagLoaded files)
        xhr: XHRSettings('text'),

        onStateChange: function (value) {

            // console.log('onStateChange', this.url, 'from', this.state, 'to', value);

            if (this.state !== value)
            {
                this.state = value;

                //  Loaded AND Processed
                if (value === COMPLETE)
                {
                    //  Part of a multipart load?
                    if (this.multipart)
                    {
                        //  Has the linked file loaded too?
                        if (this.linkFile.state === COMPLETE && this.multipart.resolve)
                        {
                            //  Send the Promise for the multipart file
                            this.multipart.resolve(this.multipart);
                        }
                    }

                    //  Send the Promise for this file
                    if (this.resolve)
                    {
                        this.resolve(this);
                    }
                }
                else if (value === FAILED)
                {
                    //  Part of a multipart load?
                    if (this.multipart)
                    {
                        if (this.multipart.reject)
                        {
                            //  Send the Promise for the multipart file
                            this.multipart.reject(this.multipart, error);
                        }
                    }

                    //  Send the Promise for this file
                    if (this.reject)
                    {
                        this.reject(this);
                    }
                }
            }

        },

        //  These functions are usually overridden by the custom file types

        load: function (globalXHRSettings) {

            this.onStateChange(LOADING);

            //  Returns a Promise from the XHRLoader
            return XHRLoader(this, globalXHRSettings);

        },

        onLoad: function () {

            //  If overridden it must set `state` to LOADED
            this.onStateChange(LOADED);

        },

        onError: function () {

            //  If overridden it must set `state` to FAILED
            this.onStateChange(FAILED);

        },

        onProcess: function () {

            //  If overridden it must set `state` to PROCESSING
            this.onStateChange(PROCESSING);

        },

        onComplete: function () {

            //  If overridden it must set `state` to COMPLETE
            this.onStateChange(COMPLETE);

        },

        onDestroy: function () {

            //  If overridden it must set `state` to DESTROYED
            this.onStateChange(DESTROYED);

        }

    };

};

module.exports = File;
