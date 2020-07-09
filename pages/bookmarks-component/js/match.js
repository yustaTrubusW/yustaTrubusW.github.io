import "../../../asset/script/jquery.js";
import IDB from "../../../asset/script/db.js";
import "../../../asset/script/script.js";

const getSaveMatch = () => {
    IDB.getAllDbMatch()
        .then((data) => {
            if (data.length === 0) {
                $("#content").html("<h4 class='center col s12'>No data saved!</h4>");
            }
            $.each(data, (key, match) => {
                const localDate = new Date(match.utcDate).toString().slice(0, 24);
                $("#content").prepend(` 
					<div class="col s12 xl6">
	                    <div class="card card-position">
	                        <div class="card-content">
	                            <div class="row">
	                                <div class="col s1 valign-wrapper">
	                                    <input type="checkbox" id="${key}">
	                                    <label for="${key}" id="save-btn${key}" class="save"><i class="material-icons">bookmark</i></label>
	                                </div>
	                                <div class="col s12 center-align">${match.status}</div>
	                                <div class="col s12 center-align">${localDate}</div>
	                                <div class="col s4 center-align grey lighten-5">Home Team</div>
	                                <div class="col s4 center-align grey lighten-5"></div>
	                                <div class="col s4 center-align grey lighten-5">Away Team</div>
	                                <div class="col s4 center-align">${match.score.fullTime.homeTeam}</div>
	                                <div class="col s4 center-align">VS</div>
	                                <div class="col s4 center-align">${match.score.fullTime.awayTeam}</div>
	                                <div class="col s4 center-align  grey lighten-5">${match.homeTeam.name}</div>
	                                <div class="col s4 center-align  grey lighten-5"></div>
	                                <div class="col s4 center-align  grey lighten-5">${match.awayTeam.name}</div>
	                            </div>
	                        </div>
	                    </div>
	                </div>
					`);

                $(`#${key}`).change(() => {
                    if ($(`#${key}`).prop("checked")) {
                        IDB.saveMatch(data[key]);
                        M.toast({ html: 'Saved!', classes: 'rounded' });
                        $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark</i>`);
                    } else {
                        $(`#save-btn${key}`).html(`<i class="material-icons save">bookmark_border</i>`);
                        IDB.deleteMatch(data[key].id);
                        M.toast({ html: 'Removed!', classes: 'rounded' });
                    }
                });

                $(`#${key}`).prop('checked', true);
            })
        })
}

$(document).ready(() => {
    getSaveMatch();
})