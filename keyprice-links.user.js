// ==UserScript==
// @name         marketplace.tf keyprice links
// @namespace    http://manic.tf
// @version      2.0
// @description  add http://manic.tf/keyprice links to marketplace.tf detailed stats popups
// @author       manic
// @grant        none
// @license      MIT

// @homepageURL     https://github.com/mninc/keyprice-links
// @supportURL      https://github.com/mninc/keyprice-links/issues
// @downloadURL     https://github.com/mninc/keyprice-links/raw/master/keyprice-links.user.js

// @run-at       document-end
// @match        https://marketplace.tf/items/*
// ==/UserScript==

(function() {
    'use strict';

    function addLink() {
        let tables = document.getElementsByTagName("table");
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            if (table.id.startsWith("salesTable")) {
                console.log("yep");
                let body = table.getElementsByTagName("tbody")[0];
                let total = 0;
                for (let i = 0; i < body.children.length; i++) {
                    total += parseInt(body.children[i].children[1].innerText.replace(",", ""));
                }
                let median = Math.floor(total / 2);
                let index = 0;
                let price;
                for (let i = 0; i < body.children.length; i++) {
                    index += parseInt(body.children[i].children[1].innerText.replace(",", ""));
                    if (index > median) {
                        price = body.children[i].children[0].innerText.substr(1);
                        break;
                    }
                    if (i === body.children.length - 1) {
                        price = body.children[i].children[0].innerText.substr(1);
                    }
                }

                open = true;
                if (document.getElementById("keyprice-link")) {
                    document.getElementById("keyprice-link").href = "http://manic.tf/keyprice?price=" + price;
                } else {
                    let a = document.createElement("a");
                    a.href = "http://manic.tf/keyprice?price=" + price;
                    a.innerText = "Convert to keys";
                    a.id = "keyprice-link";
                    a.target = "_blank";

                    let titles = document.getElementsByClassName("modal-title");
                    for (let i = 0; i < titles.length; i++) {
                        let title = titles[i];
                        if (title.innerText === "Detailed Stats") {
                            title.innerText += "  -  ";
                            title.appendChild(a);
                        }
                    }
                }
            }
        }

    }

    let modal;
    function getModal() {
        let elements = document.querySelectorAll('*[id]');
        for (let i = 0; i < elements.length; i++) {
            let elem = elements[i];
            if (elem.id.startsWith("salesTableModal")) {
                modal = elem;
                clearInterval(interval);
                setInterval(check, 200);
                break;
            }
        }
    }
    let interval = setInterval(getModal, 1000);
    let open = false;

    function check() {
        if (!open && modal.style.display === "block") {
            addLink();
        } else if (modal.style.display !== "block") {
            open = false;
        }
    }

})();