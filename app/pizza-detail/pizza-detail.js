'use strict';

angular.module('pizzApp.pizza.details', ['ngRoute', 'pizzApp.pizza'])

// Route Config    
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/pizzas/:pizzaId', {
        templateUrl: 'pizza-detail/pizza-detail.html',
        controller: 'PizzaDetailCtrl',
        resolve: {
            'currentAuth': ['Auth', function(Auth) {
                return Auth.$requireAuth();
            }]
        }
    });
}])

// Controller
.controller('PizzaDetailCtrl', ['$scope', '$routeParams', 'Pizza', 'PizzaRating',
    function($scope, $routeParams, Pizza, PizzaRating) {
        $scope.pizza = Pizza.getPizza($routeParams.pizzaId);
        $scope.voteSaved = false;
        
        // Function: add a vote to a specific pizza
        $scope.setRating = function(){
            PizzaRating.updateRating($routeParams.pizzaId, $scope.pizza.rating.value);
            $scope.voteSaved = true;
        };

}]);