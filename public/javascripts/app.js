var app = angular.module('app', ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    // $urlMatcherFactory.strictMode(false);

    $urlRouterProvider.otherwise("/")
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/views/home',
            controller: 'homeCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/views/login',
            controller: 'loginCtrl'
        })
        .state('country', {
            url: '/addCountry',
            templateUrl: '/views/country',
            controller: 'countryCtrl'
        })
        .state('city', {
            url: '/addCity',
            templateUrl: '/views/city',
            controller: 'cityCtrl'
        })
        .state('population', {
            url: '/addPopulation',
            templateUrl: '/views/population',
            controller: 'populationCtrl'
        }).
    state('logout', {
        controller: function($rootScope, $state) {
            $rootScope.loginStatus = false;
            $state.go('login');
        }
    })
});

app.service('session', ['$rootScope', '$state', function($rootScope, $state) {
    return function(status) {
        if (!status) {
            if (!$rootScope.loginStatus)
                $state.go('home');
            return;
        };
        $rootScope.loginStatus = status;
    }
}])
app.controller('loginCtrl', ['$scope', '$http', '$rootScope', '$state', 'session', function($scope, $http, $rootScope, $state, session) {
        if ($rootScope.loginStatus) {
            return $state.go('home');
        }
        $rootScope.loginStatus = false;
        angular.extend($scope, {
            login: function() {
                console.log($scope.credits)
                $http.post('/api/login', $scope.credits)
                    .success(function(report) {
                        if (report.success) {
                            $rootScope.loginStatus = true;
                            session(true);
                            return $state.go('home');
                        }

                        return alert(report.data);
                    });
            }
        })
    }])
    .controller('homeCtrl', ['$scope', '$http', 'session', function($scope, $http, session) {

        $scope.report = {};
        angular.extend($scope, {
            getDashboard: function(cb) {
                $http.get('/api/dashboard')
                    .success(function(report) {
                        if (report.success) {
                            $scope.report = report.data;
                            if (cb) cb(report.data);
                            return;
                        }
                    });
            },
            dataOf: function(type) {
                // console.log($scope.dashboard.city)
                if (!$scope.dashboard.hasOwnProperty('city')) return;
                if (!$scope.dashboard.city) return;
                var typesData = _.where($scope.dashboard.city.population, { type: type });
                return _.reduce(_.pluck(typesData, $scope.dashboard.type), function(m, n) {
                    return m + n
                }, 0) || 0;

            },
            getSortPopulation: function(data) {
                $http.get('/api/sort_popluation').success(function(report) {
                    if (!report.success) return;
                    $scope.sort = report.data;
                    $scope.sort = $scope.sort.map(function(e, i) {
                        var d = _.findWhere(data, { id: e.country_id });
                        d = d ? d.country : '';
                        return angular.extend(e, {
                            name: d
                        });
                    });
                })
            }
        });

        $scope.getDashboard($scope.getSortPopulation);
    }])
    .controller('countryCtrl', ['$scope', '$http', '$rootScope', 'session', function($scope, $http, $rootScope, session) {
        session();
        $scope.addCountry = function() {
            if (!$scope.country) return;
            $http.post('/api/country', $scope.country).success(function(report) {
                if (report.success) {
                    $scope.country.name = '';
                    return alert(report.data)
                }
            });
        }
    }])
    .controller('cityCtrl', ['$scope', '$http', '$rootScope', 'session', function($scope, $http, $rootScope, session) {
        session();
        $scope.city = {}
        angular.extend($scope, {
            getCountries: function() {
                $http.get('/api/country').success(function(report) {
                    if (report.success) {
                        console.log(report)
                        $scope.countries = report.data;
                        if ($scope.countries.length) $scope.city.country = $scope.countries[0];
                    }
                });
            },
            addCity: function() {
                if (!$scope.city) return;
                if (!$scope.city.hasOwnProperty('name')) return;
                $http.post('/api/city', $scope.city).success(function(report) {
                    if (report.success) {
                        $scope.city.name = '';
                        return alert(report.data)
                    }
                });
            }
        });
        $scope.getCountries();
    }])
    .controller('populationCtrl', ['$scope', '$rootScope', '$http', 'session', function($scope, $rootScope, $http, session) {
        session();
        $scope.population = {};
        angular.extend($scope, {
            getCountries: function(cb) {
                $http.get('/api/country').success(function(report) {
                    if (report.success) {
                        console.log(report)
                        $scope.countries = report.data;
                        if ($scope.countries.length) $scope.population.country = $scope.countries[0];
                        if (cb) cb();
                    }
                });
            },
            getCities: function() {
                $http.get('/api/city').success(function(report) {
                    if (report.success) {
                        $scope.cities = report.data;
                        console.log($scope.cities)
                        if ($scope.cities.length) $scope.population.city = $scope.cities[0];
                    }
                })
            },
            addPopulation: function() {
                if (!$scope.population) return;
                if ($scope.population.hasOwnProperty('country'))
                    if (!$scope.population.country) return alert('Select Country');
                if (!$scope.population.hasOwnProperty('city'))
                    if (!$scope.population.city) return alert('Select City');

                $http.post('/api/population', $scope.population).success(function(report) {
                    if (report.success) {
                        $scope.population = {};
                        return alert(report.data);
                    }
                });
            },
        });
        $scope.getCountries($scope.getCities);
    }])
