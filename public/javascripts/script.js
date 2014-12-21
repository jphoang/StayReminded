/*******************************************
PAGE CONFIGURATION
*******************************************/
$(document).ready(function(){
    checkPhoneNumber();
    refreshList();
    setInterval(refreshList, 7000);
    refreshList();
    $("#refresh").click(function(){
      refreshList();
    });
    $("#delete-all").click(function(){
      deleteAll();
    });
    $('#create-new').click(function() {
      $("#reminder-title").val('');
      $("#end-time").val('');
      $('#myModal').modal("show");
    });
    $('#phone-button').click(function() {
      setPhoneNumber();
    });
    $('#saveEdit').click(function() {
      var id = $("#saveEdit").attr("data-id");
      updateReminder(id);
      $('#modalEdit').modal("hide");
      $("#edit-reminder-title").val('');
      $("#edit-end-time").val('');
      refreshList();
    });
});

/*******************************************
FUNCTIONS 
*******************************************/
/*Refreshes the list of Reminders*/
var refreshList = function() {
  $.getJSON("/Reminders",function(data){
    $("#listthing").empty();
    $.each( data.reminders, function( i, reminder ) {
      $("#listthing").append("<div id="+reminder._id+" class='div-hover list-group-item' ><a href='/'>Reminder: "+reminder.title+"</a><div class='btn-group pull-right'><button onclick=\"editOne(" +"\'" +reminder._id + "\'"+")\" class='line-up btn btn-xs btn-primary'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> Edit</button><button onclick=\"deleteOne(" +"\'" +reminder._id + "\'"+")\" class='line-up btn btn-xs btn-primary delete-button'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Delete</button></div></div>");
    });
  });
}

/*Deletes one specific requirement*/
var deleteOne = function(id){
  $.ajax({
    url: "/Reminders/"+id,
    type: 'DELETE',
    success: function(data) {
      refreshList();
    }
  });
}

/*Deletes all reminders in list*/
var deleteAll = function(){
  $.ajax({
    url: "/Reminders",
    type: 'DELETE',
    success: function(data) {
      refreshList();
    }
  });
}

/*Creates a new reminder*/
var createNewReminder=function(){
  var title = $("#reminder-title").val();
  var endtime = $("#end-time").val();
  var formdata = {};
  formdata.title = title;
  formdata.end = endtime;
  if(title && endtime){
    $.ajax({
      url: "/Reminders",
      type: 'POST',
      data:formdata,
      success: function(data) {
        $('#myModal').modal("hide");
        $("#reminder-title").val('');
        $("#end-time").val('');
        refreshList();
      }
    });
  }
}

/*Opens edit modal and populates*/
var editOne = function(id){

  $('#modalEdit').modal("show");
  $.getJSON("/Reminders/"+id,function(data){
    $.each( data.reminders, function( i, reminder ) {
      $('#edit-reminder-title').val(reminder.title);
      var datevalue = new Date(Date.parse(reminder.end));
      datevalue = datevalue.toString();
      $('#edit-end-time').val(datevalue.substring(0,24));
    });
  });
  $("#saveEdit").attr({
    "data-id" : id,
  });
}

/*Updates one specific requirement*/
var updateReminder = function(id){
  var title = $("#edit-reminder-title").val();
  var endtime = $("#edit-end-time").val();
  var formdata = {};
  formdata.title = title;
  formdata.end = endtime;
  if(title && endtime){
    $.ajax({
      url: "/Reminders/"+id,
      type: 'PUT',
      data:formdata,
      success: function(data) {
        refreshList();
      }
    });
  }
}

/*Sets the users phone number*/
var setPhoneNumber = function(){
  var phone = $("#phone-number").val();
  var formdata = {};
  formdata.phone = phone;
  $.ajax({
    url: "/PhoneNumber",
    type: 'POST',
    data:formdata,
    success: function(data) {
      checkPhoneNumber();
    }
  });
}

/*Checks if the user has set a phone number*/
var checkPhoneNumber = function(){
  $.get("/PhoneNumber",function(data){
      if(data){
         $('#phone-button').hide();
         $('#phone-number').hide();
      }
  });
}

