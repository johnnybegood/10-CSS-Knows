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

    var demoCss, container, cssLoader;

    $(document).bind('deck.change', changeSlide);
    $(init);
    
    function init() {
        container = $(".deck-container");
        $.deck('.slide');
    }
    
    function demoCssLoaded(content) {
        demoCss = content;
    }
    
    function changeSlide(event, from, to) {
        var slide = container.find(".slide:nth-of-type(" + (to+1) + ")");
        
        if (slide.length == 1) {
            var sourcePre = slide.find(".source pre");

            if (sourcePre.data("kind") == "css") {
                var callBack = _.partial(fillCss, slide[0].id, sourcePre);

                if (cssLoader) {
                    callBack();
                } else {
                    $.get("css/demo.css").done(demoCssLoaded).done(callBack);
                }
            }
        }
    }
    
    function fillCss(name, destination) {
        var indicator = "/* " + name + " */";
        var startLocation = demoCss.indexOf(indicator) + indicator.length;
        var endLocation = demoCss.indexOf("/* ", startLocation);
        
        if (endLocation == -1) {
            endLocation = demoCss.length;
        }

        var partialCss = demoCss.substring(startLocation, endLocation);

        partialCss = partialCss.replace("#" + name + " .preview {", "body {");
        partialCss = partialCss.replace("#" + name + " .preview", "");

        destination.html(partialCss);
    }
}());