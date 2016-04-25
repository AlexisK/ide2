function dataURItoBlob(dataURI, type) {
    type = type||'image/jpeg';
    var binary = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(binary.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < binary.length; i++) {
        ia[i] = binary.charCodeAt(i);
    }
    
    var result = new Blob([ab], { type: type });
    
    return result;
}








function cropClass() {
    
    function initCrop() {
        cropBlock            = cr('div', 'jCrop noanim');
        cropCont.imgBlock    = cropBlock.cr('div', 'jCropImgBlock noanim');
        cropCont.canvasBlock = cropBlock.cr('div', 'jCropCanvasBlock noanim');
        cropCont.canvasBlock.cr('h3').VAL('Создание миниатюры');
        cropCont.canvasBlock.cr('div').VAL('Выберите область на основной фотографии, которая будет отображаться в миниатюре на сайте.');
        cropCont.canvas      = cropCont.canvasBlock.cr('canvas').attr({width: 200, height: 200});
        cropCont.submit      = cropCont.canvasBlock.cr('input').attr({type:'button'}).VAL('Сохранить');
        cropCont.cancel      = cropCont.canvasBlock.cr('input').attr({type:'button'}).VAL('Отмена');
        cropCont.img         = cropCont.imgBlock.cr('img', 'jCropImg');
        cropCont.posBlock    = cropCont.imgBlock.cr('div', 'jCropPosBlock noanim');
        cropCont.dragBlock   = cropCont.posBlock.cr('div', 'jCropDrag');
        cropCont.sizeBlock   = listToArray([
            cropCont.posBlock.cr('div', 'jCropSize'),
            cropCont.posBlock.cr('div', 'jCropSize'),
            cropCont.posBlock.cr('div', 'jCropSize'),
            cropCont.posBlock.cr('div', 'jCropSize')
            ]);
        
        
        
        
        cVars.minsize = [0,0];
        cVars.ctx = cropCont.canvas.getContext('2d');
        cVars.doMove = false;
        cVars.doResize = false;
        
        
        cropCont.dragBlock.onmousedown = function(ev) {
            cVars.pbPos = self.cropGetPos();
            cVars.doMove = true;
            return false;
        }
        
        cropCont.sizeBlock.map(function(elem) {
            elem.onmousedown = function(ev) {
                cVars.pbPos = self.cropGetPos();
                cVars.doResize = true;
                return false;
            }
        } );
        
        cropBlock.onmousemove = function(ev) {
            if ( cVars.doMove ) {
                var pos  = self.cropGetPos();
                
                self.cropSetPos(ev.pageX-cVars.selfPos[0]-cVars.cursize[0]/2, ev.pageY-cVars.selfPos[1]-cVars.cursize[1]/2);
                self.cropDrawPart();
            } else if ( cVars.doResize ) {
                self.cropSetSize(ev.pageX-cVars.selfPos[0], ev.pageY-cVars.selfPos[1]);
                self.cropDrawPart();
            }
            
            return false;
        }
        
        cropBlock.onmouseup = function(ev) {
            cVars.doMove = false;
            cVars.doResize = false;
            
            return false;
        }
        
        cropCont.submit.onclick = function() {
            if ( def(cVars.func) ) {
                var file = cropCont.canvas.toDataURL(%imageResizeTo);
                cVars.func(file, dataURItoBlob(file));
            }
            cropBlock.detach();
            //-POP.window.hide();
            readerGlob.cropInProgress = false;
            self.cropNext();
        }
        cropCont.cancel.onclick = self.close;
    }
    
    this.close = function() {
        cropBlock.detach();
        //-POP.window.hide();
        readerGlob.cropInProgress = false;
        self.cropNext();
    }
    
    
    
    this.cropDrawPart = function() {
        var pos = self.cropGetPos();
        var startX = -pos[0]*cVars.scale / cVars.imgScale;;
        var startY = -pos[1]*cVars.scale / cVars.imgScale;;
        var endX = cVars.trueSize.width / cVars.imgScale;
        var endY = cVars.trueSize.height / cVars.imgScale;
        
        cVars.ctx.drawImage(cropCont.img, startX, startY, endX, endY);
    }
    
    
    
    this.cropGetPos = function() {
        var pos = getOffsetRect(cropCont.posBlock);
        
        return [pos.left-cVars.selfPos[0]+%cropBgOffset, pos.top-cVars.selfPos[1]+%cropBgOffset];
    }
    
    
    this.cropSetPos = function(x ,y) {
        
        x = parseInt(x);
        y = parseInt(y);
        
        
        if ( y < 0 ) {
            cropCont.posBlock.style.top = '%cropBgOffset;px';
        } else if ( y + cVars.cursize[1] > cVars.viewSize.height ) {
            cropCont.posBlock.style.top = cVars.viewSize.height - cVars.cursize[1] - %cropBgOffset + 'px'
        } else {
            cropCont.posBlock.style.top  = y - %cropBgOffset + 'px';
        }
        
        if ( x < 0 ) {
            cropCont.posBlock.style.left = '%cropBgOffset;px';
        } else if ( x + cVars.cursize[0] > cVars.viewSize.width ) {
            cropCont.posBlock.style.left = cVars.viewSize.width - cVars.cursize[0] - %cropBgOffset + 'px'
        } else {
            cropCont.posBlock.style.left  = x - %cropBgOffset + 'px';
        }
        
    }
    
    
    
    
    this.cropSetSize = function(x, y) {
        newPos = self.calcSizeDots(x, y);
        if ( 1 ) {
            var newX = newPos[2] - newPos[0];
            var newY = newPos[3] - newPos[1];
            
            self.cropSetPos(newPos[0], newPos[1]);
            
            cropCont.posBlock.style.width  = newX+'px';
            cropCont.posBlock.style.height = newY+'px';
            
            cVars.cursize = [newX, newY];
            cVars.imgScale = newX / cVars.minsize[0];
            
        }
        
    }
    
    
    this.calcSizeDots = function(x, y) {
        
        var calcPoint = [0,0];
        var newPoint  = [0,0];
        var result    = [0,0,0,0];
        
        var pos1  = self.cropGetPos();
        var pos2  = [parseInt(pos1[0]+cVars.cursize[0]), parseInt(pos1[1]+cVars.cursize[1])];
        var diffX = 0;
        var diffY = 0;
        
        
        
        function _diffLimit() {
            if ( newPoint[0] <= 0 ) {
                newPoint[0] = 0;
                var temp = Math.abs(calcPoint[0] - newPoint[0]) / cVars.proportion;
                if ( y < calcPoint[1] ) { temp *= -1;}
                newPoint[1] = calcPoint[1] + temp;
            }
            if ( newPoint[0] >= cVars.viewSize.width ) {
                newPoint[0] = parseInt(cVars.viewSize.width);
                var temp = Math.abs(calcPoint[0] - newPoint[0]) / cVars.proportion;
                if ( y < calcPoint[1] ) { temp *= -1;}
                newPoint[1] = calcPoint[1] + temp;
            }
            
            if ( newPoint[1] <= 0 ) {
                newPoint[1] = 0;
                var temp = Math.abs(calcPoint[1] - newPoint[1]) * cVars.proportion;
                if ( x < calcPoint[0] ) { temp *= -1;}
                newPoint[0] = calcPoint[0] + temp;
            }
            if ( newPoint[1] >= cVars.viewSize.height ) {
                newPoint[1] = parseInt(cVars.viewSize.height);
                var temp = Math.abs(calcPoint[1] - newPoint[1]) * cVars.proportion;
                if ( x < calcPoint[0] ) { temp *= -1;}
                newPoint[0] = calcPoint[0] + temp;
            }
        }
        
        function _diffX() {
            var temp = diffX / cVars.proportion;
            if ( y < calcPoint[1] ) { temp *= -1;}
            newPoint[0] = x;
            newPoint[1] = calcPoint[1] + temp;
            
        }
        
        function _diffY() {
            var temp = diffY * cVars.proportion;
            if ( x < calcPoint[0] ) { temp *= -1;}
            newPoint[1] = y;
            newPoint[0] = calcPoint[0] + temp;
            
        }
        
        
        if ( Math.abs(pos1[0] - x) > Math.abs(pos2[0] - x) ) {
            calcPoint[0] = pos1[0];
        } else {
            calcPoint[0] = pos2[0];
        }
        if ( Math.abs(pos1[1] - y) > Math.abs(pos2[1] - y) ) {
            calcPoint[1] = pos1[1];
        } else {
            calcPoint[1] = pos2[1];
        }
        
        
        
        diffX = Math.abs(calcPoint[0] - x);
        diffY = Math.abs(calcPoint[1] - y);
        
        
        if ( diffX < cVars.minsize[0] && diffY < cVars.minsize[1] ) {
            if ( x > calcPoint[0] ) {
                newPoint[0] = calcPoint[0] + cVars.minsize[0];
            } else {
                newPoint[0] = calcPoint[0] - cVars.minsize[0];
            }
            if ( y > calcPoint[1] ) {
                newPoint[1] = calcPoint[1] + cVars.minsize[1];
            } else {
                newPoint[1] = calcPoint[1] - cVars.minsize[1];
            }
        } else if ( diffX > diffY * cVars.proportion ) {
            _diffX();
            _diffLimit();
        } else {
            _diffY();
            _diffLimit();
        }
        
        
        if ( newPoint[0] < calcPoint[0] ) {
            if ( newPoint[1] < calcPoint[1] ) {
                result = [newPoint[0], newPoint[1], calcPoint[0], calcPoint[1]];
            } else {
                result = [newPoint[0], calcPoint[1], calcPoint[0], newPoint[1]];
            }
        } else {
            if ( newPoint[1] > calcPoint[1] ) {
                result = [calcPoint[0], calcPoint[1], newPoint[0], newPoint[1]];
            } else {
                result = [calcPoint[0], newPoint[1], newPoint[0], calcPoint[1]];
            }
        }
        
        
        result[0] = parseInt(result[0]);
        result[1] = parseInt(result[1]);
        result[2] = parseInt(result[2]);
        result[3] = parseInt(result[3]);
        
        
        
        return result;
    }
    
    
    this.crop = function(dataUri, dims, func, additionalBtn) {
        if ( def(additionalBtn) ) {
            if ( def(self.addBtn) ) { self.addBtn.detach(); }
            self.addBtn = additionalBtn;
        }
        
        readerGlob.cropQueue.add([dataUri, dims, func]);
        self.cropNext();
    }
    
    
    this.cropNext = function() {
        if ( !readerGlob.cropInProgress && readerGlob.cropQueue.length > 0 ) {
            readerGlob.cropInProgress = true;
            var data = readerGlob.cropQueue[0];
            self.doCrop(data[0], data[1], data[2]);
            readerGlob.cropQueue.splice(0, 1);
        }
    }
    
    
    this.doCrop = function(dataUri, dims, func) {
        dims = dims.split('x');
        
        if ( !def(cropBlock) ) { initCrop(); }
        if ( def(self.addBtn) ) {
            cropCont.canvasBlock.attach(self.addBtn);
        }
        cVars.func = func;
        cropCont.imgBlock.remattr('style');
        cropBlock.remattr('style');
        cropCont.canvas.remattr('style');
        cropCont.canvasBlock.remattr('style');
        cropCont.posBlock.remattr('style');
        
        
        var sidebarSize = 300;
        var previewSize = [dims[0], dims[1]];
        if ( previewSize[0] > 300 ) {
            var ratio = previewSize[0] / previewSize[1];
            previewSize[0] = 300;
            previewSize[1] = previewSize[0] / ratio;
        }
        
        cropCont.canvasBlock.style.width = sidebarSize+'px';
        cropCont.canvas.style.width      = previewSize[0]+'px';
        cropCont.canvas.style.height     = previewSize[1]+'px';
        cropCont.canvas.attr({
            width: dims[0],
            height: dims[1]
        });
        
        
        var imgNode = new Image();
        
        
        
        function imgLoadedFn() {
            //-POP.window.show(cropBlock, true);
            document.body.attach(cropBlock);
            
            setTimeout(function() {
                cVars.trueSize = { width: imgNode.naturalWidth || imgNode.width, height: imgNode.naturalHeight || imgNode.height};
                cVars.viewSize = { width: cropCont.img.offsetWidth, height: cropCont.img.offsetHeight};
                
                if ( cVars.trueSize.width < dims[0] || cVars.trueSize.height < dims[1] ) {
                    
                    dims[0] = Math.min(dims[0], cVars.trueSize.width);
                    dims[1] = Math.min(dims[1], cVars.trueSize.height);
                    
                    self.crop( dataUri, dims.join('x'), func );
                    
                    cropBlock.detach();
                    readerGlob.cropInProgress = false;
                    self.cropNext();
                    
                    return false;
                }
                
                var ratio = cVars.viewSize.width / cVars.viewSize.height;
                cVars.viewSize.width -= 40;
                var rOffset = sidebarSize + cVars.viewSize.width - cropBlock.offsetWidth;
                if ( rOffset > 0 ) {
                    cVars.viewSize.width -= rOffset;
                }
                cVars.viewSize.height = cVars.viewSize.width / ratio;
                
                
                var imgBlockLeftOffset = (cropBlock.offsetWidth  - sidebarSize - cVars.viewSize.width)/2;
                var imgBlockTopOffset  = (cropBlock.offsetHeight - cVars.viewSize.height)/2;
                
                
                cropCont.imgBlock.style.width    = cVars.viewSize.width+'px';
                cropCont.imgBlock.style.height   = cVars.viewSize.height+'px';
                cropCont.imgBlock.style.left     = sidebarSize+imgBlockLeftOffset+'px';
                cropCont.imgBlock.style.top      = imgBlockTopOffset+'px';
                
                
                cropBlock.style.width  = cropBlock.offsetWidth +'px';
                cropBlock.style.height = cropBlock.offsetHeight+'px';
                
                cVars.selfPos = getOffsetRect(cropCont.imgBlock);
                cVars.selfPos = [cVars.selfPos.left, cVars.selfPos.top];
                
                cVars.imgScale   = 1;
                cVars.proportion = dims[0] / dims[1];
                cVars.scale      = cVars.trueSize.width / cVars.viewSize.width;
                cVars.minsize    = [dims[0]/cVars.scale, dims[1]/cVars.scale];
                cVars.cursize    = [dims[0]/cVars.scale, dims[1]/cVars.scale];
                
                cropCont.posBlock.style.left = (-1 * parseInt(%cropBgOffset)) + cVars.viewSize.width/2 - cVars.minsize[0]/2+'px';
                cropCont.posBlock.style.top = (-1 * parseInt(%cropBgOffset)) + cVars.viewSize.height/2 - cVars.minsize[1]/2+'px';
                cropCont.posBlock.style.width = cVars.minsize[0]+'px';
                cropCont.posBlock.style.height = cVars.minsize[1]+'px';
                
                self.cropDrawPart();
                setTimeout(imgNode.del, 100);
            }, 100);
            
            return false;
        }
        imgNode.src = dataUri;
        imgNode.onload  = imgLoadedFn;
        imgNode.onerror = imgLoadedFn;
        
        cropCont.img.src = dataUri;
        
    }
    
    
    
    
    
    var self = this;
    
    var CANVAS = cr('canvas')
    var CONTEXT = CANVAS.getContext("2d");
    
    self.addBtn = null;
    
    var cropBlock = null;
    var cropCont = {};
    var cVars = {};
}
var CROP = new cropClass();












