angular.module('routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    // home page
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })
    
    // reminders page that will use the ReminderController
    .when('/reminders', {
      templateUrl: 'views/reminder.html',
      controller: 'ReminderController'
    });

  $locationProvider.html5Mode(true);
}]);