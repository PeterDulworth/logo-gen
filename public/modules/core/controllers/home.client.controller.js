'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'logoGenerator', 'Logos', '$location', function($scope, Authentication, logoGenerator, Logos, $location) {
	// This provides Authentication context.
	$scope.authentication = Authentication;

    $scope.radioModel = 'Blue'; // default value
    $scope.logoName = '';
    $scope.outputLogo = '';

    $scope.logoify = logoGenerator.generate;

    // Create new Logo
    $scope.create = function() {
        // Create new Logo object
        var logo = new Logos ({
            name: this.logoName,
            outputLogo: logoGenerator.generate(this.logoName)
        });

        // Redirect after save
        logo.$save(function(response) {
            swal({ 
                title: "Logo Saved",
                type: "success",   
                confirmButtonColor: "#5bc0de",   
                confirmButtonText: "OK"
            });

            // Clear form fields
            $scope.logoName = '';
            $scope.outputLogo = '';
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };
}]);
