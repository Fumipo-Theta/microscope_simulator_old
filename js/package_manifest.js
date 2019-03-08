class PackageManifest {
    constructor() {
        this.packageID = null
        this.location = {}
        this.rockType = {}
        this.discription = {}
        this.geoSystem = ""
        this.geoPosition = [null, null]
        this.rotateCenter = [undefined, undefined]
        this.rotateDirection = "clockwise"
        this.imageSize = { "width": 0, "height": 0 }
    }

    toJSON() {
        return {
            "location": this.getSampleLocation(),
            "geographic-coordinate": this.getGeoLocation(),
            "magnify": this.getMagnify(),
            "scale-unit": this.getScaleUnit(),
            "scale-pixel": this.getScalePixel(),
            "image_width": this.getImageWidth(),
            "image_height": this.getImageHeight(),
            "rotate_center": this.getRotateCenter(),
            "cycle_rotate_degree": this.getRotateSectionDegree(),
            "rotate_clockwise": this.isRotateClockwise(),
            "rotate_by_degree": this.getEachRotateDegree(),
            "rock_type": this.getRockType(),
            "owner": this.getOwner(),
            "discription": this.getDiscription()
        }
    }

    setPackageID(id) {
        this.packageID = id
        return this
    }

    getPackageID() {
        return this.packageID.replace(/\//g, "_").replace(/\./g, "")
    }

    setSampleLocation(lang, disc) {
        this.location[lang] = disc;
        return this
    }

    getSampleLocation() {
        return this.location;
    }

    setLocation(system, v1, v2) {
        this.geoSystem = system,
            this.geoPosition = [v1, v2]
        return this
    }

    getGeoLocation() {
        return {
            "system": this.geoSystem,
            "position": {
                "latitude": this.geoPosition[0],
                "longitude": this.geoPosition[1]
            }
        }
    }

    setMagnify(magnificationValue) {
        this.magnify = magnificationValue
        return this
    }

    getMagnify() {
        return this.magnify
    }

    setScaleUnit(scaleUnit) {
        this.scaleUnit = scaleUnit;
        return this
    }

    getScaleUnit() {
        return this.scaleUnit
    }

    setScalePixel(scaleLengthAsPixel) {
        this.scalePixel = scaleLengthAsPixel
        return this
    }

    getScalePixel() {
        return this.scalePixel
    }

    setImageSize(img) {
        this.imageSize = {
            "width": img.width,
            "height": img.height
        }
        return this
    }

    getImageWidth() {
        return this.imageSize.width
    }

    getImageHeight() {
        return this.imageSize.height
    }

    setRotateCenter(fromleft, fromtop) {
        this.rotateCenter = [fromleft, fromtop]
        return this
    }

    getRotateCenter() {
        return [
            this.rotateCenter[0] === undefined
                ? this.getImageWidth() * 0.5
                : this.rotateCenter[0],
            this.rotateCenter[1] === undefined
                ? this.getImageHeight() * 0.5
                : this.rotateCenter[1]
        ]
    }

    setImagesNumber(value) {
        this.imagesNumber = value
        return this
    }

    getImagesNumber() {
        return this.imagesNumber
    }

    getRotateSectionDegree() {
        return this.getEachRotateDegree() * (this.getImagesNumber() - 1)
    }

    setRotateDirection(direction) {
        this.rotateDirection = direction
        return this
    }

    isRotateClockwise() {
        return this.rotateDirection === "clockwise"
    }

    setEachRotateDegree(degree) {
        this.eachRotateDigree = degree
        return this
    }

    getEachRotateDegree() {
        return this.eachRotateDigree
    }

    setRockType(lang, disc) {
        this.rockType[lang] = disc
        return this
    }

    getRockType() {
        return this.rockType
    }

    setOwner(disc) {
        this.owner = disc
        return this
    }

    getOwner() {
        return this.owner
    }

    setDiscription(lang, disc) {
        this.discription[lang] = disc
        return this
    }

    getDiscription() {
        return this.discription
    }
}
