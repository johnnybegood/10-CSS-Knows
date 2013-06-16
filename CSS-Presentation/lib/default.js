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
        container = $(".deck-container");
        $.deck('.slide');
    }
    
    function changeSlide(event, from, to) {
        var slide = $(".slide").eq(11);
        
        if (slide.length == 1) {
            var sourcePre = slide.find(".source pre");

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
                        callBack =_.partial(fillHtml, id, sourcePre);
                        break;
                }

                if (callBack) {
                    $.get(sourceFile).done(callBack);
                }
            }
        }
    }
    
    function fillCss(id, destination, content) {
        var indicator = "/* " + id + " */";
        var startLocation = content.indexOf(indicator) + indicator.length;
        var endLocation = content.indexOf("/* ", startLocation);
        
        if (endLocation == -1) {
            endLocation = content.length;
        }

        var partialCss = content.substring(startLocation, endLocation);

        partialCss = partialCss.replace("#" + id + " .preview {", "body {");
        partialCss = partialCss.replace("#" + id + " .preview", "");

        destination.html(partialCss);
    }
    
    function fillHtml(id, destination, content) {
        destination.text(content);
    }
}());