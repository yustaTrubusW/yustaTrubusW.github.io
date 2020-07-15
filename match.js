import "./asset/script/jquery.js";
import * as IDB from "./asset/script/db.js";
import { match as printMatch } from "./asset/script/display.js";
import "./asset/script/script.js";

const getSaveMatch = () => {
    IDB.getAllDbMatch()
        .then((data) => {
            $(".match-content").html("<h4 class='center col s12 no-data'>No data saved!</h4>");
            printMatch({ data: data, saved: true });
            if (data.length === 0) {
                $(".no-data").show();
            } else {
                $(".no-data").hide();
            }
        })
}
$(document).ready(() => {
    getSaveMatch();
})