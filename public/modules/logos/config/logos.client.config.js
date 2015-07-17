'use strict';

// Configuring the Articles module
angular.module('logos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Logos', 'logos', 'dropdown', '/logos(/create)?');
		Menus.addSubMenuItem('topbar', 'logos', 'List Logos', 'logos');
		Menus.addSubMenuItem('topbar', 'logos', 'New Logo', 'logos/create');
	}
]);
