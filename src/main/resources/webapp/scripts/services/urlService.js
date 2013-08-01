'use strict';

angular.module('myApp').service('UrlService', ['baseUrl', 'documentationUrl', '$http', '$q', function (baseUrl, documentationUrl, $http, $q) {
	var deferred = $q.defer();
	var apiDoc = deferred.promise;
	var UrlService = {};
	var urlReceived = false;

	$http.get(baseUrl + documentationUrl).success(function (data) {
		UrlService.baseUrl = baseUrl;
		deferred.resolve(data);
		urlReceived = true;
	});

	var getApi = function (apiDocumentation, description) {
		var api;
		if (apiDocumentation !== undefined) {
			api = _.findWhere(apiDocumentation.apis, { description: description });
		}
		return api ? apiDocumentation.basePath + api.path : undefined;
	};

	UrlService.contactUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation, 'contacts');
	});

	return UrlService;

}]);
