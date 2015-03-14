'use strict';

app.factory('imageFactory',['$http', 
                            'HerokuUrl',
                            '$q',
                            '$location',
                            'AmazonS3',
                            '$rootScope',
                            function($http, HerokuUrl, $q, $location, AmazonS3, $rootScope) {

  var signKeyResponse;

  var signKey = function(imageFile, post) {
    $http.get(HerokuUrl + 'amazon/sign_key').success(function(response) {
      signKeyResponse = response;

      var imageParams = {
        food_image: {
          image_url: AmazonS3 + signKeyResponse.key
        }
      };
      $q.all(postImageToS3(imageFile, signKeyResponse)).then(function(response) {
        upsertImageToAPI(imageParams, post);
      });
    });
  };

  var postImageToS3 = function(imageFile, signKeyResponse) {

    $http.post(AmazonS3, formImageData(imageFile, signKeyResponse), {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined,
        'Authorization': '',
      }
    }).success(function(response) {
      console.log('eureka!');
    }).error(function(){
      console.log('fuck you');
    });
  };

  var upsertImageToAPI = function(image_params, post) {
    if(post.post.food_image) {
      return $http.put(HerokuUrl + 'food_images/' + post.post.food_image.id, image_params);
    } else {
      return $http.post(HerokuUrl + 'food_images', image_params);
    }
  };

  var formImageData = function(imageFile, signKeyResponse) {
    var imageData = new FormData();
    imageData.append('key', signKeyResponse.key);
    imageData.append('AWSAccessKeyId', signKeyResponse.access_key);
    imageData.append('policy', signKeyResponse.policy);
    imageData.append('acl', 'public-read');
    imageData.append('signature', signKeyResponse.signature);
    imageData.append('Content-Type', 'image/jpeg');
    imageData.append('file', imageFile);
    return imageData;
  };

  return {
    signKey: signKey
  };  

}]);