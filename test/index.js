var assert = require('assert');
var hapiRestRoutes = require('../');

describe('hapi-rest-routes', function () {
    describe('empty controller', function () {
        it('should throw an error', function () {
            var assertError = null;
            try {
                hapiRestRoutes({
                    name: 'empty-controller',
                    controller: {}
                });
            } catch (err) {
                assertError = err;
                assert(err);
            }
            assert(assertError);
        });
    });
    describe('empty controller and methods', function () {
        it('should return an empty route array', function () {
            var routes = hapiRestRoutes({
                name: 'empty-controller-methods',
                controller: {},
                methods: []
            });
            assert.equal(routes.length, 0);
        });
    });
    describe('id testing', function () {
        it('ids should be set right by name', function () {
            var nameVar = 'post';
            var routes = hapiRestRoutes({
                name: nameVar,
                controller: {
                    index: function () {

                    },
                    show: function () {

                    },
                    create: function () {

                    }
                },
                methods: ['index', 'show', 'create']
            });
            assert(routes);
            assert.equal(routes[0].config.id, nameVar + 's.index');
            assert.equal(routes[1].config.id, nameVar + 's.show');
            assert.equal(routes[2].config.id, nameVar + 's.create');
        });
        it('ids should be set right by namePlural', function () {
            var routes = hapiRestRoutes({
                name: 'post',
                namePlural: 'testing',
                controller: {
                    index: function () {

                    },
                    show: function () {

                    },
                    create: function () {

                    }
                },
                methods: ['index', 'show', 'create']
            });
            assert(routes);
            assert.equal(routes[0].config.id, 'testing.index');
            assert.equal(routes[1].config.id, 'testing.show');
            assert.equal(routes[2].config.id, 'testing.create');
        });
    });
    describe('path tests', function () {
        it('paths without namespace', function () {
            var nameVar = 'post';
            var routes = hapiRestRoutes({
                name: nameVar,
                controller: {
                    index: function () {},
                    show: function () {},
                    create: function () {},
                    store: function () {},
                    edit: function () {},
                    update: function () {},
                    destroy: function () {}
                }
            });
            assert(routes);
            assert.equal(routes[0].path, '/' + nameVar + 's');
            assert.equal(routes[1].path, '/' + nameVar + 's/{id}');
            assert.equal(routes[2].path, '/' + nameVar + 's/create');
            assert.equal(routes[3].path, '/' + nameVar + 's');
            assert.equal(routes[4].path, '/' + nameVar + 's/{id}/edit');
            assert.equal(routes[5].path, '/' + nameVar + 's/{id}');
            assert.equal(routes[6].path, '/' + nameVar + 's/{id}');
        });
        it('paths with namespace', function () {
            var nameVar = 'post',
                namespace = 'blog';
            var routes = hapiRestRoutes({
                name: nameVar,
                namespace: namespace,
                controller: {
                    index: function () {},
                    show: function () {},
                    create: function () {},
                    store: function () {},
                    edit: function () {},
                    update: function () {},
                    destroy: function () {}
                }
            });
            assert(routes);
            assert.equal(routes[0].path, '/' + namespace + '/' + nameVar + 's');
            assert.equal(routes[1].path, '/' + namespace + '/' + nameVar + 's/{id}');
            assert.equal(routes[2].path, '/' + namespace + '/' + nameVar + 's/create');
            assert.equal(routes[3].path, '/' + namespace + '/' + nameVar + 's');
            assert.equal(routes[4].path, '/' + namespace + '/' + nameVar + 's/{id}/edit');
            assert.equal(routes[5].path, '/' + namespace + '/' + nameVar + 's/{id}');
            assert.equal(routes[6].path, '/' + namespace + '/' + nameVar + 's/{id}');
        });
        it('paths with plural name', function () {
            var nameVar = 'post',
                namePlural = 'posts';
            var routes = hapiRestRoutes({
                name: nameVar,
                namePlural: namePlural,
                controller: {
                    index: function () {},
                    show: function () {},
                    create: function () {},
                    store: function () {},
                    edit: function () {},
                    update: function () {},
                    destroy: function () {}
                }
            });
            assert(routes);
            assert.equal(routes[0].path, '/' + namePlural + '');
            assert.equal(routes[1].path, '/' + namePlural + '/{id}');
            assert.equal(routes[2].path, '/' + namePlural + '/create');
            assert.equal(routes[3].path, '/' + namePlural + '');
            assert.equal(routes[4].path, '/' + namePlural + '/{id}/edit');
            assert.equal(routes[5].path, '/' + namePlural + '/{id}');
            assert.equal(routes[6].path, '/' + namePlural + '/{id}');
        });
        it('paths with namespace and plural name', function () {
            var nameVar = 'post',
                namePlural = 'posts',
                namespace = 'blog';
            var routes = hapiRestRoutes({
                name: nameVar,
                namePlural: namePlural,
                namespace: namespace,
                controller: {
                    index: function () {},
                    show: function () {},
                    create: function () {},
                    store: function () {},
                    edit: function () {},
                    update: function () {},
                    destroy: function () {}
                }
            });
            assert(routes);
            assert.equal(routes[0].path, '/' + namespace + '/' + namePlural + '');
            assert.equal(routes[1].path, '/' + namespace + '/' + namePlural + '/{id}');
            assert.equal(routes[2].path, '/' + namespace + '/' + namePlural + '/create');
            assert.equal(routes[3].path, '/' + namespace + '/' + namePlural + '');
            assert.equal(routes[4].path, '/' + namespace + '/' + namePlural + '/{id}/edit');
            assert.equal(routes[5].path, '/' + namespace + '/' + namePlural + '/{id}');
            assert.equal(routes[6].path, '/' + namespace + '/' + namePlural + '/{id}');
        });
        it('show, edit, update and destroy with parameter declaration', function () {
            var nameVar = 'post',
                variable = '(\\d+)';
            var routes = hapiRestRoutes({
                name: nameVar,
                variable: variable,
                controller: {
                    index: function () {},
                    show: function () {},
                    create: function () {},
                    store: function () {},
                    edit: function () {},
                    update: function () {},
                    destroy: function () {}
                },
                methods: ['show', 'edit', 'update', 'destroy']
            });
            assert(routes);
            assert.equal(routes[0].path, '/' + nameVar + 's/{id}' + variable + '');
            assert.equal(routes[1].path, '/' + nameVar + 's/{id}' + variable + '/edit');
            assert.equal(routes[2].path, '/' + nameVar + 's/{id}' + variable + '');
            assert.equal(routes[3].path, '/' + nameVar + 's/{id}' + variable + '');
        });
    });
});
