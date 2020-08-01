// This should be method of DB handler class
export default function deleteOldVersionDatabase() {
    indexedDB.deleteDatabase("db_v2");
    indexedDB.deleteDatabase("zipfiles");
}
