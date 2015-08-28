angular.module('ServiceModule', []).factory('ReminderFactory', ['$http', function($http) {
  return {
    getAll : function() {
      return $http.get('/api/reminders');
    },

    get : function(id) {
      return $http.get('/api/reminders/' + id);
    },

    // call to POST and create a new reminder
    create : function(data) {
      return $http.post('/api/reminders', data);
    },

    // call to POST and create a new reminder
    update : function(data) {
      return $http.put('/api/reminders/' + data._id, data);
    },

    // call to DELETE a reminder
    delete : function(id) {
        return $http.delete('/api/reminders/' + id);
    },

    // call to DELETE all reminders
    deleteAll : function() {
        return $http.delete('/api/reminders');
    }
  }       
}]);