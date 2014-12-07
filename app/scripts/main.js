'use strict';

var app = angular.module('OnMyPlate', ['ngRoute', 'lr.upload']);
/*

Run blocks are the closest thing in Angular to the main method. 
A run block is the code which needs to run to kickstart the application.
It is executed after all of the service have been configured and the injector has been created. 
Run blocks typically contain code which is hard to unit-test, 
  and for this reason should be declared in isolated modules, 
  so that they can be ignored in the unit-tests.

*/

app.constant('ServerUrl', 'http://localhost:3000/');

app.run(function($rootScope, $location, $http, $window, authFactory) {
  // Every application has a single root scope. All other scopes are descendant scopes of the root scope
  $rootScope.$on('$routeChangeStart', function(event, next) {
    if(authFactory.isAuthenticated()) {
      
      $http.defaults.headers.common['Authorization'] = 'Token token=' + $window.sessionStorage.getItem('OnMyPlate.user');

    }
  });
});
