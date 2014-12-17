'use strict';

app.controller('FoodCtrl',['$location', 
                           '$scope', 
                           'dataFactory', 
                           'foodFactory',
                           'userFactory',
                           '$q',
                           '$http',
                           'ServerUrl',
                           'imageFactory',
                           '$route', 
                           function($location, $scope, dataFactory, foodFactory, userFactory, $q, $http, ServerUrl, imageFactory, $route) {


    var users = [];
    $scope.ratingVals = [1, 2, 3, 4, 5];

    dataFactory.fetchFoods().then(function(response) {
      var foods = response.data.foods;
      var path = $location.path();
      $scope.currentFood = foodFactory.findCurrentFood(foods, path);
      $scope.posts = $scope.currentFood.posts;
      foodFactory.calcFoodRating($scope.posts);
      $scope.avgFoodRating = foodFactory.ratingsArr;
    });

    

    dataFactory.fetchUsers().then(function(response) {
      $q.all(userFactory.createUsersArray(response.data.users, users)).then(function() {
        $scope.currentUser = userFactory.defineCurrentUser(users);
      });
    });

    $scope.getRating = function(post) {
      var repeat = [];
      for(var i = 0; i < post.rating; i++) {
        repeat.push(i);
      }
      return repeat;
    };

    $scope.slideToggleForm = function() {
      $('form').slideToggle(400);
    };

    $scope.hideForm = function() {
      $('form').hide(400);
    };

    $scope.postNewPost = function(post, image, food) {
      var postParams = {post: {
        rating: post.rating,
        review: post.review,
        food_id: food.id 
      }};

      $http.post(ServerUrl + 'foods/' + food.id + '/posts', postParams).success(function(response) {
        $scope.currentFood.posts.push(response);
        $q.all(imageFactory.signKey(image, postParams)).then(function() {
          console.log('post created!')
        });
      });
    };

    $scope.removePost = function(post, food) {
      $http.delete(ServerUrl + '/foods/' + food.id + '/posts/' + post.id).success(function(response) {
        console.log('post is deleted!')
        $('#' + post.id + 'a5b6').fadeOut(400);
      });
    };

    $scope.likePost = function(post, food) {
      post.likes += 1;
      // $('#' + post.id + 'a5b6').slideDown(500).fadeOut(300);
      var postParams = {post: post};
      $http.put(ServerUrl + 'foods/' + food.id + '/posts/' + post.id + '.json', postParams).success(function(response) {
        console.log('liked the post bitch!!!!!');
      });

    }; 



}]);