self._buildMediaRow = function(key, node) {
    var row = cr('tr');
    if ( typeof(key) == 'string' ) {
        row._key = row.cr('td').VAL(PAGE.ld(key));
    } else {
        row._key = row.cr('td');
        row._key.attach(key);
    }
    row._val = row.cr('td');
    row._val.attach(node);
    
    return row;
}


self.buildMedia = function(data, key) {
    data = mergeObjects({
        proto: 'image',
        type: 'image'
    }, data);
    
    
    var node = _jO(cr('div', 'line'));
    node.cr('div', 'key').VAL(PAGE.ld(key));
    node.V.contNode = node.cr('div', 'jImgForm');
    node.V.table = node.V.contNode.cr('table');
    node.V.input = dispatchOnUpdate(cr('input'));
    
    node.C.selector = cr('input').attr({type: 'file'});
    node.C.tagFile = {};
    
    
    node.V.uploadBtn = cr('div', 'asBtn fa').VAL(PAGE.ld('upload'));
    node.V.uploadBtn.onclick = function() { node.C.selector.click(); }
    node.V.strName = cr('div').VAL('noname');
    
    node.V.blockSize = cr('div');
    node.V.blockSize.cr('div').VAL('basic');
    node.V.strSize = node.V.blockSize.cr('a').VAL('0');
    ADAPTER.fileSize.process(node.V.strSize);
    
    
    node.V.table.attach(self._buildMediaRow('change', node.V.uploadBtn));
    node.V.table.attach(self._buildMediaRow(node.V.blockSize, node.V.strName));
    
    node.V.minDimsMsg = cr('strong','red right');
    node.V.uploadBtn.insBefore(node.V.minDimsMsg);
    
    
    
    var minDims = [0,0];
    
    if ( data.proto == 'image' ) {
        node.C.tagDom = {};
        
        mapO(data.file, function(dims, tag) {
            var dimMap = dims.split('x');
            
            minDims[0] = Math.max(minDims[0], dimMap[0]);
            minDims[1] = Math.max(minDims[1], dimMap[1]);
            
            var imgNodes = [
                cr('div'),
                cr('img').attr({
                    width:  dimMap[0],
                    height: dimMap[1]
                })
            ];
            imgNodes[0].cr('div').VAL(dimMap.sl([0,2]).join('x'));
            imgNodes.push(imgNodes[0].cr('a'));
            ADAPTER.fileSize.process(imgNodes[2]);
            
            node.V.table.attach(self._buildMediaRow(imgNodes[0], imgNodes[1]));
            
            if ( !data.noclick ) {
                imgNodes[1].onclick = function() {
                    if ( node.C.tagFile.basic ) {
                        var dataUrl = getMediaFileUrl(node.C.tagFile.basic);
                        var name = node.C.tagFile.basic.filename;
                        
                        CROP.crop(dataUrl, dims, function(newUri, newFile) {
                            PROTOCOL.media.write([node.C.media_id, tag].join('_'), {
                                file:[newFile, name]
                            }, node.F.refreshImages);
                        });
                    }
                }
            }
            
            node.C.tagDom[tag] = imgNodes;
        })
    }
    
    
    node.V.minDimsMsg.val = [PAGE.ld('min size'),' ',minDims.join('x')].join('');
    
    
    node.F.__recalcSingleSize = function(media_id, dims, tag, q, nFile, nName) {
        q.add(function(done) {
            resizeImage(nFile, dims, function(dUri, dFile) {
                PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[dFile,nName]}, function() {
                    SYS.notify(PAGE.ld('image uploaded'),'ok');
                    done();
                });
            });
        });
    }
    
    
    node.F.recalcImages = function(file) {
        resizeImage(file, %imageMaxDims, function(nUri, nFile, nName) {
            PROTOCOL.media.write(node.C.media_id+'_basic:upload', {file:[nFile,nName]}, function() {
                SYS.notify(PAGE.ld('basic image uploaded'),'ok');
                var q = new EQ(node.F.refreshImages);
                
                mapO(data.file, function(dims, tag) {
                    node.F.__recalcSingleSize(node.C.media_id, dims, tag, q, nFile, nName);
                })
                
            });
        });
    }
    
    
    
    node.F.refreshImages = function() {
        if (!def(node.C.media_id)) { return 0; }
        
        var val = node.C.media_id;
        
        ORM.req('mediafile:select', function(fileList) {
            
            map(fileList, function(mediafile) {
                node.C.tagFile[mediafile.tag] = mediafile;
                
                if ( def(node.C.tagDom[mediafile.tag])) {
                    var nodes = node.C.tagDom[mediafile.tag];
                    nodes[1].src = getMediaFileUrl(mediafile);
                    nodes[2].val = mediafile.size;
                    nodes[2].href = getMediaFileUrl(mediafile);
                    nodes[2].attr({download: [mediafile.tag,mediafile.filename].join('_')});
                }
            });
            
            if ( node.C.tagFile.basic ) {
                node.V.strName.val = node.C.tagFile.basic.filename;
                node.V.strSize.val = node.C.tagFile.basic.size;
                node.V.strSize.href = getMediaFileUrl(node.C.tagFile.basic);
                node.V.strSize.attr({download: 'basic_'+node.C.tagFile.basic.filename});
            }
            
            
        }, {
            selector: {media_id:['=',val]}
        });
    }
    
    
    node.C.selector.onchange = function(ev) {
        var file = ev.target.files[0];
        var reader = new FileReader();
        
        
        reader.onloadend = function(ev) {
            var dataUri = reader.result;
            
            var img = cr('img').attr({src:dataUri});
            readerGlob.ref.getImageDimetionsCallback(img, f(dims) {
                
                if ( !data.nosizecheck && !CONF.project.disableImageSizeCheck && ( dims.width < minDims[0] || dims.height < minDims[1] ) ) {
                    SYS.notify(node.V.minDimsMsg.val,'red center');
                    return 0;
                }
                
                if ( file ) {
                    if ( node.C.media_id ) {
                        node.F.recalcImages(file);
                    } else {
                        ORM.prep('mediatype_'+data.type, function(mediatype) {
                            ORM.req('media:insert', {mediatype_id:mediatype.id}, function(media) {
                                node.C.media_id = media[0].id;
                                node.V.input.C._emitUpdated();
                                node.F.recalcImages(file);
                            })
                        });
                    }
                }
                
            });
            
            
        }
        reader.onerror = log;
        reader.readAsDataURL(file);
    }
    
    
    $P(node.V.input, 'val', function() { return node.C.media_id; }, function(val) {
        if ( val ) {
            node.C.media_id = val;
            node.F.refreshImages();
        }
    })
    
    return node;
}



















