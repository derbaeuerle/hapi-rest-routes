'use strict';
var assert = require('assert');
var Joi = require('joi');

var internals = {};

/*
 * Dictionary for internal use of static variables.
 */
internals.baseMethods = {
    index: {
        method: 'GET',
        suffix: undefined
    },
    show: {
        method: 'GET',
        suffix: '/{id}{declaration}'
    },
    create: {
        method: 'GET',
        suffix: '/create'
    },
    store: {
        method: 'PUT',
        suffix: undefined
    },
    edit: {
        method: 'GET',
        suffix: '/{id}{declaration}/edit'
    },
    update: {
        method: 'POST',
        suffix: '/{id}{declaration}'
    },
    destroy: {
        method: 'DELETE',
        suffix: '/{id}{declaration}'
    }
};

/*
 * Joi schema declaration of options argument.
 */
internals.optionsSchema = Joi.object().keys({
    name: Joi.string().required(),
    namePlural: Joi.string(),
    controller: Joi.object().required(),
    variable: Joi.string(),
    namespace: Joi.string(),
    methods: Joi.array().items(Joi.string().valid(Object.keys(internals.baseMethods)))
});

/**
 * Generator of restful routes for the hapi framework.
 *
 * @param options
 * @param callback
 * @return Array
 */
exports = module.exports = function (options, callback) {
    var routes = [];

    internals.optionsSchema.validate(options, function (err) {
        if (err) {
            throw err;
        }

        options.methods = (!options.methods) ? Object.keys(internals.baseMethods) : options.methods;
        options.namespace = (!options.namespace) ? '' : options.namespace;
        options.namePlural = (!options.namePlural) ? options.name + 's' : options.namePlural;

        for (var i = 0, il = options.methods.length; i < il; i++) {
            var method = options.methods[i];
            var methodOptions = internals.baseMethods[method];

            assert(options.controller[method], 'There is no handler function for the \'' + method + '\' route');

            var path = ((options.namespace) ? '/' + options.namespace : '') + '/' + options.namePlural + ((methodOptions.suffix) ? methodOptions.suffix : '');

            path = path.replace('{declaration}', (options.variable) ? options.variable : '');

            routes.push({
                path: path,
                method: methodOptions.method,
                handler: options.controller[method],
                config: {
                    id: ((options.namespace !== '') ? options.namespace + '.' : '') + options.namePlural + '.' + method
                }
            });
        }
    });

    if (callback) {
        callback(routes);
    }

    return routes;
};
