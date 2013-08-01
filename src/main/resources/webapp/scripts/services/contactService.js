'use strict';

angular.module('myApp').service('ContactService', ['$http', 'UrlService', function ($http, UrlService) {

	var ContactService = {};

	var contactResourceUrl;
	var contactDocUrl;
	var docUrlReceived;
	var resourceUrlReceived;

	// Getting the contacts API documention URL and a promise to know when it's loaded.
	docUrlReceived = UrlService.contactUrl.then(function (contactUrl) {
		contactDocUrl = contactUrl;
	});

	// When the documentation is received, getting the contacts resource URL and a promise to know when it's loaded.
	docUrlReceived.then(function () {
		resourceUrlReceived = $http.get(contactDocUrl).success(function (response) {
			contactResourceUrl = response.basePath + response.resourcePath;
		});
	});

	// Wrapper de fonction permettant de vérifier que l'URL de l'interface REST a bien été résolue avant de l'utiliser.
	// Function wrapper verifying URL is availble before any API call.
	var safeCall = function (functionToCall) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			// When the doc URL is available.
			docUrlReceived.then(function () {
				// When the resource URL is available.
				resourceUrlReceived.then(function () {
					return functionToCall.apply(this, args);
				});
			});
		};
	};

	ContactService.getContactList = safeCall(function (callback)
	{
		$http.get(contactResourceUrl).success(function (data, status) {
			callback(data, status);
		});
	});

	ContactService.getContactToEdit = safeCall(function (contactId, callback) {
		ContactService.getContact(contactResourceUrl + '/' + contactId, callback);
	});

	ContactService.getContact = function (link, callback) {
		var contact = {};
		$http.get(link).success(function (data, status) {
			callback(data, status);
		});
		return contact;
	};

	ContactService.addContact = safeCall(function (contact, success, error) {
		$http.post(contactResourceUrl, JSON.stringify(contact)).success(function (data, status) {
			success(data, status);
		}).error(function (data, status) {
				error(data, status);
			});
	});

	ContactService.updateContact = function (contact, success, error) {
		$http.put(contactResourceUrl + '/' + contact.id, JSON.stringify(contact)).success(function (data, status) {
			success(data, status);
		}).error(function (data, status) {
				error(data, status);
			});
	};

	ContactService.deleteContact = function (contact, callback) {
		$http.delete(contactResourceUrl + '/' + contact.id).success(function (data, status) {
			callback(data, status);
		});
	};

	return ContactService;

}]);