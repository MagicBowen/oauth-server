const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');
const logger = require('./logger').logger('staticfile');

function staticFiles(url, dir, prefix) {
    return async (ctx, next) => {
        let orgRpath = ctx.request.path;
        let rpath= orgRpath.replice(prefix,'')
        logger.info('rpath is ',orgRpath, rpath)
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            logger.info('path is ',fp)
            if (await fs.exists(fp)) {
                ctx.response.type = mime.getType(rpath);
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    };
}

module.exports = staticFiles;