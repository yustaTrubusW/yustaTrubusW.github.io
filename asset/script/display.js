import {
    deleteTeam,
    deleteMatch,
    saveTeam,
    saveMatch,
    checkSaveTeam,
    checkSaveMatch
} from "./db.js";

// forcibly changing the http url to https
const changeUrl = (url) => {
    if (url !== null || "") {
        return url.replace(/^http:\/\//i, 'https://');
    }
}

// to replace broken image with default image
const imageError = () => {
    $("img").on("error", (event) => {
        $(event.target).attr("src", "./asset/img/error.png");
    });
}

const loadAnimation = () => {
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

const standings = (data) => {
    let content = `<h4 id='liga-title' class='col s12 center'>${data.competition.name}</h4>`;

    $.each(data.standings, (index, standing) => {
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
            const url = changeUrl(table.team.crestUrl);
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
    imageError();
}

const match = ({ data, saved = false }) => {
    let matchData;
    let toast = "";
    $(".match-content").html("");

    if (saved === true) {
        matchData = data;
        toast = `<button class="btn-flat toast-action action">Undo</button>`
    } else {
        matchData = data.matches;
    }

    $.each(matchData, (key, match) => {
        // mengambil image logo team
        let scoreHome = match.score.fullTime.homeTeam;
        let scoreAway = match.score.fullTime.awayTeam;

        if (scoreHome === null) {
            scoreHome = "-";
        }
        if (scoreAway === null) {
            scoreAway = "-";
        }

        const localDate = new Date(match.utcDate).toString().slice(3, 21);
        $(".match-content").prepend(` 
            <div class="col s12 xl6" id="card${key}">
                <div class="card card-position">
                    <div class="card-content">
                        <div class="row">
                            <div class="col s4"><b>${match.status}</b></div>
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
                            <div class="col s5 center-align  grey lighten-5">${match.homeTeam.name}</div>
                            <div class="col s2 center-align  grey lighten-5"></div>
                            <div class="col s5 center-align  grey lighten-5">${match.awayTeam.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        checkSaveMatch(match.id)
            .then((val) => {
                if (val) {
                    $(`#${key}`).prop('checked', true);
                    $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark</i>`);
                }
            })
            .then(() => {
                $(`#${key}`).change(() => {
                    const undo = matchData[key];
                    if ($(`#${key}`).prop("checked")) {
                        M.Toast.dismissAll();
                        M.toast({ html: `Saved! ${toast}`, classes: 'rounded' });
                        saveMatch(match);
                        $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark</i>`);
                    } else {
                        M.Toast.dismissAll();
                        M.toast({ html: `Removed! ${toast}`, classes: 'rounded' });
                        deleteMatch(match.id);
                        $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark_border</i>`);

                        if (saved === true) {
                            $(`#card${key}`).hide('slow');
                        }
                    }

                    $(".action").click(() => {
                        $(`#card${key}`).show('slow');
                        saveMatch(undo);
                        $(".no-data").hide();
                        $(`#${key}`).prop('checked', true);
                        $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark</i>`);
                    })
                });
            })
    });

    if (saved === false) {
        $(".match-content").prepend(`
        <h4 class="center-align col s12 grey lighten-5">
            ${data.competition.name}
        </h4>`);
    }
}

const team = ({ data, saved = false }) => {
    let teamContent = "";
    let dataTeam = data;
    if (!saved) {
        teamContent = `<h4 class="center-align col s12 grey lighten-5">${data.competition.name}</h4>`;
        dataTeam = data.teams;
    }

    $.each(dataTeam, (key, team) => {
        const url = changeUrl(team.crestUrl);
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
                        <a class="read-more" href="#${team.id}">Read More</a>
                    </div>
                </div>  
            </div>
        `;

    });

    $("#team-content").html(teamContent);
    imageError();
}

const teamDescription = (data) => {
    let description = `
        <h5 style="margin:0" class="col s12 light center grey-text text-darken-3">
            <img style="width:50px;vertical-align:middle" src="${changeUrl(data.crestUrl)}">
            <b>${data.name}</b>
        </h5>
        <p align="center" class="col s12" style="margin:0">
            Short Name : ${data.shortName}</br>
            Founded : ${data.founded}<br>
            Club Colors : ${data.clubColors}<br>
            Venue : ${data.venue}
        </p>
        
        <div class="col s12 card">
        <h6 class="col s11 center-align grey lighten-5">Squad</h6>
        <h6 class="col s1 valign-wrapper">
            <input type="checkbox" id="save">
            <label for="save" id="save-btn" class="save">
                <i class="material-icons">bookmark_border</i>
            </label>
        </h6>
            <table class="striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
    `;

    $.each(data.squad, (key, player) => {
        let position = player.position;
        if (position === null) {
            position = "-";
        }
        description += ` 
            <tr>
                <td>${player.name}</td>
                <td>${position}</td>
                <td>${player.role.replace('_', ' ')}</td>
            </tr>
        `;
    })

    description += "</tbody></table>";
    imageError();
    $("#team-content").html(description);

    checkSaveTeam(data.id)
        .then((val) => {
            if (val) {
                $("#save").prop('checked', true);
                $("#save-btn").html(`<i class="material-icons save">bookmark</i>`);
            }
        })
        .then(() => {
            $("#save").change(() => {
                if ($(`#save`).prop("checked")) {
                    M.Toast.dismissAll();
                    M.toast({ html: 'Saved!', classes: 'rounded' });
                    $("#save-btn").html(`<i class="material-icons save">bookmark</i>`);
                    saveTeam(data);
                } else {
                    M.Toast.dismissAll();
                    M.toast({ html: 'Removed!', classes: 'rounded' });
                    $("#save-btn").html(`<i class="material-icons save">bookmark_border</i>`);
                    deleteTeam(data.id);
                }
            });
        });
}


export {
    loadAnimation,
    teamDescription,
    standings,
    match,
    team
}