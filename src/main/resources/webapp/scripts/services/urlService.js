'use strict';

angular.module('myApp').service('UrlService', ['baseUrl', 'documentationUrl', '$http', function (baseUrl, documentationUrl, $http) {
	var UrlService = {};

	var apiDoc = $http.get(baseUrl + documentationUrl);

	var getApi = function (apiDocumentation, description) {
		var api;
		if (apiDocumentation !== undefined) {
			api = _.findWhere(apiDocumentation.apis, { description: description });
		}
		return api ? apiDocumentation.basePath + api.path : undefined;
	};

	UrlService.contactUrl = apiDoc.then(function (apiDocumentation) {
		return getApi(apiDocumentation.data, 'contacts');
	});

	return UrlService;

}]);
