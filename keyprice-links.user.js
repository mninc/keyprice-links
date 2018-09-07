// ==UserScript==
// @name         marketplace.tf keyprice links
// @namespace    http://manic.tf
// @version      1.0
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

    function run() {
        let time, price;

        myLineChart.options.tooltips.custom = function(tooltip){
            console.log(tooltip);
            let date = tooltip.title[0];
            console.log(time);
            console.log(price);

            time = new Date(date);

            let year = time.getFullYear().toString();
            let month = time.getMonth() + 1;
            month = (month>9 ? '' : '0') + month;
            month = month.toString();
            let day = time.getDate();
            day = (day>9 ? '' : '0') + day;
            day = day.toString();

            time = year + "-" + month + "-" + day;
            price = tooltip.body[0].lines[0].substring(14);
        };

        let old_function = myLineChart.options.onClick;
        myLineChart.options.onClick = function(data, elements) {
            old_function(data, elements);

            if (document.getElementById("keyprice-link")) {
                document.getElementById("keyprice-link").href = "http://manic.tf/keyprice?at=" + time + "&price=" + price;
            } else {
                let a = document.createElement("a");
                a.href = "http://manic.tf/keyprice?at=" + time + "&price=" + price;
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
        };
        myLineChart.update();
    }

    function delayRun() {
        setTimeout(run, 500);
    }
    window.onload = delayRun;

})();