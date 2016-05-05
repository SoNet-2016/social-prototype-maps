'use strict';

angular.module('pizzApp.user.profile', ['ngRoute'])

// Route Config
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/profile', {
        templateUrl: 'user-profile/user-profile.html',
        controller: 'UserProfileCtrl',
        resolve: {
            'currentAuth': ['Auth', function(Auth) {
                return Auth.$requireAuth();
            }]
        }
    });
}])

// Controller
.controller('UserProfileCtrl', ['$scope', 'currentAuth', '$firebaseObject', 'FBURL', 'Auth', '$location',
    function($scope, currentAuth, $firebaseObject, FBURL, Auth, $location) {
        // the next 2 lines should be performed in a User service...
        var ref = new Firebase(FBURL + '/users/' + currentAuth.uid);
        // get user information
        $scope.user = $firebaseObject(ref);

        // get the auth
        $scope.auth = Auth;

        // called when a change occurs in the authentication state
        $scope.auth.$onAuth(function(authData) {
            // logout
            if(authData === null)
                $location.path("/login");
        });
}]);