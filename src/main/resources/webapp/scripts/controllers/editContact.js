'use strict';

angular.module('myApp').controller('EditContactCtrl', function ($scope, $routeParams, $location, ContactService) {
	$scope.contact = {};
	$scope.dataReceived = false;

	if($location.path() !== '/addContact') {
		ContactService.getContactToEdit($routeParams.contactId).then(function (httpResponse) {
			$scope.contact = httpResponse.data;
			$scope.dataReceived = true;
		});
	} else {
		$scope.dataReceived = true;
	}

	$scope.save = function () {
		if($location.path() === '/addContact') {
			ContactService.addContact($scope.contact).then(function () {
				$location.path('/list');
			});
		} else {
			ContactService.updateContact($scope.contact).then(function () {
					$location.path('/list');
				}
			);
		}
	};

	$scope.cancel = function () {
		$location.path('/list');
	};

});
