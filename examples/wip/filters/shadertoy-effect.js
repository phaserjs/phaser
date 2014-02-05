var vsSource = [
    "attribute vec2 pos;",
    "void main()",
    "{",
        "gl_Position = vec4(pos.x,pos.y,0.0,1.0);",
    "}"
    ].join("\n");


var fsSource = [
    "void main()",
    "{",
        "gl_FragColor = vec4(0.0,0.0,0.0,1.0);",
    "}"
    ].join("\n");

//--------------------------------------

function createGLTexture( ctx, image, format, texture )
{
    if( ctx==null ) return;

    ctx.bindTexture(   ctx.TEXTURE_2D, texture);
    ctx.pixelStorei(   ctx.UNPACK_FLIP_Y_WEBGL, false );
    ctx.texImage2D(    ctx.TEXTURE_2D, 0, format, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
    ctx.generateMipmap(ctx.TEXTURE_2D);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}

function createGLTextureLinear( ctx, image, texture )
{
    if( ctx==null ) return;

    ctx.bindTexture(  ctx.TEXTURE_2D, texture);
    ctx.pixelStorei(  ctx.UNPACK_FLIP_Y_WEBGL, false );
    ctx.texImage2D(   ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}


function createGLTextureNearestRepeat( ctx, image, texture )
{
    if( ctx==null ) return;

    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.pixelStorei( ctx.UNPACK_FLIP_Y_WEBGL, false );
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}

function createGLTextureNearest( ctx, image, texture )
{
    if( ctx==null ) return;

    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.pixelStorei( ctx.UNPACK_FLIP_Y_WEBGL, false );
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);

    ctx.bindTexture(ctx.TEXTURE_2D, null);
}

function createAudioTexture( ctx, texture )
{
    if( ctx==null ) return;

    ctx.bindTexture(   ctx.TEXTURE_2D, texture );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE) ;
    ctx.texImage2D(    ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 512, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
    ctx.bindTexture(   ctx.TEXTURE_2D, null);
}

function createKeyboardTexture( ctx, texture )
{
    if( ctx==null ) return;

    ctx.bindTexture(   ctx.TEXTURE_2D, texture );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE );
    ctx.texParameteri( ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE) ;
    ctx.texImage2D(    ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 256, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
    ctx.bindTexture(   ctx.TEXTURE_2D, null);
}


function Effect( ac, gl, xres, yres, callback, obj, forceMuted, forcePaused)
{
    this.mAudioContext = ac;
    this.mNoAudioMessageShowed = false;
    this.mGLContext = gl;
    this.mQuadVBO = null;
    this.mProgram = null;
    this.mXres = xres;
    this.mYres = yres;
    this.mInputs = new Array(4);
    this.mInputs[0] = null;
    this.mInputs[1] = null;
    this.mInputs[2] = null;
    this.mInputs[3] = null;
    this.mTextureCallbackFun = callback;
    this.mTextureCallbackObj = obj;
    this.mSource = null;
    this.mForceMuted = forceMuted;
    this.mForcePaused = forcePaused;
    this.mSupportsDerivatives = false;

    //-------------
    if( gl==null ) return;

    var ext = gl.getExtension('OES_standard_derivatives');
    this.mSupportsDerivatives = (ext != null);

    if( this.mSupportsDerivatives )
    {
        gl.hint( ext.FRAGMENT_SHADER_DERIVATIVE_HINT_OES, gl.NICEST );
    }

    var ext2 = gl.getExtension('OES_texture_float');
    this.mSupportTextureFloat = (ext2 != null );

    var vertices = new Float32Array( [ -1.0, -1.0,   1.0, -1.0,    -1.0,  1.0,     1.0, -1.0,    1.0,  1.0,    -1.0,  1.0] );

    this.mQuadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mQuadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var res = this.NewShader(fsSource);

    this.DetermineShaderPrecission();

    this.MakeHeader();
}

Effect.prototype.DestroyInput = function( id )
{
    if( this.mInputs[id]==null ) return;
    if( this.mGLContext== null ) return;

    var gl = this.mGLContext;
    if( this.mInputs[id].mInfo.mType=="texture" )
    {
        gl.deleteTexture( this.mInputs[id].globject );
    }
    else if( this.mInputs[id].mInfo.mType=="slideshow" )
    {
        gl.deleteTexture( this.mInputs[id].globject );
    }
    else if( this.mInputs[id].mInfo.mType=="webcam" )
    {
        gl.deleteTexture( this.mInputs[id].globject );
    }
    else if( this.mInputs[id].mInfo.mType=="video" )
    {
        this.mInputs[id].video.pause();
        this.mInputs[id].video = null;
        gl.deleteTexture( this.mInputs[id].globject );
    }
    else if( this.mInputs[id].mInfo.mType=="music" )
    {
        this.mInputs[id].audio.pause();
        this.mInputs[id].audio = null;
        gl.deleteTexture( this.mInputs[id].globject );
    }
    else if( this.mInputs[id].mInfo.mType=="cubemap" )
    {
        gl.deleteTexture( this.mInputs[id].globject );
    }
    else if( this.mInputs[id].mInfo.mType=="keyboard" )
    {
        gl.deleteTexture( this.mInputs[id].globject );
    }

    this.mInputs[id] = null;
}



Effect.prototype.NewTexture = function( slot, url )
{
    var me = this;
    var gl = this.mGLContext;

    var texture = null;

    if (url!=null && url.mType=="webcam" && this.mForceMuted)
    {
	    url.mType = "texture";
    }

    if( url==null )
    {
        if( me.mTextureCallbackFun!=null )
            me.mTextureCallbackFun( this.mTextureCallbackObj, slot, null, false, true, 0, -1.0 );
        return false;
    }
    else if( url.mType=="texture" )
    {
        texture = {};
        texture.mInfo = url;
        texture.globject = (gl!=null) ? gl.createTexture() : null;
        texture.loaded = false;
        texture.image = new Image();
        texture.image.crossOrigin = '';
        texture.image.onload = function()
        {
            var format = gl.RGBA;
            if( url.mSrc=="/presets/tex15.png" || url.mSrc=="/presets/tex17.png" )
                format = gl.LUMINANCE;

            if( url.mSrc=="/presets/tex14.png" )
                createGLTextureNearest( gl, texture.image, texture.globject );
            else if( url.mSrc=="/presets/tex15.png" )
                createGLTextureNearestRepeat( gl, texture.image, texture.globject );
            else
               createGLTexture( gl, texture.image, format, texture.globject );

            texture.loaded = true;
            if( me.mTextureCallbackFun!=null )
                me.mTextureCallbackFun( me.mTextureCallbackObj, slot, texture.image, true, true, 0, -1.0 );
        }
        texture.image.src = url.mSrc;
    }
    else if( url.mType=="slideshow" )
    {
        texture = {};
        texture.mInfo = url;
        texture.globject = (gl!=null) ? gl.createTexture() : null;
        texture.loaded = false;
        texture.image = new Image();
        texture.image.crossOrigin = '';
        texture.image.onload = function()
        {
            createGLTexture( gl, texture.image, gl.RGBA, texture.globject );
            texture.loaded = true;
            if( me.mTextureCallbackFun!=null )
                me.mTextureCallbackFun( me.mTextureCallbackObj, slot, texture.image, true, true, 3, -1.0 );
        }
        texture.slideshow = {};
        texture.slideshow.mCurrentSlide = 0;
        texture.slideshow.mNewTextureReady = false;
        var urlSlide = url.mSrc.replace("??","00");
        texture.image.src = urlSlide;
    }
    else if( url.mType=="cubemap" )
    {
        texture = {};
        texture.mInfo = url;
        texture.globject = (gl!=null) ? gl.createTexture() : null;
        texture.loaded = false;
        texture.image = [ new Image(), new Image(), new Image(), new Image(), new Image(), new Image() ];

        gl.bindTexture(   gl.TEXTURE_CUBE_MAP, texture.globject );
        gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
        gl.bindTexture(   gl.TEXTURE_CUBE_MAP, null );

        texture.loaded = true;

        for( var i=0; i<6; i++ )
        {
            texture.image[i].mId = i;
            texture.image[i].crossOrigin = '';
            texture.image[i].onload = function()
            {
                var id = this.mId;
                gl.bindTexture( gl.TEXTURE_CUBE_MAP, texture.globject );
                gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL,  false );
                gl.texImage2D(  gl.TEXTURE_CUBE_MAP_POSITIVE_X + id, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image[id] );
                gl.bindTexture( gl.TEXTURE_CUBE_MAP, null );
                if( me.mTextureCallbackFun!=null  )
                    me.mTextureCallbackFun( me.mTextureCallbackObj, slot, texture.image[0], true, true, 0, -1.0 );
            }

            texture.image[i].src = url.mSrc.replace( "_0.", "_" + i + "." );
        }
    }
    else if( url.mType=="webcam" )
    {
        texture = {};
        texture.mInfo = url;
        texture.globject = null;
        texture.loaded = false;

        texture.video = document.createElement('video');
    	texture.video.width = 320;
    	texture.video.height = 240;
    	texture.video.autoplay = true;
    	texture.video.loop = true;
    	texture.video.paused = true;

        navigator.getUserMedia( { "video": true, "audio": false },
                                function(stream)
                                {
                            		texture.video.src = window.URL.createObjectURL(stream);      
                            		                      		
						            texture.globject = gl.createTexture();
						            try
						            {
						            	createGLTextureLinear( gl, texture.video, texture.globject );
						            	texture.loaded = true;
                                    }
                                    catch(e)
                                    {
	                                    alert( 'Your browser can not transfer webcam data to the GPU.');
                                    }
    	                        },
                                function(error)
                                {
    		                        alert( 'Unable to capture WebCam. Please reload the page.' );
    	                        } );
    }
    else if( url.mType=="video" )
    {
    	texture = {};
        texture.mInfo = url;
        texture.globject = null;
        texture.loaded = false;
        texture.video = document.createElement('video');
    	texture.video.width = 256;
    	texture.video.height = 256;
    	texture.video.loop = true;
        texture.video.paused  = true;//this.mForcePaused;
        texture.video.mPaused = true;//this.mForcePaused;
        texture.video.mMuted = this.mForceMuted;
    	texture.video.muted  = this.mForceMuted;
        if( this.mForceMuted==true )
            texture.video.volume = 0;
    	texture.video.autoplay = false;
        texture.video.hasFalled = false;

        texture.video.addEventListener( "canplay", function(e)
        {
            texture.video.play();
            texture.video.paused  = false;
            texture.video.mPaused = false;

            texture.globject = gl.createTexture();
            createGLTextureLinear( gl, texture.video, texture.globject );
            texture.loaded = true;

            if( me.mTextureCallbackFun!=null )
                me.mTextureCallbackFun( me.mTextureCallbackObj, slot, texture.video, true, true, 1, -1.0 );

        } );

        texture.video.addEventListener( "error", function(e)
        {
               if( texture.video.hasFalled==true ) { alert("Error: cannot load video" ); return; }
               var str = texture.video.src;
               str = str.substr(0,str.lastIndexOf('.') ) + ".mp4";
               texture.video.src = str;
               texture.video.hasFalled = true;
        } );


        texture.video.src = url.mSrc;
    }
    else if( url.mType=="music" )
    {
    	texture = {};
        texture.mInfo = url;
        texture.globject = null;
        texture.loaded = false;
        texture.audio = document.createElement('audio');
    	texture.audio.loop = true;
        texture.audio.mMuted = this.mForceMuted;
        texture.audio.mForceMuted = this.mForceMuted;

    	texture.audio.muted = this.mForceMuted;
        if( this.mForceMuted==true )
            texture.audio.volume = 0;
    	texture.audio.autoplay = true;
        texture.audio.hasFalled = false;
    	texture.audio.paused = true;
        texture.audio.mPaused = true;
        texture.audio.mSound = {};

        if( this.mForceMuted )
        {
            texture.globject = gl.createTexture();
            createAudioTexture( gl, texture.globject );
            var num = 512;
            texture.audio.mSound.mFreqData = new Uint8Array( num );
            texture.audio.mSound.mWaveData = new Uint8Array( num );
            texture.loaded = true;
            texture.audio.paused = false;
            texture.audio.mPaused = false;
        }

        texture.audio.addEventListener( "canplay", function()
        {
            if( this.mForceMuted  ) return;

            texture.globject = gl.createTexture();
            createAudioTexture( gl, texture.globject );

            if( me.mAudioContext != null )
            {
                var ctx = me.mAudioContext;
                texture.audio.mSound.mSource   = ctx.createMediaElementSource( texture.audio );
                texture.audio.mSound.mAnalyser = ctx.createAnalyser();
                texture.audio.mSound.mGain     = ctx.createGain();

                texture.audio.mSound.mSource.connect(   texture.audio.mSound.mAnalyser );
                texture.audio.mSound.mAnalyser.connect( texture.audio.mSound.mGain );
                texture.audio.mSound.mGain.connect( ctx.destination );

                texture.audio.mSound.mFreqData = new Uint8Array( texture.audio.mSound.mAnalyser.frequencyBinCount );
                texture.audio.mSound.mWaveData = new Uint8Array( texture.audio.mSound.mAnalyser.frequencyBinCount );

                texture.loaded = true;
                texture.audio.paused = false;
                texture.audio.mPaused = false;
            }
            else
            {
                 if( me.mNoAudioMessageShowed==false )
                 {
                   var ve = document.getElementById( "centerScreen" );
                   doAlert( getCoords(ve), {mX:420,mY:160}, "Error", "Your browser does not support WebAudio.<br><br>This shader will not work as the author intended. Please consider using a WebAudio-friendly browser (Chrome).", false, null );
                   me.mNoAudioMessageShowed = true;
                 }
            }
        } );

        texture.audio.addEventListener( "error", function(e)
        {
               if( this.mForceMuted  ) return;

               if( texture.audio.hasFalled==true ) { /*alert("Error: cannot load music" ); */return; }
               var str = texture.audio.src;
               str = str.substr(0,str.lastIndexOf('.') ) + ".ogg";
               texture.audio.src = str;
               texture.audio.hasFalled = true;
        } );

        if( !this.mForceMuted )
        {
            texture.audio.src = url.mSrc;
        }


        if( me.mTextureCallbackFun!=null )
            me.mTextureCallbackFun( me.mTextureCallbackObj, slot, null, false, true, 2, -1.0 );
    }
    else if( url.mType=="keyboard" )
    {
    	texture = {};
        texture.mInfo = url;
        texture.globject = gl.createTexture();
        texture.loaded = true;

        texture.keyboard = {};

        texture.keyboard.mImage = new Image();
        texture.keyboard.mImage.onload = function()
        {
            texture.loaded = true;
            if( me.mTextureCallbackFun!=null )
                me.mTextureCallbackFun( me.mTextureCallbackObj, slot, {mImage:texture.keyboard.mImage,mData:texture.keyboard.mData}, false, false, 4, -1.0 );
        }
        texture.keyboard.mImage.src = "/img/keyboard.png";


        texture.keyboard.mNewTextureReady = true;
        texture.keyboard.mData = new Uint8Array( 256*2 );

        createKeyboardTexture( gl, texture.globject );

        for( var j=0; j<(256*2); j++ )
        {
              texture.keyboard.mData[j] = 0;
        }

        if( me.mTextureCallbackFun!=null )
            me.mTextureCallbackFun( me.mTextureCallbackObj, slot, {mImage:texture.keyboard.mImage,mData:texture.keyboard.mData}, false, false, 4, -1.0 );
    }
    else if( url.mType==null )
    {
        if( me.mTextureCallbackFun!=null )
            me.mTextureCallbackFun( this.mTextureCallbackObj, slot, null, false, true, 0, -1.0 );
    }
    else
    {
        alert( "texture type error" );
        return;
    }

    this.DestroyInput( slot );
    this.mInputs[slot] = texture;

    this.MakeHeader();
}

