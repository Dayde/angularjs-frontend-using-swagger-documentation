'use strict';

angular.module('myApp', [])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/list', {
				templateUrl: 'views/list.html',
				controller: 'ListCtrl'
			}).when('/addContact', {
				templateUrl: 'views/edit.html',
				controller: 'EditContactCtrl'
			}).when('/editContact/:contactId', {
				templateUrl: 'views/edit.html',
				controller: 'EditContactCtrl'
			}).otherwise({
				redirectTo: '/list'
			});

	});

var protocol = 'http';
var domain = 'localhost';
var port = '8081';
var context = 'zencontact';
var apiDocs = '/api-docs';

var baseUrl = protocol + '://' + domain + (port ? (':' + port) : '');
var documentationUrl = '/' + context + apiDocs;

angular.module('myApp').value('baseUrl', baseUrl);
angular.module('myApp').value('documentationUrl', documentationUrl);