function imageReader() {
    this.read = function(file, dims) {
        FILE = file;
        if ( def(dims) ) { DIMS = dims; }
        
        reader.readAsDataURL(file);
    }
    
    this.readendDoFunc = function(imgMap, j, len, dataUri) {
        self.createResizedImg(dataUri, DIMS[j/2], function(tempImgMap) {
            imgMap[j] = tempImgMap[0];
            imgMap[j+1] = tempImgMap[1];
            
            if ( j == len-2 ) {
                self.onready.apply(null, imgMap);
            }
        } );
    }
    this.readend = function(ev) {
        var dataUri = reader.result;
        var imgMap = [];
        
        for ( var i = 0, len = parseInt(DIMS.length)*2; i < len; i += 2 ) {
            self.readendDoFunc(imgMap, i, len, dataUri);
            
        }
    }
    
    this.getImageDimetions = function(node) {
        var imgNode = cr('img');
        imgNode.src = node.src;
        var result = { width: imgNode.naturalWidth || imgNode.width, height: imgNode.naturalHeight || imgNode.height};
        imgNode.detach();
        delete imgNode;
        
        return result;
    }
    
    this.getImageDimetionsCallback = function(node, func) {
        var imgNode = cr('img');
        imgNode.src = node.src;
        imgNode.onload = function() {
            var result = { width: imgNode.naturalWidth || imgNode.width, height: imgNode.naturalHeight || imgNode.height};
            imgNode.detach();
            delete imgNode;
            
            func(result);
        }
    }
    
    this.createResizedImg = function(dataUri, format, doFunc) {
        var tempImg = cr('img');
        tempImg.src = dataUri;
        
        self.getImageDimetionsCallback(tempImg, function(trueSize) {
            var ratio = trueSize.width / trueSize.height;
            var formatRatio = 0;
            var newWidth = null;
            var newHeight = null;
            var formatProp = 1;
            var cnvOffsetX = 0;
            var cnvOffsetY = 0;
            
            
            
            if ( def(format) && format != 'any' ) {
                var formatMap = format.split('x');
                
                newWidth = parseInt(formatMap[0]);
                newHeight = parseInt(formatMap[1]);
                formatProp = parseInt(formatMap[2]);
                
                formatRatio = newWidth / newHeight;
                
                if ( newWidth <= trueSize.width || newHeight <= trueSize.height ) {
                    
                    var proportion = 1;
                    if ( trueSize.width < newWidth ) { newWidth = trueSize.width; }
                    if ( trueSize.height < newHeight ) { newHeight = trueSize.height; }
                    
                    
                    if ( formatProp == 1 ) {
                        if ( newWidth / ratio < newHeight ) {
                            newHeight = newWidth / ratio;
                            
                            if ( newHeight > formatMap[1] ) {
                                proportion = newHeight / formatMap[1];
                            }
                        } else {
                            newWidth = newHeight * ratio;
                            
                            if ( newWidth > formatMap[1] ) {
                                proportion = newWidth / formatMap[1];
                            }
                        }
                        
                        newWidth /= proportion;
                        newHeight /= proportion;
                        
                    } else if ( formatProp == 2 ) {
                        if ( formatRatio > ratio ) {
                            proportion = trueSize.height / (trueSize.width/newWidth);
                            cnvOffsetY = (proportion- formatMap[1])/2;
                        } else {
                            proportion = trueSize.width / (trueSize.height/newHeight);
                            cnvOffsetX = (proportion - formatMap[0])/2;
                        }
                        
                        
                    }
                    
                    
                } else {
                    newWidth = trueSize.width;
                    newHeight = trueSize.height;
                }
                
            } else {
                newWidth = trueSize.width;
                newHeight = trueSize.height;
            }
            
            CANVAS.width = newWidth;
            CANVAS.height = newHeight;
            CONTEXT.drawImage(tempImg, -cnvOffsetX, -cnvOffsetY, newWidth+cnvOffsetX*2, newHeight+cnvOffsetY*2);
            var file = CANVAS.toDataURL(%imageResizeTo);
            
            tempImg.detach();
            delete tempImg;
            
            doFunc([file, dataURItoBlob(file)]);
        } );
        
    }
    
    
    
    this.onready = function(dataUri, file){}
    this.onerror = function(){}
    
    
    var self = this;
    var reader = new FileReader();
    var FILE = null;
    var DIM = null;
    
    var CANVAS = cr('canvas')
    var CONTEXT = CANVAS.getContext("2d");
    
    reader.onloadend = function(ev) { self.readend(ev); }
    reader.onerror = function(ev) { log(['err: imageReader', ev]); self.onerror(ev); }
}
imageReader.prototype = CROP;