Effect.prototype.SetKeyDown = function( k )
{
    for( var i=0; i<this.mInputs.length; i++ )
    {
        var inp = this.mInputs[i];
        if( inp!=null && inp.mInfo.mType=="keyboard" )
        {
             inp.keyboard.mData[ k       ] = 255;
             inp.keyboard.mData[ k + 256 ] = 255 - inp.keyboard.mData[ k + 256 ];
             inp.keyboard.mNewTextureReady = true;
             break;
        }
    }
}
Effect.prototype.SetKeyUp = function( k )
{
    for( var i=0; i<this.mInputs.length; i++ )
    {
        var inp = this.mInputs[i];
        if( inp!=null && inp.mInfo.mType=="keyboard" )
        {
             inp.keyboard.mData[ k ] = 0;
             inp.keyboard.mNewTextureReady = true;
             break;
        }
    }
}

Effect.prototype.DetermineShaderPrecission = function()
{
    var h1 = "#ifdef GL_ES\n" +
             "precision highp float;\n" +
             "#endif\n";

    var h2 = "#ifdef GL_ES\n" +
             "precision mediump float;\n" +
             "#endif\n";

    var h3 = "#ifdef GL_ES\n" +
             "precision lowp float;\n" +
             "#endif\n";

    var str = "void main() { gl_FragColor = vec4(0.0,0.0,0.0,1.0); }\n";
    
    if( this.CreateShader(h1 + str, false).mSuccess==true ) { this.mPrecision = h1; return; }
    if( this.CreateShader(h2 + str, false).mSuccess==true ) { this.mPrecision = h2; return; }
    if( this.CreateShader(h3 + str, false).mSuccess==true ) { this.mPrecision = h3; return; }
    this.mPrecision = "";
}

