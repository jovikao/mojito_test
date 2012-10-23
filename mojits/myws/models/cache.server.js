/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
var myCache = null;
YUI.add('mywsModelCache', function(Y, NAME) {
/**
 * The mywsModelFoo module.
 *
 * @module myws
 */

    /**
     * Constructor for the mywsModelFoo class.
     *
     * @class mywsModelFoo
     * @constructor
     */
    Y.namespace('mojito.models')[NAME] = {

        init: function(config) {
            this.config = config;
            if(!myCache){
                var Cache = require( "node-cache" );
                myCache = new Cache({ stdTTL: 14400, checkperiod: 120 });
            }
            this.cache = myCache;
        },
        get: function(key, cb){
            this.cache.get(key, function(err, v){
                if(!err && v[key]){
                    Y.log('get cache:' + key + ' val:' + v[key].length, 'DEBUG');
                    Y.log(JSON.stringify(v));
                    cb(null, v[key]);
                }else{
                    Y.log('get cache err or empty');
                    cb(null, null);
                }
            });
        },
        set: function(key, val){
            Y.log('set cache:' + key + ' val:' + val.length);
            this.cache.set(key, val);
        }
    };

}, '0.0.1', {requires: []});
