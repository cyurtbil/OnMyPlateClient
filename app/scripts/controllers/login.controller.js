'use strict';

app.controller('LoginCtrl',['$scope', 
                            '$location', 
                            'authFactory', 
                            'dataFactory', 
                            '$window',
                            'userFactory',
                            '$http',
                             function($scope, $location, authFactory, dataFactory, $window, userFactory, $http) {

  $scope.isLoginSuccessful = true;
  $scope.isConfirmed = true;
  $scope.doesExist = true;
  $scope.registered = false;
  $scope.isActed = false;

  if(dataFactory.params.exist) {
    $scope.existingUserEmail = dataFactory.params.email;
    $scope.doesExist = false;
    $('#existing-error').slideDown(200);
    $('#existing-error').delay(3000).slideUp(200);
  };

  if(dataFactory.params.registered) {
    $scope.registered = true;
    $('#registered').slideDown(200);
    $('#registered').delay(3000).slideUp(200);
  };

  $scope.login = function(params) {
    

    $scope.isActed = true;
    $('#loader').css('width', '100%');
    userFactory.doesExist(params).then(function(response) {
      var doesUserExist = response.data.exist;
      if(!!doesUserExist) {
        dataFactory.getConfirm(params).then(function(response) {
          if(response.data.confirmed) {
            authFactory.login(params).success(function(response) {
              $scope.isActed = false;
              $window.sessionStorage.setItem('OnMyPlate.user', response.token);
              // Sets the headers for the request, and token for the authorization
              $http.defaults.headers.common['Authorization'] = 'Token token=' + $window.sessionStorage.getItem('OnMyPlate.user');
              $location.path('/');
            }).error(function(response) {
              $scope.isActed = false;
              $scope.params = {};
              $scope.isLoginSuccessful = false;
              $('#login-error').slideDown(200);
              $('#login-error').delay(3000).slideUp(200);
            });
          } else {
            $scope.isActed = false;
            $location.path('/login');
            $scope.isConfirmed = false;
            $('#confirmation-error').slideDown(200);
            $('#confirmation-error').delay(3000).slideUp(200);
          }
        });
      } else {
        $scope.isActed = false;
        $scope.params = {};
        $scope.isLoginSuccessful = false;
        $('#login-error').slideDown(200);
        $('#login-error').delay(3000).slideUp(200);
      }
    });
    
  }

}]);