'use strict';

// Logos controller
angular.module('logos').controller('LogosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Logos', 'logoGenerator', 'userLogos',
	function($scope, $stateParams, $location, Authentication, Logos, logoGenerator, userLogos) {
		$scope.authentication = Authentication;
		if (!$scope.authentication.user) {
			$location.path('/signin');
		}

		// Create new Logo
		$scope.create = function() {
			// Create new Logo object
			var logo = new Logos ({
				name: this.name,
                outputLogo: logoGenerator.generate(this.name)
			});

			// Redirect after save
			logo.$save(function(response) {
				$location.path('logos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Logo
		$scope.remove = function(logo) {
			if ( logo ) { 
				logo.$remove();

				for (var i in $scope.logos) {
					if ($scope.logos [i] === logo) {
						$scope.logos.splice(i, 1);
					}
				}
			} else {
				$scope.logo.$remove(function() {
					$location.path('logos');
				});
			}
		};

		// Update existing Logo
		$scope.update = function() {
            $scope.logo.outputLogo = logoGenerator.generate($scope.logo.name);
			var logo = $scope.logo;

			logo.$update(function() {
				$location.path('logos/' + logo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Logos
		$scope.find = function() {
            $scope.logos = userLogos.get({
                userId: $scope.authentication.user._id
            });
            //$scope.logos = Logos.query();
		};

		// Find existing Logo
		$scope.findOne = function() {
			$scope.logo = Logos.get({ 
				logoId: $stateParams.logoId
			});
		};
	}
]);
