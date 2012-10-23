/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
var myCache = null;
YUI.add('myws', function(Y, NAME) {

/**
 * The myws module.
 *
 * @module myws
 */

    /**
     * Constructor for the Controller class.
     *
     * @class Controller
     * @constructor
     */
    Y.namespace('mojito.controllers')[NAME] = {

        init: function(config) {
            this.config = config;
            if(!myCache){
                var Cache = require( "node-cache" );
                myCache = new Cache({ stdTTL: 14400, checkperiod: 120 });
            }
            this.cache = myCache;
            this.md5 = require('MD5');
            this.log('init application');
        },
        log: function(content){
            Y.log(content, 'DEBUG');
        },
        text: function(ac){
            var that = this;
            var params = ac.params.getFromUrl();
            var key = 'txt_' + params.key;
            that.log('load text by key:' + key);
            var cacheModel = ac.models.mywsModelCache;
            cacheModel.get(key, function(err, v){
                if(v){
                    ac.done({txt:v});
                }else{
                    ac.done({txt:''});
                }
            });
        },
        yqlTermExtract: function(ac){
            var that = this;
            var params = ac.params.getFromBody();
            var content = params.content;
            var yqlModel = ac.models.mywsModelYql;
            var cacheModel = ac.models.mywsModelCache;
            that.log('model');
            that.log(yqlModel.termExtract(cacheModel, content, function(err, data){
                ac.done({result:JSON.stringify(data)});
            }));
        }
    };

}, '0.0.1', {requires: ['mojito', 'mywsModelYql','mywsModelCache', 'yql']});
