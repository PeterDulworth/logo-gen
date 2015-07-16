'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'characterKey', function($scope, Authentication, characterKey) {
	// This provides Authentication context.
	$scope.authentication = Authentication;

    $scope.logoName = "";
    $scope.logoName_array = [];
    $scope.outputLogo = '';

    $scope.characterKey = characterKey;

    $scope.logoify = function () {
        $scope.outputLogo = '';
        var output_line1 = '',
            output_line2 = '',
            output_line3 = '',
            output_line4 = '',
            output_line5 = '',
            err = false;

        $scope.logoName_array = $scope.logoName.toLowerCase().split("");

        for (var c in $scope.logoName_array) {
            if ($scope.logoName_array[c] in $scope.characterKey) {
                output_line1 += $scope.characterKey[$scope.logoName_array[c]][0];
                output_line2 += $scope.characterKey[$scope.logoName_array[c]][1];
                output_line3 += $scope.characterKey[$scope.logoName_array[c]][2];
                output_line4 += $scope.characterKey[$scope.logoName_array[c]][3];
                output_line5 += $scope.characterKey[$scope.logoName_array[c]][4];
            }
            else {
                err = true;
            }
        }

        if (err) {
            $scope.outputLogo = 'ERROR: Unrecognized Characters!';
        }

        else {
            $scope.outputLogo = output_line1 + '\n' + output_line2 + '\n' + output_line3 + '\n' + output_line4 + '\n' + output_line5;
            console.log($scope.outputLogo);
        }
    };

}]);
