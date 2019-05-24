
export default function deleteOldVersionDatabase() {
    indexedDB.deleteDatabase("db_v2");
    indexedDB.deleteDatabase("zipfiles");
}
