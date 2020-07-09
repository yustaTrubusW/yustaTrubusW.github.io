import "./asset/script/jquery.js";
import IDB from "./asset/script/db.js";
import "./asset/script/script.js";

const getSaveMatch = () => {
    IDB.getAllDbMatch()
        .then((data) => {
            $("#content").html("");
            $.each(data, (key, match) => {
                const localDate = new Date(match.utcDate).toString().slice(3, 21);
                let scoreHome = match.score.fullTime.homeTeam;
                let scoreAway = match.score.fullTime.awayTeam;
                if (scoreHome === null) {
                    scoreHome = "-";
                }
                if (scoreAway === null) {
                    scoreAway = "-";
                }
                $("#content").prepend(` 
                    <div class="col s12 xl6">
                        <div class="card card-position">
                            <div class="card-content">
                                <div class="row">
                                    <div class="col s4"><b>${match.status}</b></div>
                                    <div class="col s6">${localDate}</div>
                                    <div class="col s2 valign-wrapper">
                                        <input type="checkbox" id="${key}">
                                        <label for="${key}" id="save-btn${key}" class="save">
                                            <i class="material-icons">bookmark</i>
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

                $(`#${key}`).change(() => {
                    if (!($(`#${key}`).prop("checked"))) {
                        IDB.deleteMatch(data[key].id);
                        M.toast({ html: 'Removed!', classes: 'rounded' });
                        getSaveMatch();
                    }
                });

                $(`#${key}`).prop('checked', true);

            });
            if (data.length === 0 || $("#content").html() === "") {
                $("#content").html("<h4 class='center col s12'>No data saved!</h4>");
            }
        })
}

$(document).ready(() => {
    getSaveMatch();
})