var readerGlob = {
    cropQueue: [],
    cropInProgress: false,
    ref: new imageReader()
};



function fileName(file) {
    var nameMap = (file.name || file.fileName || 'file').split('.');
    if ( nameMap.length >= 2 ) {
        nameMap.splice(nameMap.length-1,1);
    }
    nameMap.push('jpg');
    return nameMap.join('.');
}


function resizeImage(file, dims, func) {
    var resizeType = Math.max(dims.split('x')[2]||1, 1);
    var name = fileName(file);
    
    var reader = new imageReader();
    
    if ( resizeType <= 2 ) {
        reader.onready = function(a,b) {
            func(a,b,name);
        };
        reader.read(file, [dims]);
    } else {
        reader.onready = function(dataUri, file) {
            CROP.crop(dataUri, dims, function(a,b) {
                func(a,b,name);
            });
        };
        reader.read(file, [%imageMaxDims]);
    }
    
}




function __recalcSingleSize(media_id, dims, tag, q, nFile, nName) {
    q.add(function(done) {
        resizeImage(nFile, dims, function(dUri, dFile) {
            PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[dFile,nName]}, function() {
                SYS.notify(PAGE.ld('image '+dims+' uploaded'), 'ok');
                done();
            });
        });
    });
}


function getMediaFileUrl(tag, id, ext) {
    if ( typeof(tag) == 'object' ) {
        ext = tag.ext;
        id = tag.media_id;
        tag = tag.tag;
    }
    
    return [ENGINE.path.media_raw, (new Date()*1), '/', tag, '-', id, '.', ext].join('');
}



