## AngularJS frontend consuming a REST API documented with Swagger

You can import the project into any IDE with Maven support
and launch the `com.zenika.ZenContactServer` class.

You can also launch the server from the command line with Maven:

    mvn exec:java -Dexec.mainClass="com.zenika.ZenContactServer"

Once launched, the server outputs 3 links in the console:
* the first one redirects to the REST documentation
* the second one redirects to Swagger UI
* the third one redirects to AngularJS Frontend

Once in Swagger UI, enter the REST documentation URL in the
appropriate field at the top of the page and have fun
browsing the UI!

The frontend allows to add and modify contacts.