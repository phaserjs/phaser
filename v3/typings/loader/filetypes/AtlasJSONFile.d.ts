import ImageFile from './ImageFile';
import JSONFile from './JSONFile';
declare var AtlasJSONFile: (key: any, textureURL: any, atlasURL: any, path: any, textureXhrSettings: any, atlasXhrSettings: any) => {
    texture: ImageFile;
    data: JSONFile;
};
export default AtlasJSONFile;