Effect.prototype.MakeHeader = function()
{
    var header = this.mPrecision;

    if( this.mSupportsDerivatives ) header += "#extension GL_OES_standard_derivatives : enable\n";

    header += "uniform vec3      iResolution;\n" +
              "uniform float     iGlobalTime;\n" +
              "uniform float     iChannelTime[4];\n" +
              "uniform vec4      iMouse;\n" +
              "uniform vec4      iDate;\n" +
              "uniform vec3      iChannelResolution[4];\n";

     for( var i=0; i<this.mInputs.length; i++ )
     {
        var inp = this.mInputs[i];

        if( inp!=null && inp.mInfo.mType=="cubemap" )
            header += "uniform samplerCube iChannel" + i + ";\n";
        else
            header += "uniform sampler2D iChannel" + i + ";\n";
     }

    this.mHeader = header;
}


Effect.prototype.GetHeaderSize = function()
{
    var n = 13;
    if( this.mSupportsDerivatives ) n = n+1;
    return n;
}

Effect.prototype.CreateShader = function(tfs, nativeDebug )
{
    var gl = this.mGLContext;

    if( gl==null ) return {mSuccess:false, mInfo:"no GL"};

    var tmpProgram = gl.createProgram();

    var vs = gl.createShader(gl.VERTEX_SHADER);
    var fs = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vs, vsSource);
    gl.shaderSource(fs, tfs);

    gl.compileShader(vs);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    {
        var infoLog = gl.getShaderInfoLog(vs);
        gl.deleteProgram( tmpProgram );
        return {mSuccess:false, mInfo:infoLog};
    }

    if (!gl.getShaderParameter( fs, gl.COMPILE_STATUS))
    {
        var infoLog = gl.getShaderInfoLog(fs);
        gl.deleteProgram( tmpProgram );
        return {mSuccess:false, mInfo:infoLog};
    }

    if( nativeDebug )
    {
    var dbgext = gl.getExtension("WEBGL_debug_shaders");
    if( dbgext != null )
    {
        var hlsl = dbgext.getTranslatedShaderSource( fs );
        console.log( "------------------------\nHLSL code\n------------------------\n" + hlsl + "\n------------------------\n" );
    }
    }

    gl.attachShader(tmpProgram, vs);
    gl.attachShader(tmpProgram, fs);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    gl.linkProgram(tmpProgram);

    if( !gl.getProgramParameter(tmpProgram,gl.LINK_STATUS) )
    {
        var infoLog = gl.getProgramInfoLog(tmpProgram);
        gl.deleteProgram( tmpProgram );
        return {mSuccess:false, mInfo:infoLog};
    }

    return {mSuccess:true, mProgram:tmpProgram};
}


