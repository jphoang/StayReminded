angular.module('ReminderModule', [])
  .controller('ReminderController', function($scope, $interval, $filter, ReminderFactory) {
    
    $scope.$watch('data.endTime', function(unformattedDate){
      $scope.data.endTime = $filter('date')(unformattedDate, 'medium');
    });

    $scope.init = function(){
      $scope.clearModal();
      $scope.getReminders();
      $interval($scope.getReminders, 2500);
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

    $scope.clearModal = function(){
      $scope.data = {};
    };

    $scope.createNew = function() {
      ReminderFactory.create(angular.copy($scope.data)).then(function(){
        $scope.clearModal();
        $scope.getReminders();
      });
    };

    $scope.delete = function(id) {
      ReminderFactory.delete(id).then(function(){
        $scope.getReminders();
      });
    };

    $scope.openEditFor = function(id) {
      ReminderFactory.get(id).then(function(reminder){
        $scope.data = reminder.data[0];
      });
    };

    $scope.edit = function(data) {
      ReminderFactory.update(data).then(function(){
        $scope.clearModal();
        $scope.getReminders();
      });
    };

    $scope.init();
  });