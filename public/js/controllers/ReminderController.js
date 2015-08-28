angular.module('ReminderModule', [])
  .controller('ReminderController', function($scope, $interval, ReminderFactory) {
    $scope.getReminders = function(){
        ReminderFactory.getAll().then(function(reminders){
            $scope.reminders = reminders.data;
        });
    };
    $interval($scope.getReminders, 2500);
  });