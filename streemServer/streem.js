    /**
    * 1. install nodejs from https://nodejs.org/en/download/
    * 2. run `npm install -g serve-static filehandler serve-index` in terminal
    * 3. run `node mediaserver.js`
    */
   var http = require('http'),
   fs = require('fs'),
   util = require('util'),
   url = require('url'),
   path = require('path'),
   serveStatic = require('serve-static'),
   finalhandler = require('finalhandler'),
   ip = require('ip');
// var serveIndex = require('serve-index')
// var port = 1337;
// var serve = serveStatic(__dirname + '/');
// var index = serveIndex(__dirname + '/', {
//    'icons': true
// });




function returnMedia(fpath, req, res, stat) {
   var total = stat.size;
   var ext = path.extname(fpath).slice(1);
   if (req.headers['range']) {
       var range = req.headers.range;
       var parts = range.replace(/bytes=/, "").split("-");
       var partialstart = parts[0];
       var partialend = parts[1];
       var start = parseInt(partialstart, 10);
       var end = partialend ? parseInt(partialend, 10) : total - 1;
       var chunksize = (end - start) + 1;
       console.log('RANGE: ' + start + ' - ' + end + ' = ' +
           chunksize);
       var file = fs.createReadStream(fpath, {
           start: start,
           end: end
       });
       res.writeHead(206, {
           'Content-Range': 'bytes ' + start + '-' + end +
               '/' + total,
           'Accept-Ranges': 'bytes',
           'Content-Length': chunksize,
           'Content-Type': 'video/' + ext
       });
       file.pipe(res);
   } else {
       console.log('ALL: ' + total);
       res.writeHead(200, {
           'Content-Length': total,
           'Content-Type': 'video/' + ext
       });
       fs.createReadStream(fpath).pipe(res);
   }
}

exports.getVideo = function(req, res){


    // var path = 'assets/SampleVideo_1280x720_1mb.mp4';
    const path = 'assets/SampleVideo_1280x720_10mb.mp4';

  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }

}


exports.getAudio = function(req, res){


    // var path = 'assets/SampleVideo_1280x720_1mb.mp4';
    const path = 'song/Nazar Na Lag Jaaye Video Song _ STREE _ Rajkummar Rao, Shraddha Kapoor _ Ash King.mp3';

  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }


}


exports.getfile = function(req, res){

    var urlParts = url.parse(req.url, true);
    var fpath = decodeURIComponent(urlParts.pathname.slice(1));
    try {
        var stat = fs.statSync(fpath);
    } catch (err) {
        console.log(err);
        return
    }
    if (stat.isDirectory()) {
        return index(req, res, finalhandler(req, res));
    } else {
        switch (path.extname(fpath)) {
            case '.avi':
            case '.webm':
            case '.gif':
            case '.ogg':
            case '.ogv':
            case '.mov':
            case '.mp4':
            case '.rmvb':
            case '.m4v':
            case '.mkv':
                return returnMedia(fpath, req, res, stat);
            default:
                return serve(req, res, finalhandler(req, res));
        }
    }
}