function getImage(media_id, func) {
    ORM.req('mediafile:select', function(fileList) {
        var result = {};
        
        map(fileList, function(file) {
            result[file.tag] = getMediaFileUrl(file);
        });
        
        func(result);
    }, {
        selector: {
            media_id: ['=', media_id ]
        }
    });
}



function createImage(mediatypeName, file, dims, func) {
    ORM.prep('mediatype_'+mediatypeName, function(mediatype) {
        
        resizeImage(file, %imageMaxDims, function(buri, bfile, bName) {
            ORM.req('media:insert', {mediatype_id:mediatype.id}, function(media) {
                media = media[0];
                
                PROTOCOL.media.write(media.id+'_basic:upload', {file:[bfile,bName]}, function() {
                    SYS.notify(PAGE.ld('basic image uploaded'),'ok');
                    var q = new EQ(function() {
                        ORM.req('mediafile:select', function(fileList) {
                            var result = {};
                            
                            map(fileList, function(file) {
                                result[file.tag] = getMediaFileUrl(file);
                            });
                            
                            func(result, media);
                        }, {
                            selector: {
                                media_id: ['=', media.id ]
                            }
                        });
                        
                    });
                    
                    mapO(dims, function(dim, tag) {
                        __recalcSingleSize(media.id, dim, tag, q, bfile, bName);
                    })
                    
                });
                
            });
        });
        
    });
}


