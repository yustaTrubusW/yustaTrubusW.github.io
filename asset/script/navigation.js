import * as api from "./api.js";
import * as print from "./display.js";

let ligaId = "2001";
let page = "standing";
let filter = "";

const tabInit = () => {
    $(document).ready(function() {
        M.Tabs.init($(".tabs"));

        tabMenu("standing", ligaId);
        api.standings(2001)
            .then(data => {
                print.standings(data);
            });
    });

    $(".tab-menu").each((key, tab) => {
        $(tab).click(() => {
            page = $(tab).attr("href").substr(1);
            tabMenu(page, ligaId);
        });
    });
}

const tabMenu = (page, ligaId) => {
    if (page === "standing") {
        api.standings(ligaId)
            .then(data => {
                print.standings(data);
            });
    } else if (page === "match") {
        api.match(ligaId, "")
            .then(data => {
                print.match(data);
            });
    } else {
        api.team(ligaId)
            .then(data => {
                print.team(data);
            });
    }

}

const choseCompetition = () => {
    $(".button").each((key, button) => {
        $(button).click(() => {
            ligaId = $(button).attr("id");
            if (page === "match") {
                api.match(ligaId, filter)
                    .then(data => {
                        print.match(data);
                    });
            } else if (page === "team") {
                api.team(ligaId)
                    .then(data => {
                        print.team(data);
                    });
            } else {
                api.standings(ligaId)
                    .then(data => {
                        print.standings(data);
                    });
            }
        });

    });
}

const filterMatch = () => {
    $(".filter").each((key, checked) => {
        $(checked).click(() => {
            filter = $(checked).val();
            api.match(ligaId, filter)
            .then(data =>{
                print.match(data);
            });
        })
    })
}

const onHome = () => {
    choseCompetition();
    tabInit();
    tabMenu();
    filterMatch();
}

const loadPage = (page) => {
    $.get(`./pages/${page}.html`, (data) => {
        $("#content").html(data);
    }, "html").done(() => {
        // mendeklarasikan fungsi dari tiap tombol yang ada di halaman home
        if (page === "home") {
            onHome();;
        }
    });
}

const loadNav = () => {
    $.get("./pages/nav.html", (data) => {
        $(".topnav").html(data);
    }, "html").done(() => {
        $(".menu-btn").each((key, nav) => {
            $(nav).click(() => {
                const page = $(nav).attr("href").substr(1);
                loadPage(page);
            })
        })
    });
};

$(window).on("load", () => {
    loadNav();
});

$(document).ready(() => {
    loadPage("home");
    const elems = $('.fixed-action-btn');
    const instances = M.FloatingActionButton.init(elems, {
        hoverEnabled: false
    });
});