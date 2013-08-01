'use strict';

angular.module('myApp').controller('ListCtrl', ['$scope', '$location', 'ContactService', function ($scope, $location, ContactService) {

	$scope.contacts = [];
	$scope.dataReceived = false;
	$scope.searchString = '';


	$scope.addContact = function () {
		$location.path('/addContact');
	};

	$scope.editContact = function (contact) {
		$location.path('/editContact/' + contact.id);
	};

	$scope.updateContact = function (contact) {
		$scope.dataReceived = false;
		ContactService.updateContact(contact, function () {
			$scope.refreshContacts();
		}, function () {
			$scope.refreshContacts();
		});
	};

	$scope.refreshContacts = function () {
		$scope.dataReceived = false;
		ContactService.getContactList(function(data) {
			$scope.contacts = data;
			$scope.dataReceived = true;
		});
	};

	ContactService.getContactList(function(data) {
		$scope.contacts = data;
		$scope.dataReceived = true;
	});

}]);