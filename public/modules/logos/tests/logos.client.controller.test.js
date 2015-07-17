'use strict';

(function() {
	// Logos Controller Spec
	describe('Logos Controller Tests', function() {
		// Initialize global variables
		var LogosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Logos controller.
			LogosController = $controller('LogosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Logo object fetched from XHR', inject(function(Logos) {
			// Create sample Logo using the Logos service
			var sampleLogo = new Logos({
				name: 'New Logo'
			});

			// Create a sample Logos array that includes the new Logo
			var sampleLogos = [sampleLogo];

			// Set GET response
			$httpBackend.expectGET('logos').respond(sampleLogos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logos).toEqualData(sampleLogos);
		}));

		it('$scope.findOne() should create an array with one Logo object fetched from XHR using a logoId URL parameter', inject(function(Logos) {
			// Define a sample Logo object
			var sampleLogo = new Logos({
				name: 'New Logo'
			});

			// Set the URL parameter
			$stateParams.logoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/logos\/([0-9a-fA-F]{24})$/).respond(sampleLogo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logo).toEqualData(sampleLogo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Logos) {
			// Create a sample Logo object
			var sampleLogoPostData = new Logos({
				name: 'New Logo'
			});

			// Create a sample Logo response
			var sampleLogoResponse = new Logos({
				_id: '525cf20451979dea2c000001',
				name: 'New Logo'
			});

			// Fixture mock form input values
			scope.name = 'New Logo';

			// Set POST response
			$httpBackend.expectPOST('logos', sampleLogoPostData).respond(sampleLogoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Logo was created
			expect($location.path()).toBe('/logos/' + sampleLogoResponse._id);
		}));

		it('$scope.update() should update a valid Logo', inject(function(Logos) {
			// Define a sample Logo put data
			var sampleLogoPutData = new Logos({
				_id: '525cf20451979dea2c000001',
				name: 'New Logo'
			});

			// Mock Logo in scope
			scope.logo = sampleLogoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/logos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/logos/' + sampleLogoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid logoId and remove the Logo from the scope', inject(function(Logos) {
			// Create new Logo object
			var sampleLogo = new Logos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Logos array and include the Logo
			scope.logos = [sampleLogo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/logos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLogo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.logos.length).toBe(0);
		}));
	});
}());