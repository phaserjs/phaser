interface Navigator {
    webkitVibrate(pattern: number | number[]): boolean;
    mozVibrate(pattern: number | number[]): boolean;
    msVibrate(pattern: number | number[]): boolean;
    standalone: boolean;
    isCocoonJS: boolean;
}
interface NavigatorUserMedia {
    webkitGetUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;
    mozGetUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;
    msGetUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;
    GetUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;
}
interface HTMLCanvasElement {
    screencanvas: boolean;
}
interface Window {
    webkitURL: typeof URL;
    mozURL: typeof URL;
    msURL: typeof URL;
    cordova: any;
    ejecta: any;
}
interface CSSStyleDeclaration {
    msInterpolationMode: 'bicubic' | 'nearest-neighbor';
}
