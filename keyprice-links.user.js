// ==UserScript==
// @name         keyprice links
// @namespace    http://manic.tf
// @version      4.0
// @description  add http://manic.tf/keyprice links to marketplace.tf/mannco.store item pages
// @author       manic
// @grant        none
// @license      MIT

// @homepageURL     https://github.com/mninc/keyprice-links
// @supportURL      https://github.com/mninc/keyprice-links/issues
// @downloadURL     https://github.com/mninc/keyprice-links/raw/master/keyprice-links.user.js

// @run-at       document-end
// @match        https://marketplace.tf/items/*
// @match        https://mannco.store/item/*
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname.includes("marketplace.tf")) {
        let elements = document.getElementsByClassName('panel-body');
        let panel;
        for (let i = 0; i < elements.length; i++) {
            let elem = elements[i];
            let scriptFound = elem.getElementsByTagName("script").length;
            let canvasFound = elem.getElementsByTagName("canvas").length;
            if (canvasFound && scriptFound) {
                panel = elem;
                break;
            }
        }
        if (!panel) return;
        let script = panel.getElementsByTagName("script")[0];
        let canvas = panel.getElementsByTagName('canvas')[0];
        let canvasID = canvas.id;
        let newCanvasID = canvasID + "-manic";
        let canvasSku = canvas.dataset.sku;
        let iframe = panel.getElementsByTagName("iframe")[0];

        let scriptText = script.innerText;
        scriptText = scriptText.substring(0, scriptText.indexOf('});'));
        scriptText = scriptText.replace(new RegExp(canvasID, "g"), newCanvasID);
        scriptText += `
            let time, price;
    
            myLineChart.options.tooltips.custom = function(tooltip){
                if (!tooltip.title) return;
                let date = tooltip.title[0];
    
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
                    document.getElementById("keyprice-link").href = "http://manic.tf/keyprice?site=marketplace.tf&at=" + time + "&price=" + price;
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
            myLineChart.update();`;
        scriptText += '});';

        let newCanvas = document.createElement('canvas');
        newCanvas.id = newCanvasID;
        newCanvas.dataset.sku = canvasSku;
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        let newScript = document.createElement("script");
        newScript.innerHTML = scriptText;
        canvas.remove();
        iframe.remove();
        script.remove();
        panel.appendChild(newCanvas);
        panel.appendChild(newScript);
    } else {
        let time, price;
        window.myLine.options.tooltips.custom = function(tooltip) {
            if (!tooltip.title) return;

            time = tooltip.title[0];
            price = tooltip.body[0].lines[0].substring(14);
        }
        window.myLine.options.onClick = function() {
            console.log(time, price);
            window.open(`https://manic.tf/keyprice?site=mannco.store&at=${time}&price=${price}`)
        }
    }
})();
