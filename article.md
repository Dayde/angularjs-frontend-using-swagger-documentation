# Consuming a REST API documented with Swagger from AngularJS

In a previous post, Arnaud Cogoluègnes pointed out the benifits of [documenting your REST API with Swagger](http://blog.zenika.com/index.php?post/2013/07/11/Documenting-a-REST-API-with-Swagger-and-Spring-MVC). He also explained how to make it happen on the server side. This article covers how to consume such an API from a client web application in AngularJS.

## Swagger

The swagger documentation allows to have a unique entry point to the API. This means most changes on the server side will never impact the client implementation. Built upon the previous article source code, an AngularJS frontend was created for the example.

Basically, the application is split in several layers : the View in HTML, the Controllers and a Service layer to discuss with the backend API, both in JavaScript. Nothing revolutionnary for an AngularJS application you'll tell me! The specificity here is that the service layer has only a unique hard-coded URL, the others are discovered at runtime using the Swagger documentation.

### URLService

First I registered the base URL as a AngularJS value in the app.js file :

    var protocol = 'http';
    var domain = 'localhost';
    var port = '8081';
    var context = 'zencontact';
    var apiDocs = '/api-docs';

    var baseUrl = protocol + '://' + domain + (port ? (':' + port) : '');
    var documentationUrl = '/' + context + apiDocs;

    angular.module('myApp').value('baseUrl', baseUrl);
    angular.module('myApp').value('documentationUrl', documentationUrl);

Then, all you need to take advantage of Swagger documentation is a service that will resolve the URLs dynamically. Here is how I implemented it :

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



This service only returns the URL to the documentation of the resource asked. Then, this documentation will be specifically used in resource specific services to get the resource URL.

### Resource specific service : ContactService

In our example, the resources handled by the application are contacts. Here is how the AngularJS service managing the contacts retrieves the resource URL:

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


In order to be sure these URLs are loaded before we use them I used a function wrapper:

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

And there you go, you can now populate your service with functions using the URL retrieved in the documentation :

    ContactService.getContactList = safeCall(function (callback)
    {
        $http.get(contactResourceUrl).success(function (data, status) {
            callback(data, status);
        });
    });

For the simplicity of the example, I did not get down to the operation level and stopped at the resource level which is sufficient if the API follows the REST architecture.

## HATEOAS

It's also quite hard not to mention HATEOAS when talking about REST API and in fact Swagger and HATEOAS are complementary. It is fairly easy to use them together.

Using both, one question may arise: which one to use? Well I'd say to prefer the HATEOAS natural way of following links as long as the resource containing the link you need is already available. However for bookmarking purpose and "shorcuts" in the resource tree, you'd sometimes rather go for the Swagger documentation approach. For example when you look at a contact list implementing HATEOAS, you will use the contact link to get to his/her details. However, if you bookmarked the details page of a specific contact, you won't go through the contact list and so you won't have the link you need! This is where you want to use Swagger.

## Conclusion

AngularJS allows to take advantage of the Swagger Documentation fairly easily. Still you need to have a clean REST API to build your frontend on but using this technique, decoupling frontend and backend has never been so easy!

[Source code](https://github.com/Dayde/angularjs-frontend-using-swagger-documentation)
