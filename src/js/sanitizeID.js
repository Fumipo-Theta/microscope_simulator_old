export default function sanitizeID(id) {
    return id.replace(/\//g, "_").replace(/\./g, "")
}
