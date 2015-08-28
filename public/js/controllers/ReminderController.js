angular.module('ReminderModule', [])
  .controller('ReminderController', function($scope, $interval, ReminderFactory) {
    $scope.init = function(){
      ReminderFactory.getAll().then(function(reminders){
        $scope.getReminders();
        $interval($scope.getReminders, 2500);
      });
    };
    $scope.getReminders = function(){
        ReminderFactory.getAll().then(function(reminders){
            $scope.reminders = reminders.data;
        });
    };
    $scope.deleteAllReminders = function(){
        ReminderFactory.deleteAll().then(function(reminders){
            $scope.reminders = [];
        });
    };
    $scope.init();
  });