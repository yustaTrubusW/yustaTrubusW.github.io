import api from "./api.js";

let ligaId = "2001";
let url = "standing";
let filter = "";

const loadTabMenu = (page, ligaId) => {
    if (page == "standing") {
        api.loadStanding(ligaId);
    } else if (page == "match") {
        api.loadMatch(ligaId, "");
    } else {
        api.loadTeam(ligaId);
    }

}

const loadPage = (page) => {
    $.get(`./pages/${page}.html`, (data) => {
        $("#content").html(data);
    }, "html").done(() => {
        // mendeklarasikan fungsi dari tiap tombol yang ada di halaman home
        if (page == "home") {
            $(document).ready(function() {
                M.Tabs.init($(".tabs"), {
                    duration: 0
                });
                loadTabMenu("standing", ligaId);
                api.loadStanding(2001);
            });

            $(".button").each((key, button) => {
                $(button).click(() => {
                    ligaId = $(button).attr("id");
                    if (url == "match") {
                        api.loadMatch(ligaId, filter);
                    } else if (url == "team") {
                        api.loadTeam(ligaId);
                    } else {
                        api.loadStanding(ligaId);
                    }
                });
            });

            $(".tab-menu").each((key, tab) => {
                $(tab).click(() => {
                    url = $(tab).attr("href").substr(1);
                    loadTabMenu(url, ligaId);
                    console.log()
                });
            });

            $(".filter").each((key, checked) => {
                $(checked).click(() => {
                    filter = $(checked).val();
                    console.log(filter);
                    api.loadMatch(ligaId, filter);
                })
            })
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