Effect.prototype.NewShader = function(shaderCode)
{
    var res = this.CreateShader( this.mHeader + shaderCode, true );

    if( res.mSuccess==false ) return res.mInfo;

    var gl = this.mGLContext;
    if( gl==null ) return "No GL";

    if( this.mProgram != null )
        gl.deleteProgram( this.mProgram );

    this.mProgram = res.mProgram;

    this.mSource = shaderCode;

    return null;//"Shader compiled successfully";
}

Effect.prototype.SetSize = function(xres,yres)
{
    this.mXres = xres;
    this.mYres = yres;
}

Effect.prototype.PauseInput = function( id )
{
    var me = this;
    var inp = this.mInputs[id];

    if( inp==null )
    {
    }
    else if( inp.mInfo.mType=="texture" )
    {
    }
    else if( inp.mInfo.mType=="slideshow" )
    {
        inp.slideshow.mCurrentSlide++;
        inp.image.onload = function()
        {
            inp.slideshow.mNewTextureReady = true;
            if( me.mTextureCallbackFun!=null )
                me.mTextureCallbackFun( me.mTextureCallbackObj, i, inp.image, true, true, 3, -1.0 );

        }
        var nn = inp.slideshow.mCurrentSlide | 0;
        var urlSlide = inp.mInfo.mSrc.replace("??","0"+nn);
        inp.image.src = urlSlide;
    }
    else if( inp.mInfo.mType=="video" )
    {
        if( inp.video.mPaused )
        {
            inp.video.play();
            inp.video.paused = false;
            inp.video.mPaused = false;
        }
        else
        {
            inp.video.pause();
            inp.video.paused = true;
            inp.video.mPaused = true;
        }
        return inp.video.mPaused;
    }
    else if( inp.mInfo.mType=="music" )
    {
        if( inp.audio.mPaused )
        {
            inp.audio.play();
            inp.audio.mPaused = false;
        }
        else
        {
            inp.audio.pause();
            inp.audio.mPaused = true;
        }
        return inp.audio.mPaused;
    }

    return null;
}


