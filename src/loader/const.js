var FILE_CONST = {

    LOADER_IDLE: 0,
    LOADER_LOADING: 1,
    LOADER_PROCESSING: 2,
    LOADER_COMPLETE: 3,
    LOADER_SHUTDOWN: 4,
    LOADER_DESTROYED: 5,

    //  File is in the load queue but not yet started
    FILE_PENDING: 10,

    //  File has been started to load by the loader (onLoad called)
    FILE_LOADING: 11,

    //  File has loaded successfully, awaiting processing    
    FILE_LOADED: 12,

    //  File failed to load
    FILE_FAILED: 13,

    //  File is being processed (onProcess callback)
    FILE_PROCESSING: 14,

    //  File is being processed (onProcess callback)
    FILE_WAITING_LINKFILE: 15,

    //  File is being processed (onProcess callback)
    FILE_ERRORED: 16,

    //  File has finished processing
    FILE_COMPLETE: 17,

    //  File has been destroyed
    FILE_DESTROYED: 18,

    //  File was populated from local data and doesn't need an HTTP request
    FILE_POPULATED: 19,

    TEXTURE_ATLAS_JSON_ARRAY: 20,
    TEXTURE_ATLAS_JSON_HASH: 21

};

module.exports = FILE_CONST;
