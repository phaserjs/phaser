export default class File {
    type: any;
    key: any;
    url: any;
    src: any;
    xhrSettings: any;
    xhrLoader: any;
    state: any;
    bytesTotal: any;
    bytesLoaded: any;
    percentComplete: any;
    crossOrigin: any;
    data: any;
    linkFile: any;
    linkType: any;
    callback: any;
    constructor(type: any, key: any, url: any, responseType: any, xhrSettings: any);
    resetXHR(): void;
    onLoad(event: any): void;
    onError(event: any): void;
    onProgress(event: any): void;
    onProcess(callback: any): void;
    onComplete(): void;
    load(callback: any, baseURL: any, globalXHR: any): void;
}