Effect.prototype.MuteInput = function( id )
{
    var me = this;
    var inp = this.mInputs[id];

    if( inp==null )
    {
    }
    else if( inp.mInfo.mType=="texture" )
    {
    }
    else if( inp.mInfo.mType=="slideshow" )
    {
        inp.slideshow.mCurrentSlide=0;
        inp.image.onload = function()
        {
            inp.slideshow.mNewTextureReady = true;
            if( me.mTextureCallbackFun!=null )
                me.mTextureCallbackFun( me.mTextureCallbackObj, i, inp.image, true, true, 3, -1.0 );
        }
        var urlSlide = inp.mInfo.mSrc.replace("??","00");
        inp.image.src = urlSlide;
    }
    else if( inp.mInfo.mType=="video" )
    {
        if( inp.video.mMuted )
        {
            inp.video.muted = false;
            //inp.video.volume = 100;
            inp.video.mMuted = false;
        }
        else
        {
            inp.video.muted = true;
            //inp.video.volume = 0;
            inp.video.mMuted = true;
        }
        return inp.video.mMuted;
    }
    else if( inp.mInfo.mType=="music" )
    {
        if( inp.audio.mMuted )
        {
            if( this.mAudioContext != null )
                inp.audio.mSound.mGain.gain.value = 1.0;
            inp.audio.mMuted = false;
        }
        else
        {
            if( this.mAudioContext != null )
                inp.audio.mSound.mGain.gain.value = 0.0;
            inp.audio.mMuted = true;
        }
        return inp.audio.mMuted;
    }

    return null;
}


