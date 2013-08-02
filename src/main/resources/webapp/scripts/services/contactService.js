'use strict';

angular.module('myApp').service('ContactService', function ($http, $q, UrlService) {

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
			var deferred = $q.defer();

			// When the doc URL is available.
			docUrlReceived.then(function () {
				// When the resource URL is available.
				resourceUrlReceived.then(function () {
					deferred.resolve(functionToCall.apply(this, args));
				});
			});

			return deferred.promise;
		};
	};

	ContactService.getContactList = safeCall(function () {
		return $http.get(contactResourceUrl);
	});

	ContactService.getContactToEdit = safeCall(function (contactId) {
		return ContactService.getContact(contactResourceUrl + '/' + contactId);
	});

	ContactService.getContact = function (link) {
		return $http.get(link);
	};

	ContactService.addContact = safeCall(function (contact) {
		return $http.post(contactResourceUrl, JSON.stringify(contact));
	});

	ContactService.updateContact = function (contact) {
		return $http.put(contactResourceUrl + '/' + contact.id, JSON.stringify(contact));
	};

	return ContactService;

});