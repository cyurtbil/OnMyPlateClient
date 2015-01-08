'use strict';

app.factory('userFactory',['$window', function($window) {

  var defineCurrentUser = function(users) {

    var token = getToken();
    return users.filter(function(user) { return user.token === token})[0];
  };


  var getToken = function() {
    return $window.sessionStorage.getItem('OnMyPlate.user');
  };

  return {
    defineCurrentUser: defineCurrentUser
  };

}]);