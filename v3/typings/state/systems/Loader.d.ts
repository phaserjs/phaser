import BaseLoader from '../../loader/BaseLoader';
export default class Loader extends BaseLoader {
    protected _multilist: any;
    private state;
    constructor(state: any);
    image(key: any, url: any, xhrSettings: any): -1 | this;
    json(key: any, url: any, xhrSettings: any): -1 | this;
    xml(key: any, url: any, xhrSettings: any): -1 | this;
    binary(key: any, url: any, xhrSettings: any): -1 | this;
    text(key: any, url: any, xhrSettings: any): -1 | this;
    glsl(key: any, url: any, xhrSettings: any): -1 | this;
    atlas(key: any, textureURL: any, atlasURL: any, textureXhrSettings?: any, atlasXhrSettings?: any): this;
    multiatlas(key: any, textureURLs: any, atlasURLs: any, textureXhrSettings: any, atlasXhrSettings: any): void;
    processCallback(): void;
}