Effect.prototype.RewindInput = function( id )
{
    var me = this;
    var inp = this.mInputs[id];

    if( inp==null )
    {
    }
    else if( inp.mInfo.mType=="texture" )
    {
    }
    else if( inp.mInfo.mType=="slideshow" )
    {
        inp.slideshow.mCurrentSlide--;
        if( inp.slideshow.mCurrentSlide<0 ) inp.slideshow.mCurrentSlide=0;
        inp.image.onload = function()
        {
            inp.slideshow.mNewTextureReady = true;
            if( me.mTextureCallbackFun!=null )
                me.mTextureCallbackFun( me.mTextureCallbackObj, i, inp.image, true, true, 3, -1.0 );
        }
        var nn = inp.slideshow.mCurrentSlide | 0;
        var urlSlide = inp.mInfo.mSrc.replace("??","0"+nn);
        inp.image.src = urlSlide;
    }
    else if( inp.mInfo.mType=="video" )
    {
        inp.video.currentTime = 0;
    }
    else if( inp.mInfo.mType=="music" )
    {
        inp.audio.currentTime = 0;
    }
}


Effect.prototype.UpdateInputs = function()
{
   for( var i=0; i<this.mInputs.length; i++ )
   {
        var inp = this.mInputs[i];

        if( inp==null )
        {
        }
        else if( inp.mInfo.mType=="texture" )
        {
        }
        else if( inp.mInfo.mType=="slideshow" )
        {
        }
        else if( inp.mInfo.mType=="video" )
        {
            if( inp.video.readyState === inp.video.HAVE_ENOUGH_DATA )
            {
                if( this.mTextureCallbackFun!=null )
                    this.mTextureCallbackFun( this.mTextureCallbackObj, i, inp.video, false, false, 0, -1 );
            }
        }
        else if( inp.mInfo.mType=="music" )
        {
              if( inp.audio.mPaused == false )
              {
                  if( this.mAudioContext != null )
                  {
                      inp.audio.mSound.mAnalyser.getByteFrequencyData(  inp.audio.mSound.mFreqData );
                      inp.audio.mSound.mAnalyser.getByteTimeDomainData( inp.audio.mSound.mWaveData );
                  }
                  if( this.mTextureCallbackFun!=null )
                      this.mTextureCallbackFun( this.mTextureCallbackObj, i, (this.mAudioContext==null)?null:inp.audio.mSound.mFreqData, false, false, 2, inp.audio.currentTime );
              }
        }
    }
}



