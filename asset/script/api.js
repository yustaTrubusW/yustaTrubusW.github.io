import IDB from "./db.js";
import ligaId from "./navigation.js";
const baseUrl = "https://api.football-data.org/v2";

const getData = (url) => {
    $.ajaxSetup({
        headers: {
            'X-Auth-Token': '32d4ac15b1a14f44b89a4100858a78da'
        }
    });

    animationLoad();

    return new Promise((resolve, reject) => {
        $.get(`${baseUrl}${url}`, (data) => {
            resolve(data);
        }, "json")
    })
}

const animationLoad = () => {
    $(".load").html(` 
        <div class="preloader-wrapper small active loading">
          <div class="spinner-layer spinner-blue">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>

          <div class="spinner-layer spinner-red">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>

          <div class="spinner-layer spinner-yellow">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>

          <div class="spinner-layer spinner-green">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
    `);
}

const api = {
    changeUrl: (url) => {
        if (url !== null || "") {
            return url.replace(/^http:\/\//i, 'https://');
        }
    },

    imageError: () => {
        $("img").on("error", (event) => {
            $(event.target).attr("src", "./asset/img/error.png");
        });
    },

    loadStanding: (ligaId) => {
        const component = (data) => {
            $("#liga-title").html(data.competition.name);
            let content = "";

            $.each(data.standings, (i, standing) => {
                if (standing.group) {
                    content += `
                        <div class="col s12 blue-grey lighten-5 center-align group">
                            ${standing.group.replace('_', ' ')}
                        </div>`;
                } else {
                    content += `
                        <div class="col s12 blue-grey lighten-5 center-align group">
                            ${standing.stage.replace('_', ' ')}
                        </div>`;
                }

                content += ` 
                <table style="font-size:12px;" class="striped">
                    <thead>
                        <tr>
                            <th colspan="2">TEAM</th>
                            <th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                    `;

                $.each(standing.table, (x, table) => {
                    const url = api.changeUrl(table.team.crestUrl);
                    content += `  
                    <tr>
                        <td>
                            <img class="logo-team" src="${url}" alt="logo team"/>
                        </td>
                        <td><b>${table.team.name}</b></td>
                        <td>${table.playedGames}</td>
                        <td>${table.won}</td>
                        <td>${table.draw}</td>
                        <td>${table.lost}</td>
                        <td>${table.goalsFor}</td>
                        <td>${table.goalsAgainst}</td>
                        <td>${table.points}</td>
                    </tr>`;
                });
                content += "</tbody></table>";
            });
            $("#standing-item").html(content);
            api.imageError();
        }

        if ('caches' in window) {
            caches.match(`${baseUrl}/competitions/${ligaId}/standings?standingType=TOTAL`)
                .then((response) => {
                    if (response) {
                        response.json()
                            .then((data) => {
                                component(data);
                            })
                    }
                })
        }

        getData(`/competitions/${ligaId}/standings?standingType=TOTAL`)
            .then((data) => {
                component(data);
            })
    },

    loadMatch: (ligaId, status) => {
        const component = (data) => {
            $.each(data, (key, value) => {
                // mengambil image logo team
                let scoreHome = value.score.fullTime.homeTeam;
                let scoreAway = value.score.fullTime.awayTeam;
                if (scoreHome === null) {
                    scoreHome = "-";
                }
                if (scoreAway === null) {
                    scoreAway = "-";
                }
                const localDate = new Date(value.utcDate).toString().slice(3, 21);
                $(".match-content").prepend(` 
                <div class="col s12 xl6">
                    <div class="card card-position">
                        <div class="card-content">
                            <div class="row">
                                <div class="col s4"><b>${value.status}</b></div>
                                <div class="col s6">${localDate}</div>
                                <div class="col s2 valign-wrapper">
                                    <input type="checkbox" id="${key}">
                                    <label for="${key}" id="save-btn${key}" class="save">
                                        <i class="material-icons">bookmark_border</i>
                                    </label>
                                </div>
                                <div class="col s5 center-align grey lighten-5">Home Team</div>
                                <div class="col s2 center-align grey lighten-5"></div>
                                <div class="col s5 center-align grey lighten-5">Away Team</div>
                                <div class="col s5 center-align">${scoreHome}</div>
                                <div class="col s2 center-align">VS</div>
                                <div class="col s5 center-align">${scoreAway}</div>
                                <div class="col s5 center-align  grey lighten-5">${value.homeTeam.name}</div>
                                <div class="col s2 center-align  grey lighten-5"></div>
                                <div class="col s5 center-align  grey lighten-5">${value.awayTeam.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

                $(`#${key}`).change(() => {
                    if ($(`#${key}`).prop("checked")) {
                        M.Toast.dismissAll();
                        M.toast({ html: 'Saved!', classes: 'rounded' });
                        IDB.saveMatch(data[key]);
                        $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark</i>`);
                    } else {
                        $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark_border</i>`);
                        IDB.deleteMatch(data[key].id);
                        M.Toast.dismissAll();
                        M.toast({ html: 'Removed!', classes: 'rounded' });
                    }
                });

                IDB.checkSaveMatch(value.id)
                    .then((val) => {
                        if (val) {
                            $(`#${key}`).prop('checked', true);
                            $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark</i>`);
                        }
                    })
            });
        }

        // mengambil data dari cache
        if ('caches' in window) {
            caches.match(`${baseUrl}/competitions/${ligaId}/matches?status=${status.toUpperCase()}`)
                .then((response) => {
                    if (response) {
                        response.json()
                            .then((data) => {
                                $(".match-content").html("");
                                component(data.matches);
                                $(".match-content").prepend(`
                                <h4 class="center-align col s12 grey lighten-5">
                                    ${data.competition.name}
                                </h4>`);
                            })
                    }
                })
        }

        // mengambil data langsung dari internet
        getData(`/competitions/${ligaId}/matches?status=${status.toUpperCase()}`)
            .then((data) => {
                $(".match-content").html("");
                component(data.matches);
                $(".match-content").prepend(`
                <h4 class="center-align col s12 grey lighten-5">
                    ${data.competition.name}
                </h4>`);
            })
    },

    loadDecritionTeam: (idTeam) => {
        const component = (data) => {
            let squad = `
                <table>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Role</th>
                </tr>
            `;
            $.each(data.squad, (key, player) => {
                squad += ` 
                    <tr>
                        <td>${player.name}</td>
                        <td>${player.position}</td>
                        <td>${player.role}</td>
                    </tr>
                `;
            })

            $("#team-content").html(` 
            <h4 class="card-title col s11 center-align grey lighten-5">${data.name}</h4>
            <h4 class="col s1 valign-wrapper">
                <input type="checkbox" id="save">
                <label for="save" id="save-btn" class="save">
                    <i class="material-icons">bookmark_border</i>
                </label>
            </h4>
            <div class="col s12 card">
                <h6 class="col s12 center-align grey lighten-5">Team Information</h6>
                <table>
                    <tr>
                        <td>Short Name</td>
                        <td>${data.shortName}</td>
                    </tr>
                    <tr>
                        <td>Founded</td>
                        <td>${data.founded}</td>
                    </tr>
                    <tr>
                        <td>Website</td>
                        <td>${data.website}</td>
                    </tr>
                    <tr>
                        <td>Venue</td>
                        <td>${data.venue}</td>
                    </tr>
                </table>
            </div>
            <div class="col s12 card">
                <h6 class="col s12 center-align grey lighten-5">Squad</h6>
                ${squad}
                </table>
            </div>
            <a class="btn white-text waves-effect waves-light light-blue back">Back</a>
            `);

            $("#save").change(() => {
                if ($(`#save`).prop("checked")) {
                    M.Toast.dismissAll();
                    M.toast({ html: 'Saved!', classes: 'rounded' });
                    $("#save-btn").html(`<i class="material-icons save">bookmark</i>`);
                    IDB.saveTeam(data);
                } else {
                    M.Toast.dismissAll();
                    M.toast({ html: 'Removed!', classes: 'rounded' });
                    $("#save-btn").html(`<i class="material-icons save">bookmark_border</i>`);
                    IDB.deleteTeam(data.id);
                }
            });

            IDB.checkSaveTeam(data.id)
                .then((val) => {
                    if (val) {
                        $("#save").prop('checked', true);
                        $("#save-btn").html(`<i class="material-icons save">bookmark</i>`);
                    }
                })
        }

        if ('caches' in window) {
            caches.match(`${baseUrl}/teams/${idTeam}`)
                .then((response) => {
                    if (response) {
                        response.json()
                            .then((data) => {
                                component(data);
                            })
                    }
                })
                .then(() => {
                    $(".back").click(() => {
                        api.loadTeam(ligaId);
                    })
                })
        }

        getData(`/teams/${idTeam}`)
            .then((data) => {
                component(data);
            })
            .then(() => {
                $(".back").click(() => {
                    api.loadTeam(ligaId);
                })
            });
    },

    loadTeam: (ligaId) => {
        const component = (data) => {
            let teamContent = `<h4 class="center-align col s12 grey lighten-5">${data.competition.name}</h4>`;
            $.each(data.teams, (key, team) => {
                const url = api.changeUrl(team.crestUrl);
                teamContent += ` 
                <div class="col s10 m6 l4 offset-s1 offset-m">
                    <div class="card card-position">
                        <div class="image center">
                            <img class="logo" src="${url}" alt="footbal_logo_team"/>
                        </div>
                        <div class="card-content">
                            <div class="divider"></div>
                            <div class="team-name">
                                <span>${team.name}</span>
                            </div>
                            <img src="./asset/img/icon/founded.svg" class="icon" alt="team founded" />
                            <span>${team.founded}</span><br>
                            
                            <img src="./asset/img/icon/city.svg" class="icon" alt="team city" />
                            <span>${team.area.name}</span>
                        </div>
                        <div class="card-action right-align">
                            <a class="more" href="#${team.id}">Read More</a>
                        </div>
                    </div>  
                </div>
            `;

            });

            $("#team-content").html(teamContent);
            $(".more").each((key, more) => {
                $(more).click(() => {
                    api.loadDecritionTeam($(more).attr("href").substr(1));
                });
            });

            api.imageError();
        }

        if ('caches' in window) {
            caches.match(`${baseUrl}/competitions/${ligaId}/teams`)
                .then((response) => {
                    if (response) {
                        response.json()
                            .then((data) => {
                                component(data);
                            })
                    }
                })
        }

        getData(`/competitions/${ligaId}/teams`)
            .then((data) => {
                component(data);
            });
    }
}

export default api;