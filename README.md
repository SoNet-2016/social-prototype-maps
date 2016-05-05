## Add the pizza rating functionality (with AngularFire) ##

1. Add a `pizza-rating-service.js`, in the `components\pizza` folder, to perform the rating of pizzas through Firebase [transaction](https://www.firebase.com/docs/web/api/firebase/transaction.html).

2. Add a rating widget in the `pizza-details.html` view to allow users vote a specific pizza, e.g., by exploiting the `uib-rating` tag provided by the (already) included [Bootstrap directive](https://angular-ui.github.io/bootstrap/).

    ```
    <uib-rating class="star-color star-large" ng-model="pizza.rating.value" aria-labelledby="default-rating" ng-click="setRating()" read-only="voteSaved"></uib-rating>
    ```

3. In the `pizza-details.js` controller, add a `setRating()` function that will call the only function of the just created `PizzaRating` service.

    ```
    $scope.setRating = function(){
        PizzaRating.updateRating($routeParams.pizzaId, $scope.pizza.rating.value);
        $scope.voteSaved = true;
    };
    ```


## Add a new pizza to Pizza++ (with AngularFire) ##

1. Add a `pizza-creation` controller and view, showing an HTML form and an empty controller

2. Since AngularJS does not support natively `<input type="file"...>`, download and add to the `index.html` the [ng-file-upload](https://github.com/danialfarid/ng-file-upload) directive

    ```
    <!-- File Upload -->
    <script src="../lib/ng-file-upload-shim.min.js"></script> <!-- for no html5 browsers support -->
    <script src="../lib/ng-file-upload.min.js"></script>
    ```

   As an alternative, you can use directly HTML5 + plain JS (but the event triggered by clicking on the `<input>` tag cannot be handled in the AngularJS controller).

3. Tell the `pizza-creation.html` form to submit with a JavaScript function called `addNewPizza()` (to be added in the controller).

    ```
    ...
    <form id="frmPizza" role="form" ng-submit="addNewPizza()">
    ...
    ```

4. Since we want to get a photo from the smartphone camera, edit the `<input type="file"...>` to support such a functionality (with `ng-file-upload`):

    ```
    <button type="file" class="btn btn-default btn-lg" id="imgPizza" ng-model="pizza.img" ngf-accept="'image/*'" ngf-capture="camera" ngf-select="add()" >
        <span class="glyphicon glyphicon-camera"></span>
    </button>
    ```

    `ngf-accept`, `ngf-capture`, and `ngf-select` are the ng-file-upload equivalent of the HTML5 `accept`, `capture`, and `onselect` attributes. They allow to process these attributes in the AngularJS controller.

5. The `ngf-select` specifies an `add()` function. Add this function in the `pizza-creation.js` controller. It is useless in our case, but it is *mandatory* to support the process of getting a photo from the mobile camera.

    ```
     $scope.add = function () {
        $log.info($scope.pizza.img);
    };
    ```

6. Add the function to submit the entire form in the `pizza-creation.js` controller:

    ```
    $scope.addNewPizza = function () {
        var newRating = PizzaRating.createRating();
        var newPizza = Pizza.createPizza($scope.pizza, currentAuth.uid, newRating);

        Upload.base64DataUrl($scope.pizza.img).then(function (base64Url) {
            newPizza['image'] = base64Url;
            Pizza.postPizza(newPizza).then(function () {
                $location.path("/pizzas");
            });
        });
    };
    ```

    The `Upload.base64DataUrl()` function is provided by `ng-file-upload` and convert an image in its base64 representation. It is a "trick" to store images in the Firebase JSON. The function has a promise (the `then()` function) that is called when the convertion has been performed.


## Integrating Google Maps in Pizza++ (with AngularFire) ##

1. Download and include into the `index.html` the [angular-google-maps](https://angular-ui.github.io/angular-google-maps) directive to integrate Google Maps into AngularJS:

    ```
    <script src="../lib/google-maps/lodash.js"></script>
    <script src="../lib/google-maps/angular-simple-logger.js"></script>
    <script src="../lib/google-maps/angular-google-maps.min.js"></script>
    ```