angular.module('ServiceModule', []).factory('Reminder', ['$http', function($http) {
  return {
    get : function() {
      return $http.get('/api/reminders');
    },

    // call to POST and create a new reminder
    create : function(data) {
      return $http.post('/api/reminders', data);
    },

    // call to DELETE a reminder
    delete : function(id) {
        return $http.delete('/api/reminders/' + id);
    }
  }       
}]);