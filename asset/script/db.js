import "./idb.js";

const openDbMatch = idb.open("Match", 1, (upgradeDb) => {
    const articlesObjectStore = upgradeDb.createObjectStore("match", { keyPath: "id" });
});

const openDbTeam = idb.open("Team", 1, (upgradeDb) => {
    const articlesObjectStore = upgradeDb.createObjectStore("team", { keyPath: "id" });
});

const IDB = {
    saveMatch: (match) => {
        openDbMatch.then((db) => {
            const tx = db.transaction("match", "readwrite");
            const store = tx.objectStore("match");
            store.add(match);
            return tx.complete;
        })
    },

    deleteMatch: (matchId) => {
        openDbMatch.then((db) => {
            const tx = db.transaction("match", "readwrite");
            const store = tx.objectStore("match");
            store.delete(matchId);
            return tx.complete;
        })
    },

    checkSaveMatch: (matchId) => {
        return new Promise((resolve, reject) => {
            openDbMatch.then(function(db) {
                const tx = db.transaction("match", "readonly");
                const store = tx.objectStore("match");
                return store.get(matchId);
            }).then((val) => {
                resolve(val);
            });
        })
    },

    saveTeam: (match) => {
        openDbTeam.then((db) => {
            const tx = db.transaction("team", "readwrite");
            const store = tx.objectStore("team");
            store.add(match);
            return tx.complete;
        })
    },

    deleteTeam: (matchId) => {
        openDbTeam.then((db) => {
            const tx = db.transaction("team", "readwrite");
            const store = tx.objectStore("team");
            store.delete(matchId);
            return tx.complete;
        })
    },

    checkSaveTeam: (matchId) => {
        return new Promise((resolve, reject) => {
            openDbTeam.then(function(db) {
                const tx = db.transaction("team", "readonly");
                const store = tx.objectStore("team");
                return store.get(matchId);
            }).then((val) => {
                resolve(val);
            });
        })
    },

    getAllDbMatch: () => {
        return new Promise((resolve, reject) => {
            openDbMatch
                .then((db) => {
                    const tx = db.transaction("match", "readonly");
                    const store = tx.objectStore("match");
                    return store.getAll();
                })
                .then((match) => {
                    resolve(match);
                });
        });
    },

    getAllDbTeam: () => {
        return new Promise((resolve, reject) => {
            openDbTeam
                .then((db) => {
                    const tx = db.transaction("team", "readonly");
                    const store = tx.objectStore("team");
                    return store.getAll();
                })
                .then((team) => {
                    resolve(team);
                });
        });
    },

    getDbTeamById: (id) => {
        return new Promise((resolve, reject) => {
            openDbTeam
                .then((db) => {
                    const tx = db.transaction("team", "readonly");
                    const store = tx.objectStore("team");
                    return store.get(id);
                })
                .then((team) => {
                    resolve(team);
                });
        });
    }
}

export default IDB;