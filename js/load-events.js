
const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const weekDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

function loadDojoEvents(dojoId, eventsCallback) {
  // from https://stackoverflow.com/a/9713078
  var http = new XMLHttpRequest();
  var url = "https://zen.coderdojo.com/api/2.0/events/search";
  var params = JSON.stringify({"query":{"dojoId": dojoId, "filterPastEvents": true, "status": "published"}});
  http.open("POST", url, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader("Accept", "application/json");

  http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
      var events = JSON.parse(http.responseText);
      eventsCallback(events);
    }
  }
  http.send(params);
}

function eventTime(event) {
  return (new Date(event.dates[0].startTime)).getTime();
}

function loadNextEvent(dojoId, eventCallback) {
  loadDojoEvents(dojoId, function(events) {
    if (events.length == 0) {
      return;
    }
    var nextEvent = events[0];
    events.forEach(function(event){
      if (eventTime(event) < eventTime(nextEvent)) {
        nextEvent = event;
      }
      console.log("event time " + dojoId + " " + eventTime(event));
    });
    eventCallback(nextEvent) // todo find first event
  });
}

function loadEvent(nextEventDiv) {
  var dojoId = nextEventDiv.id;
  loadNextEvent(dojoId, function(nextEvent){
    var start = new Date(nextEvent.dates[0].startTime);
    var end = new Date(nextEvent.dates[0].endTime);
    var allMinutes = (end - start) / 1000 / 60;
    var hours = allMinutes / 60;
    var minutes = allMinutes % 60;
    var timeText = weekDays[start.getDay()] + ", " + start.getDate() + ". " + months[start.getMonth()] + /*" " + start.getHours() + ":" + (start.getMinutes() < 10 ? "0": "") + start.getMinutes() +*/ " (" + hours + " Stunden" + (minutes == 0 ? "" : minutes + "Min.") + ")";
    var timeNode = document.createTextNode(timeText);
    var address = document.createTextNode(nextEvent.address);
    nextEventDiv.appendChild(document.createTextNode("Nächster Termin: "));
    nextEventDiv.appendChild(timeNode);
    nextEventDiv.appendChild(document.createElement("br"));
    nextEventDiv.appendChild(address);
  });
}

function loadEventsFromClassList() {
  var nextEvents = document.getElementsByClassName("next-event");
  for (var i = 0; i < nextEvents.length; i += 1) {
    var nextEventDiv = nextEvents[i];
    loadEvent(nextEventDiv);
  }
}

window.addEventListener("load", loadEventsFromClassList);


