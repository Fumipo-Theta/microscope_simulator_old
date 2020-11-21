import StaticManager from "./StaticManager.js";

/**
 * TODO split these config as different objects
 *
 * - Package list endpoint
 * - Package CDN endpoint
 * - Cache DB version name
 * - Cache DB table name
 */

const compileEnv = process.env.NODE_ENV

console.info("config.js: compileEnv: ", compileEnv)

const packageListEndpoint = compileEnv == "production"
    ? "https://d3uqzv7l1ih05d.cloudfront.net/rock_list.json"
    : "../../image_package_s3_root/rock_list.json"
const packageCdnEndpoint = compileEnv == "production"
    ? "https://d3uqzv7l1ih05d.cloudfront.net/packages/"
    : "../../image_package_s3_root/packages/"

export const staticSettings = new StaticManager(
    packageListEndpoint,
    packageCdnEndpoint,
    "db_v3",
    "files"
)


export const VIEW_PADDING = 0 // px
