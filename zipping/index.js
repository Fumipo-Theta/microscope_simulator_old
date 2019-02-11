'use strict';

const AWS = require("aws-sdk");
AWS.config.update( { region: "eu-west-1" } );
const s3 = new AWS.S3( { apiVersion: '2006-03-01'} );

const   _archiver = require('archiver');

//This returns us a stream.. consider it as a real pipe sending fluid to S3 bucket.. Don't forget it
const streamTo = (_bucket, _key) => {
	var stream = require('stream');
	var _pass = new stream.PassThrough();
	s3.upload( { Bucket: _bucket, Key: _key, Body: _pass }, (_err, _data) => { /*...Handle Errors Here*/ } );
	return _pass;
};
      
exports.handler = async (_req, _ctx, _cb) => {
	var _keys = ['list of your file keys in s3'];
	
    var _list = await Promise.all(_keys.map(_key => new Promise((_resolve, _reject) => {
            s3.getObject({Bucket:'bucket-name', Key:_key})
                .then(_data => _resolve( { data: _data.Body, name: `${_key.split('/').pop()}` } ));
        }
    ))).catch(_err => { throw new Error(_err) } );

    await new Promise((_resolve, _reject) => { 
        var _myStream = streamTo('bucket-name', 'fileName.zip');		//Now we instantiate that pipe...
        var _archive = _archiver('zip');
        _archive.on('error', err => { throw new Error(err); } );
        
        //Your promise gets resolved when the fluid stops running... so that's when you get to close and resolve
        _myStream.on('close', _resolve);
        _myStream.on('end', _resolve);
        _myStream.on('error', _reject);
        
        _archive.pipe(_myStream);			//Pass that pipe to _archive so it can push the fluid straigh down to S3 bucket
        _list.forEach(_itm => _archive.append(_itm.data, { name: _itm.name } ) );		//And then we start adding files to it
        _archive.finalize();				//Tell is, that's all we want to add. Then when it finishes, the promise will resolve in one of those events up there
    }).catch(_err => { throw new Error(_err) } );
    
    _cb(null, { } );		//Handle response back to server
};