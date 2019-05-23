"use strict";

self.window = self;
importScripts("/js/libwebp-0.2.0.min.js");

/**
 * @parameter {}: e
 * {
 *  e : data : {
 *          "binary" : Unit8Array
 *      }
 * }
 */
self.onmessage = async e => {
    const convertedImageData = await load(
        e.data.binary
    );
    self.postMessage(...createResponse(e, convertedImageData))
    e = null;
};

function createResponse(e, result) {
    return [
        Object.assign(
            { num: e.data.num },
            result
        ),
        [result.imageData.data.buffer]
    ]
}

async function load(webpBuffer) {

    let id, failed
    try {
        id = await decode(new Uint8Array(webpBuffer));
    } catch (e) {
        console.log("libwebpjs:" + e);
        id = new ImageData(1, 1);
        failed = true;
    }
    return { imageData: id, failed: failed }
}



function decode(bin) {
    return new Promise((res, rej) => {

        const decoder = new WebPDecoder();
        const config = decoder.WebPDecoderConfig;
        const buffer = config.j;
        const stream = config.input;
        decoder.WebPInitDecoderConfig(config)
        decoder.WebPGetFeatures(bin, bin.length, stream)
        buffer.J = 4;
        const sattus = decoder.WebPDecode(bin, bin.length, config)

        const bitmap = buffer.c.RGBA.ma;

        const [w, h] = [buffer.width, buffer.height];

        const id = new ImageData(w, h);
        const data = new Uint8Array(id.data.buffer);
        for (let i = 0, len = w * h; i < len; i++) {
            const pos = i * 4;
            data[pos] = bitmap[pos + 1];
            data[pos + 1] = bitmap[pos + 2];
            data[pos + 2] = bitmap[pos + 3];
            data[pos + 3] = bitmap[pos];
        }
        res(id);
    })
};
