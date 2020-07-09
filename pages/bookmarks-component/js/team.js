import "../../../asset/script/jquery.js";
import IDB from "../../../asset/script/db.js";
import api from "../../../asset/script/api.js";
import "../../../asset/script/script.js";

const seeDetails = (id) => {
    IDB.getDbTeamById(id)
        .then((data) => {
            console.log(data);
            console.log(id);
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

            $("#content").html(` 
	            <h4 class="card-title col s11 center-align grey lighten-5">${data.name}</h4>
	            <h4 class="col s1 valign-wrapper">
	                <input type="checkbox" id="save">
	                <label for="save" id="save-btn" class="save"><i class="material-icons">bookmark</i></label>
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
            `);

            $("#nav-mobile").html(`             
            	<li>
                    <a href='./team.html'>
                        <i class='material-icons'>arrow_back</i>
                    </a>
                </li> 
                `);
            $("#save").prop('checked', true);
            $("#save").change(() => {
                if ($(`#save`).prop("checked")) {
                    M.toast({ html: 'Saved!', classes: 'rounded' });
                    $("#save-btn").html(`<i class="material-icons save">bookmark</i>`);
                    IDB.saveTeam(data);
                } else {
                    $("#save-btn").html(`<i class="material-icons save">bookmark_border</i>`);
                    IDB.deleteTeam(data.id);
                    M.toast({ html: 'Removed!', classes: 'rounded' });
                }
            });
        });
}

const getSavedTeam = () => {
    IDB.getAllDbTeam()
        .then((data) => {
            if (data.length === 0) {
                $("#content").html("<h4 class='center col s12'>No data saved!</h4>");
            }
            $.each(data, (key, team) => {
                const url = api.changeUrl(team.crestUrl);
                $("#content").prepend(` 
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
				`);
            })

            api.imageError();
        })
        .then(() => {
            $(".more").each((key, button) => {
                $(button).click(() => {
                    const id = parseInt($(button).attr("href").substr(1));
                    seeDetails(id);
                })
            })
        })
}

$(document).ready(() => {
    getSavedTeam();
})