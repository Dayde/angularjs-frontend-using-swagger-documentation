'use strict';

angular.module('myApp').controller('EditContactCtrl', ['$scope', '$routeParams', '$location', 'ContactService', function ($scope, $routeParams, $location, ContactService) {
	$scope.contact = {};
	$scope.dataReceived = false;

	if($location.path() !== '/addContact') {
		ContactService.getContactToEdit($routeParams.contactId, function (data) {
			$scope.contact = data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/addContact') {
			ContactService.addContact($scope.contact, function () {
				$location.path('/list');
			});
		} else {
			ContactService.updateContact($scope.contact,
				function () {
					$location.path('/list');
				}
			);
		}
	};

	$scope.cancel = function () {
		$location.path('/list');
	};

}]);
