(function(vjs, vast) {
    "use strict";
    var
        extend = function(obj) {
            var arg, i, k;
            for (i = 1; i < arguments.length; i++) {
                arg = arguments[i];
                for (k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        obj[k] = arg[k];
                    }
                }
            }
            return obj;
        },

        defaults = {
            skip: 5,
        },
        vpaidPlugin = function(options) {
            log('vpaidPlugin 1');
            var player = this;
            log(player);
            log(options);
            var settings = extend({}, defaults, options || {});
            log(settings);

            if (player.ads === undefined) {
                console.log("framework requires videojs-contrib-ads");
                return;
            }

            player.on('contentupdate', function() {
                log('player is reafy ');
            });

        }; //end var
    vjs.plugin('vpaid', vpaidPlugin); // registring plugin
}(window.videojs, window.DMVAST));