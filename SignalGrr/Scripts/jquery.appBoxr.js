/*
* Created by Tim Heckel, &copy; 2012 
* Licensed under the MIT.
*/

(function ($, window) {
    "use strict";

    if (typeof ($.signalR) !== "function") {
        // no jQuery!
        throw new Error("SignalGrr: SignalR not found. Please ensure SignalR is referenced to use SignalGrr.");
    }

    if (typeof ($("<div/>").signalRamp) !== "function") {
        throw new Error("SignalGrr: jquery.signalRamp not found. Please ensure jquery.signalRamp is referenced to use SignalGrr.");
    }

    var _appBoxr = function (_options) {

        var _self = this;

        //defaults
        var options = {
            appId: ''
            , callbacks: {
                bridgeInitialized: null
                , bridgeStarted: null
            }
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
                    , bridgeInitialized: function (bridge, done) {
                        if (options.callbacks.bridgeInitialized)
                            options.callbacks.bridgeInitialized(bridge, done);
                        else
                            done();
                    }
                    , bridgeStarted: function (proxyName, bridge) {
                        options.callbacks.bridgeStarted && options.callbacks.bridgeStarted(proxyName, bridge);
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
                var _models = [], _segmentId = "", _currentObj = {}, _nests = [], _nest = [];

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


                    //check the DOM to ensure the fidelity of the heirarchy hold
                    //basically, are there any other data-models above this one? 
                    //if so, don't reset to a new model yet
                    if (_nest.length > 0) {
                        var nc;
                        checker: for (nc = 0; nc < _nest.length; nc++) {
                            if ($(":*[data-model='" + _nest[nc].name + "']").parents(":*[data-model]").length === 0) {
                                //var _top = _nest.pop();
                                _nests.push(_nest);
                                _nest = []; // [_top];
                                break checker;
                            }
                        }
                    }

                    _nest.push(_stub);
                });

                //add any remaining
                if (_nest.length > 0) _nests.push(_nest);

                $.each(_nests, function () {
                    var n = this, _model = {};
                    locals.nest(_model, _.pluck(n, 'name').reverse(), n);
                    _models.push(_model);
                });

                return { models: _models, pageId: $("body").data("page") };
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