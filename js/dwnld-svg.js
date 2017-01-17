function DwnldGraph() {
        var context;
        var redraw = false;

        this.init = function (el) {
            console.log(el);
            // var _canvas = $('#canvas');
            if (typeof(FlashCanvas) != 'undefined') context = document.getElementById('canvas').getContext('2d');
            canvg('canvas', el[0].outerHTML, {
                ignoreMouse: true,
                ignoreAnimation: true,
                renderCallback: function() {
                    console.log('done renderCallback');
                },
                forceRedraw: function() { var update = redraw; redraw = false; return update; }
            });

        };
    
        this.download = function (_a) {

            var _url = $('<span>');
            _url.text(document.getElementById("canvas").toDataURL("image/png"),"tfract_save");
            // console.log(_url.text());
            _a.attr('href', _url.text());
            _url.hide();

        }
}