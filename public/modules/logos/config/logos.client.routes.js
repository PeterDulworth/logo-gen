'use strict';

//Setting up route
angular.module('logos').config(['$stateProvider',
	function($stateProvider) {
		// Logos state routing
		$stateProvider.
		state('listLogos', {
			url: '/logos',
			templateUrl: 'modules/logos/views/list-logos.client.view.html'
		}).
		state('createLogo', {
			url: '/logos/create',
			templateUrl: 'modules/logos/views/create-logo.client.view.html'
		}).
		state('viewLogo', {
			url: '/logos/:logoId',
			templateUrl: 'modules/logos/views/view-logo.client.view.html'
		}).
		state('editLogo', {
			url: '/logos/:logoId/edit',
			templateUrl: 'modules/logos/views/edit-logo.client.view.html'
		});
	}
]);