function cropImage(media_id, dims, func, rdata) {
    rdata = mergeObjects({
        from: 'basic',
        crop: true
    }, rdata);
    func = func || function() {};
    
    ORM.req('mediafile:select', function(fileList) {
        var result = {};
        var resObj = {};
        
        map(fileList, function(file) {
            result[file.tag] = getMediaFileUrl(file);
            resObj[file.tag] = file;
        });
        
        var q = new EQ(function() {
            func(result);
        });
        
        
        mapO(dims, function(dim, tag) {
            q.add(function(done) {
                if ( rdata.crop ) {
                    CROP.crop(result[rdata.from], dim, function(newUri, newFile) {
                        PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[newFile,resObj.basic.filename]}, function(mfile) {
                            SYS.notify(PAGE.ld('image '+dim+' uploaded'), 'ok');
                            result[mfile.tag] = getMediaFileUrl(mfile);
                            resObj[mfile.tag] = mfile;
                            done();
                        });
                    });
                } else {
                    var reader = new imageReader();
                    reader.createResizedImg(result[rdata.from], dim, function(resp) {
                        var newUri = resp[0];
                        var newFile = resp[1];
                        
                        PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[newFile,resObj.basic.filename]}, function(mfile) {
                            SYS.notify(PAGE.ld('image '+dim+' uploaded'), 'ok');
                            result[mfile.tag] = getMediaFileUrl(mfile);
                            resObj[mfile.tag] = mfile;
                            done();
                        });
                    });
                }
            });
            
        })
        
    }, {
        selector: {
            media_id: ['=', media_id ]
        }
    });
}




























