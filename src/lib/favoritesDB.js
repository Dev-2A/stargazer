import { openDB } from "idb";

const DB_NAME = "stargazer";
const DB_VERSION = 1;
const STORE = "favorites";

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("createdAt", "createdAt");
        }
      },
    });
  }
  return dbPromise;
}

/**
 * 즐겨찾기 추가.
 * @param {{ label: string, observer: {lat:number, lon:number, name:string}, timeMs: number, live: boolean }} fav
 * @returns {Promise<number>} 생성된 id
 */
export async function addFavorite(fav) {
  const db = await getDB();
  return db.add(STORE, { ...fav, createdAt: Date.now() });
}

/** 전체 즐겨찾기 (최신순) */
export async function getFavorites() {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORE, "createdAt");
  return all.reverse(); // 최신이 위로
}

/** id로 삭제 */
export async function deleteFavorite(id) {
  const db = await getDB();
  return db.delete(STORE, id);
}
