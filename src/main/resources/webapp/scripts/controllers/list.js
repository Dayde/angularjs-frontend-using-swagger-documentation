'use strict';

angular.module('myApp').controller('ListCtrl', function ($scope, $location, ContactService) {

	$scope.contacts = [];


	$scope.addContact = function () {
		$location.path('/addContact');
	};

	$scope.editContact = function (contact) {
		$location.path('/editContact/' + contact.id);
	};

	$scope.refreshContacts = function () {
		$scope.dataReceived = false;
		var httpPromise = ContactService.getContactList();
		httpPromise.then(function(httpResponse) {
			$scope.contacts = httpResponse.data;
			$scope.dataReceived = true;
		});
	};

	$scope.refreshContacts();

});