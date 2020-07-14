import "./idb.js";

const openDbMatch = idb.open("Match", 1, (upgradeDb) => {
    const articlesObjectStore = upgradeDb.createObjectStore("match", { keyPath: "id" });
});

const openDbTeam = idb.open("Team", 1, (upgradeDb) => {
    const articlesObjectStore = upgradeDb.createObjectStore("team", { keyPath: "id" });
});

const saveMatch = (match) => {
    openDbMatch.then((db) => {
        const tx = db.transaction("match", "readwrite");
        const store = tx.objectStore("match");
        store.add(match);
        return tx.complete;
    })
}

const deleteMatch = (matchId) => {
    openDbMatch.then((db) => {
        const tx = db.transaction("match", "readwrite");
        const store = tx.objectStore("match");
        store.delete(matchId);
        return tx.complete;
    })
}

const checkSaveMatch = (matchId) => {
    return new Promise((resolve, reject) => {
        openDbMatch.then(function(db) {
            const tx = db.transaction("match", "readonly");
            const store = tx.objectStore("match");
            return store.get(matchId);
        }).then((val) => {
            resolve(val);
        });
    })
}

const saveTeam = (match) => {
    openDbTeam.then((db) => {
        const tx = db.transaction("team", "readwrite");
        const store = tx.objectStore("team");
        store.add(match);
        return tx.complete;
    })
}

const deleteTeam = (matchId) => {
    openDbTeam.then((db) => {
        const tx = db.transaction("team", "readwrite");
        const store = tx.objectStore("team");
        store.delete(matchId);
        return tx.complete;
    })
}

const checkSaveTeam = (matchId) => {
    return new Promise((resolve, reject) => {
        openDbTeam.then(function(db) {
            const tx = db.transaction("team", "readonly");
            const store = tx.objectStore("team");
            return store.get(matchId);
        }).then((val) => {
            resolve(val);
        });
    })
}

const getAllDbMatch = () => {
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
}


const getAllDbTeam = () => {
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
}

const getDbTeamById = (id) => {
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

export {
    saveMatch,
    saveTeam,
    checkSaveMatch,
    checkSaveTeam,
    deleteTeam,
    deleteMatch,
    getAllDbMatch,
    getAllDbTeam,
    getDbTeamById
};