Effect.prototype.Paint = function(time, mouseOriX, mouseOriY, mousePosX, mousePosY)
{
    var gl = this.mGLContext;

    if( gl==null ) return;
    if( this.mProgram==null ) return;

    gl.viewport( 0, 0, this.mXres, this.mYres );


    gl.useProgram( this.mProgram );

    var times = [ 0.0, 0.0, 0.0, 0.0 ];
    var units = [ 0, 1, 2, 3 ];

    var d = new Date();
    var dates = [ d.getFullYear(), // the year (four digits)
                  d.getMonth(),	   // the month (from 0-11)
                  d.getDate(),     // the day of the month (from 1-31)
                  d.getHours()*60.0*60 + d.getMinutes()*60 + d.getSeconds() ];

    var mouse = [  mousePosX, mousePosY, mouseOriX, mouseOriY ];

    var resos = [ 0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0 ];

    var l2 = gl.getUniformLocation( this.mProgram, "iGlobalTime"        ); if( l2!=null ) gl.uniform1f(  l2, time );
    var l3 = gl.getUniformLocation( this.mProgram, "iResolution"        ); if( l3!=null ) gl.uniform3f(  l3, this.mXres, this.mYres, 1.0 );
    var l4 = gl.getUniformLocation( this.mProgram, "iMouse"             ); if( l4!=null ) gl.uniform4fv( l4, mouse );
    var l5 = gl.getUniformLocation( this.mProgram, "iChannelTime"       );
    var l7 = gl.getUniformLocation( this.mProgram, "iDate"              ); if( l7!=null ) gl.uniform4fv( l7, dates );
    var l8 = gl.getUniformLocation( this.mProgram, "iChannelResolution" );

    var ich0 = gl.getUniformLocation( this.mProgram, "iChannel0" ); if( ich0!=null ) gl.uniform1i( ich0, 0 );
    var ich1 = gl.getUniformLocation( this.mProgram, "iChannel1" ); if( ich1!=null ) gl.uniform1i( ich1, 1 );
    var ich2 = gl.getUniformLocation( this.mProgram, "iChannel2" ); if( ich2!=null ) gl.uniform1i( ich2, 2 );
    var ich3 = gl.getUniformLocation( this.mProgram, "iChannel3" ); if( ich3!=null ) gl.uniform1i( ich3, 3 );

    var l1 = gl.getAttribLocation( this.mProgram, "pos");
    gl.bindBuffer( gl.ARRAY_BUFFER, this.mQuadVBO);
    gl.vertexAttribPointer( l1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( l1 );

    for( var i=0; i<this.mInputs.length; i++ )
    {
        var inp = this.mInputs[i];

        gl.activeTexture( gl.TEXTURE0+i );

        if( inp==null )
        {
            gl.bindTexture( gl.TEXTURE_2D, null );
        }
        else if( inp.mInfo.mType=="texture" )
        {
            if( inp.loaded==false  )
                gl.bindTexture( gl.TEXTURE_2D, null );
            else
            {
                gl.bindTexture( gl.TEXTURE_2D, inp.globject );
                resos[3*i+0] = inp.image.width;
                resos[3*i+1] = inp.image.height;
                resos[3*i+2] = 1;
            }
        }
        else if( inp.mInfo.mType=="slideshow" )
        {
            if( inp.loaded==false  )
                gl.bindTexture( gl.TEXTURE_2D, null );
            else
            {
                gl.bindTexture( gl.TEXTURE_2D, inp.globject );
                if( inp.slideshow.mNewTextureReady == true )
                {
                    gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false);
                    gl.texImage2D(  gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inp.image );
                    gl.generateMipmap( gl.TEXTURE_2D );
                    inp.slideshow.mNewTextureReady = false;
                }
                resos[3*i+0] = inp.image.width;
                resos[3*i+1] = inp.image.height;
                resos[3*i+2] = 1;
            }
        }
        else if( inp.mInfo.mType=="keyboard" )
        {
            if( inp.loaded==false  )
                gl.bindTexture( gl.TEXTURE_2D, null );
            else
            {
                gl.bindTexture( gl.TEXTURE_2D, inp.globject );
                if( inp.keyboard.mNewTextureReady == true )
                {

                    gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false);
                    gl.texSubImage2D( gl.TEXTURE_2D, 0, 0, 0, 256, 2, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.keyboard.mData );
                    inp.keyboard.mNewTextureReady = false;

                    if( this.mTextureCallbackFun!=null )
                        this.mTextureCallbackFun( this.mTextureCallbackObj, i, {mImage:inp.keyboard.mImage,mData:inp.keyboard.mData}, false, false, 4, -1.0 );
                }
            }
        }
        else if( inp.mInfo.mType=="cubemap" )
        {
            if( inp.loaded==false  )
                gl.bindTexture( gl.TEXTURE_CUBE_MAP, null );
            else
                gl.bindTexture( gl.TEXTURE_CUBE_MAP, inp.globject );
        }
        else if( inp.mInfo.mType=="webcam" )
        {
            if( inp.video.readyState === inp.video.HAVE_ENOUGH_DATA )
            {
                if( this.mTextureCallbackFun!=null )
                    this.mTextureCallbackFun( this.mTextureCallbackObj, i, inp.video, false, false, 0, -1 );

                if( inp.loaded==false )
                {
                    gl.bindTexture( gl.TEXTURE_2D, null );
                }
                else
                {
                    gl.bindTexture( gl.TEXTURE_2D, inp.globject );
                    gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texImage2D(  gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inp.video );
                    resos[3*i+0] = inp.video.width;
                    resos[3*i+1] = inp.video.height;
                    resos[3*i+2] = 1;
                }
            }
        }
        else if( inp.mInfo.mType=="video" )
        {
              if( inp.video.mPaused == false )
              {
                  if( this.mTextureCallbackFun!=null )
                      this.mTextureCallbackFun( this.mTextureCallbackObj, i, inp.video, false, false, 0, inp.video.currentTime );
              }

              if( inp.loaded==false )
              {
                  gl.bindTexture( gl.TEXTURE_2D, null );
              }
              else
              {
                  times[i] = inp.video.currentTime;

                  gl.bindTexture( gl.TEXTURE_2D, inp.globject );

    	          if( inp.video.mPaused == false )
                  {
                      gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true);
                      gl.texImage2D(  gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inp.video );
                  }
                  resos[3*i+0] = inp.video.width;
                  resos[3*i+1] = inp.video.height;
                  resos[3*i+2] = 1;
              }
          }
        else if( inp.mInfo.mType=="music" )
        {
              if( inp.audio.mPaused == false )
              {
                  if( this.mAudioContext != null )
                  {
                      inp.audio.mSound.mAnalyser.getByteFrequencyData(  inp.audio.mSound.mFreqData );
                      inp.audio.mSound.mAnalyser.getByteTimeDomainData( inp.audio.mSound.mWaveData );
                  }

                  if( this.mTextureCallbackFun!=null )
                      this.mTextureCallbackFun( this.mTextureCallbackObj, i, (this.mAudioContext==null)?null:inp.audio.mSound.mFreqData, false, false, 2, inp.audio.currentTime );
              }

              if( inp.loaded==false )
              {
                  gl.bindTexture( gl.TEXTURE_2D, null );
              }
              else
              {
                  times[i] = inp.audio.currentTime;

                  gl.bindTexture( gl.TEXTURE_2D, inp.globject );
                  if( inp.audio.mForceMuted == true )
                  {
                      times[i] = 10.0 + time;
                      var num = inp.audio.mSound.mFreqData.length;
                      for( var j=0; j<num; j++ )
                      {
                          var x = j / num;
                          var f =  (0.75 + 0.25*Math.sin( 10.0*j + 13.0*time )) * Math.exp( -3.0*x );

                          if( j<3 )
                              f =  Math.pow( 0.50 + 0.5*Math.sin( 6.2831*time ), 4.0 ) * (1.0-j/3.0);

                          inp.audio.mSound.mFreqData[j] = Math.floor(255.0*f) | 0;
                      }

                      var num = inp.audio.mSound.mFreqData.length;
                      for( var j=0; j<num; j++ )
                      {
                          var f = 0.5 + 0.15*Math.sin( 17.0*time + 10.0*6.2831*j/num ) * Math.sin( 23.0*time + 1.9*j/num );
                          inp.audio.mSound.mWaveData[j] = Math.floor(255.0*f) | 0;
                      }

                  }

    	          if( inp.audio.mPaused == false )
                  {
                      var waveLen = Math.min( inp.audio.mSound.mWaveData.length, 512 );
                      gl.texSubImage2D(  gl.TEXTURE_2D, 0, 0, 0, 512,     1, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.audio.mSound.mFreqData );
                      gl.texSubImage2D(  gl.TEXTURE_2D, 0, 0, 1, waveLen, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.audio.mSound.mWaveData );
                  }
              }
          }

    }

    if( l5!=null ) gl.uniform1fv( l5, times );
    if( l8!=null ) gl.uniform3fv( l8, resos );


    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(l1);
}


