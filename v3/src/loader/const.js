var FILE_CONST = {

    PENDING: 0,      // file is in the load queue but not yet started
    LOADING: 1,      // file has been started to load by the loader (onLoad called)
    LOADED: 2,       // file has loaded successfully, awaiting processing
    FAILED: 3,       // file failed to load
    PROCESSING: 4,   // file is being processed (onProcess callback)
    COMPLETE: 5,     // file has finished processing
    DESTROYED: 6     // file has been destroyed

};

module.exports = FILE_CONST;
