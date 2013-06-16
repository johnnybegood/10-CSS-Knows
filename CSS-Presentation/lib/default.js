// ------------------------------------------------
// Copyright © Microsoft Corporation. All rights reserved
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//-------------------------------------------------
(function () {
    "use strict";

    var container;

    $(document).bind('deck.change', changeSlide);
    $(init);
    
    function init() {
        /// <summary>Initialize app</summary>
        container = $(".deck-container");
        $.deck('.slide');
    }
    
    function changeSlide(event, from, to) {
        /// <summary>Event triggerd when moving between slides</summary>
        /// <param name="event" type="Object"></param>
        /// <param name="from" type="Number">Previous slide number</param>
        /// <param name="to" type="Number">Current slide number</param>
        var slide = $(".slide").eq(to);
        
        if (slide.length == 1) {
            fillCode(slide);
            fillPreview(slide);
        }
    }
    
    function fillPreview(slide) {
        /// <summary>Fill the preview block on the slide</summary>
        /// <param name="slide" type="JQuery">The current slide</param>
        var previewEl = slide.find(".preview");
        
        if (previewEl && previewEl.data("source")) {
            var sourceFile = "demo/" + previewEl.data("source") + ".html";
            //$.get(sourceFile).done(_.partial(previewCallback, previewEl));
            previewEl.append("<iframe src='" + sourceFile + "' />");
        }
    }
    
    function previewCallback(destination, content) {
        //destination.append("<iframe src=")
    }

    function fillCode(slide) {
        /// <summary>Fill the code block on the slide</summary>
        /// <param name="slide" type="JQuery">The current slide</param>
        var sourcePre = slide.find(".source pre");

        if (sourcePre && sourcePre.not(".content-loaded")) {
            var id = slide[0].id;
            var kind = sourcePre.data("kind");
            var sourceFile = "demo/" + (sourcePre.data("source") || "demo") + "." + kind;

            if (kind) {
                var callBack;

                switch (kind) {
                case "css":
                    callBack = _.partial(fillCss, id, sourcePre);
                    break;
                case "html":
                    callBack = _.partial(fillHtml, id, sourcePre);
                    break;
                }

                if (callBack) {
                    $.get(sourceFile).done(callBack);
                }
            }
        }
    }

    function fillCss(id, destination, content) {
       appendCode(destination, content, "css");
    }

    function fillHtml(id, destination, content) {
        appendCode(destination, content, "markup");
    }
    
    function appendCode(destination, content, kind) {
        destination.addClass("language-" + kind + " content-loaded").empty();
        $("<code></code>")
            .addClass("language-" + kind)
            .text(content)
            .appendTo(destination);
        Prism.highlightElement(destination[0]);
    }
}());