Effect.prototype.newScriptJSON = function( jobj )
{
    if( jobj.ver != "0.1" )
    {
        return { mFailed : true };
    }

    for( var i=0; i<4; i++ )
    {
        this.NewTexture( i, null );
    }

    var numPasses = jobj.renderpass.length;

    if( numPasses>1 )
    {
        return { mFailed : true, mError : "ShaderToy only supports one-pass shaders at this momment", mShader:null };
    }
    for( var j=0; j<numPasses; j++ )
    {
        var rpass = jobj.renderpass[j];

        var numInputs = rpass.inputs.length;

        for( var i = 0; i<numInputs; i++ )
        {
            var lid    = rpass.inputs[i].channel;
            var styp   = rpass.inputs[i].ctype;
            var sid    = rpass.inputs[i].id;
            var ssrc   = rpass.inputs[i].src;
            //console.log( "TEXT: " + lid + " " + styp + " " + sid + " " + ssrc );
            this.NewTexture( lid, { mType:styp, mID:sid, mSrc:ssrc } );
        }

      //------------------------

      var shaderStr = rpass.code;

      var result = this.NewShader( shaderStr );

      if( result!=null )
      {
          return { mFailed      : true,
                   mError       : result,
                   mShader      : shaderStr };
      }
      return { mFailed      : false,
               mError       : null,
               mShader      : shaderStr };
    }

}




Effect.prototype.exportToJSON = function( shaderCode )
{

    var result = {};

    result.ver = "0.1";

    result.renderpass = new Array()

    var numPasses = 1;
    for( var j=0; j<numPasses; j++ )
    {

        result.renderpass[j] = {};

        result.renderpass[j].outputs = new Array();
        result.renderpass[j].outputs.push( { channel:0, dst:"-1" } );

        result.renderpass[j].inputs = new Array();
        for( var i = 0; i<4; i++ )
        {
            if( this.mInputs[i]==null ) continue;

            result.renderpass[j].inputs.push( {channel: i,
                                               ctype  : this.mInputs[i].mInfo.mType,
                                               id     : this.mInputs[i].mInfo.mID,
                                               src    : this.mInputs[i].mInfo.mSrc } );
        }

        if( shaderCode !=null )
            result.renderpass[j].code = shaderCode;
        else
            result.renderpass[j].code = this.mSource;
        result.renderpass[j].name = "";
        result.renderpass[j].description = "";
    }

    return result;
}


