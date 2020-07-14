const baseUrl = "https://api.football-data.org/v2";
import {loadAnimation} from "./display.js";

const getData = (url) => {
    $.ajaxSetup({
        headers: {
            'X-Auth-Token': '32d4ac15b1a14f44b89a4100858a78da'
        }
    });

    loadAnimation();

    return new Promise((resolve, reject) => {
        $.get(`${baseUrl}${url}`, (data) => {
            resolve(data);
        }, "json")
    })
}

const standings = (ligaId) => {
    return new Promise((resolve, reject) => {
        getData(`/competitions/${ligaId}/standings?standingType=TOTAL`)
            .then((data) => {
                resolve(data);
            })
    })
}

const match = (ligaId, status) => {
    return new Promise((resolve, reject) => {
        getData(`/competitions/${ligaId}/matches?status=${status.toUpperCase()}`)
            .then((data) => {
                resolve(data);
            })
    })
}

const team = (ligaId) => {
    return new Promise((resolve, reject) => {
        getData(`/competitions/${ligaId}/teams`)
            .then((data) => {
                resolve(data);
            });
    })
}

const descriptionTeam = (idTeam) => {
    return new Promise((resolve, reject) => {
        getData(`/teams/${idTeam}`)
            .then((data) => {
                resolve(data);
            })
    })
}

export {
    standings,
    match,
    team,
    descriptionTeam
};