/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
var textUrlBase = 'http://ohd.eventloops.in:8666';
YUI.add('mywsModelYql', function(Y, NAME) {
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
            this.md5 = require('MD5');
        },
        /**
         * Method that will be invoked by the mojit controller to obtain data.
         *
         * @param callback {function(err,data)} The callback function to call when the
         *        data has been retrieved.
         */
        termExtract: function(cacheModel, content, callback) {
            var that = this;
            var txtApcKeySuffix = that.md5(content);
            var txtApcKey = 'txt_' + txtApcKeySuffix;
            Y.log('save text to cache:' + txtApcKey + ' content:' + content.length);
            cacheModel.set(txtApcKey, content);
            var query = ['select * from search.termextract where context in ',
                "(select content from html where url='",
                textUrlBase,
                '/text?key=',
                txtApcKeySuffix,
                "')  and query='madonna'"].join('');
            Y.log('yql query:' + query);
            Y.YQL(query, function(rawYql) {
                Y.log('yql result:' + JSON.stringify(rawYql));
                if(rawYql.query && rawYql.query.count !== 0){
                    var count = rawYql.query.count;
                    var result = rawYql.query.results.Result;
                    if(count == 1){
                        result = [result];
                    }
                    callback(null, result);
                }else{
                    callback(null, false);
                }
            });        
        }

    };

}, '0.0.1', {requires: ['mywsModelCache']});
