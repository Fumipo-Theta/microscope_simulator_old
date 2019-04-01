

class ImageDecoder {
    constructor() {
        this.webp = new Webp()
        this.supportWebp = detectWebpSupport;
        const canvas = document.createElement("canvas")
        this.canvas = canvas
    }

    /** decode
     *
     * @param {Uint8Array} u8array
     * @param {String} type
     * @return {Promise<string>}
     */
    async decode(u8array, type = "webp") {

        //if (this.busy) throw new Error("webp-machine decode error: busy")
        this.busy = true

        if (await this.supportWebp() || type !== "webp") {
            var binary = '';
            var len = u8array.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(u8array[i]);
            }
            return `data:image/${type};base64,` + window.btoa(binary);
        }

        try {
            await relax()
            this.webp.setCanvas(this.canvas)
            this.webp.webpToSdl(u8array, u8array.length)
            this.busy = false
            return this.canvas.toDataURL("image/jpeg")
        }
        catch (error) {
            this.busy = false
            error.message = `webp-machine decode error: ${error.message}`
            throw error
        }
    }
}

class ImageDecoderWorker {
    constructor() {
        this.supportWebp = detectWebpSupport;
        const canvas = document.createElement("canvas")
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d");
        this.worker = new Worker("/js/decode_webp_worker.js");
        this.storage = {}
        this.cnt = 0
        this.resolves = {}
        this.rejects = {}
    }

    async decode(u8array, type = "webp") {

        if (await this.supportWebp() || type !== "webp") {
            var binary = '';
            var len = u8array.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(u8array[i]);
            }
            return `data:image/${type};base64,` + window.btoa(binary);
        }


        return new Promise((res, rej) => {
            this.resolves[this.cnt] = res


            //let sharedAb = new SharedArrayBuffer(u8array.byteLength)
            //let sharedU8 = new Uint8Array(sharedAb)
            //sharedU8.set(u8array, 0)

            this.worker.onmessage = e => {
                const id = e.data.imageData;
                const num = e.data.num
                const resolve = this.resolves[num]
                delete this.resolves[num]
                if (e.data.failed) {
                    console.warn("WebP image convert failed")
                }
                this.canvas.width = id.width;
                this.canvas.height = id.height;
                this.ctx.putImageData(id, 0, 0);
                //sharedAb = null
                //sharedU8 = null
                resolve(this.canvas.toDataURL("image/jpeg"))
            }
            this.worker.postMessage(
                {
                    binary: u8array,
                    num: this.cnt
                },
                //[sharedAb]
            )
            this.cnt++;
        })

    }
}


async function polyfillWebp(name_file, i, a) {
    const [name, file] = name_file;
    const imageDecoder = new ImageDecoder()

    if (name.includes(".json")) {
        return [name, file]
    } else {
        const type = name.match(/.*\.(\w+)$/)[1]
        const base64 = await imageDecoder.decode(file, type)
        const mime = base64.match(/^data:(image\/\w+);/)[1]
        const mime_type = mime.split("/")[1]

        const new_file_name = name.split(".")[0] + "." + mime_type
        return [new_file_name, new Uint8Array(base64ToArrayBuffer(base64.split(",")[1]))]
    }
}
