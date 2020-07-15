import "./asset/script/jquery.js";
import { 
    team as printTeam,
    teamDescription as printTeamDescription 
} from "./asset/script/display.js";
import {
    getDbTeamById,
    getAllDbTeam,
    deleteTeam,
    saveTeam
} from "./asset/script/db.js";

import "./asset/script/script.js";

const seeDetails = (id) => {
    getDbTeamById(id)
        .then((data) => {
            printTeamDescription(data);

            $("#nav-mobile").html(`             
                <li>
                    <a href='./team.html'>
                        <i class='material-icons'>arrow_back</i>
                    </a>
                </li> 
            `);
        });
}

const getSavedTeam = () => {
    getAllDbTeam()
        .then((data) => {
            printTeam({ data: data, saved: true });
        })
        .then(() => {
            $(".read-more").each((key, more) => {
                $(more).click(() => {
                    const id = parseInt($(more).attr("href").substr(1));
                    seeDetails(id);
                });
            });
        });

}

$(document).ready(() => {
    getSavedTeam();
})