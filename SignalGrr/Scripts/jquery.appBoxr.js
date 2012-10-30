/*
* Created by Tim Heckel, &copy; 2012 
* Licensed under the MIT.
*/

(function ($, window) {
    "use strict";

    if (typeof ($.signalR) !== "function") {
        // no jQuery!
        throw new Error("AppBoxr: SignalR not found. Please ensure SignalR is referenced to use appBoxr.");
    }

    if (typeof ($("<div/>").signalRamp) !== "function") {
        throw new Error("AppBoxr: jquery.signalRamp not found. Please ensure jquery.signalRamp is referenced to use appBoxr.");
    }

    var _appBoxr = function (_options) {

        var _self = this;

        //defaults
        var options = {
            appId: ''
        }

        $.extend(options, _options);

        function init() {
            $(document).signalRamp({
                proxyName: options.appId
                , url: options.url
                , callbacks: {
                    dataSend: function (pkg, done) {
                        //TODO: change the process based on more criteria (don't always save the full model)
                        var _page = locals.assembleModel();
                        pkg.appBoxr = { process: "SAVE", model: _page.model, pageId: _page.pageId };
                        done();
                    }
                    , dataReceive: function (pkg) {
                        //TODO: Check result of sync
                    }
                }
            });
        };

        var locals = {
            nest: function (base, names, values) {
                for (var i in names) {
                    base = base[names[i]] = base[names[i]] || (_.detect(values, function (v) { return v.name === names[i]; }).props || {});
                }
            }
            , assembleModel: function () {
                var _model = {}, _segmentId = "", _currentObj = {}, _nest = [];

                $.each($(":*[data-model]").get().reverse(), function () {
                    var _mod = $(this);
                    var _stub = { name: _mod.data("model"), props: {} };
                    _mod.find(":*[data-property]").each(function () {
                        var _next = $(this);
                        if (_next.closest(":*[data-model]").data("model") !== _mod.data("model")) {
                            return;
                        }
                        var _val = _next.val();
                        if (_next.attr("type") === "radio" || _next.attr("type") === "checkbox")
                            _val = _next.attr("checked") === "checked" ? true : false;
                        _stub.props[_next.data("property")] = _val;
                    });
                    _nest.push(_stub);
                });

                locals.nest(_model, _.pluck(_nest, 'name').reverse(), _nest);

                return { model: _model, pageId: $("body").data("page") };
            }
        }

        //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        function _guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).substring(0, 7);
        };

        init();
    };

    $.appBoxr = _appBoxr;

})(jQuery, window);