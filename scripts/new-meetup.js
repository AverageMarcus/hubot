// Description:
//   meetup script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   when is the next event ?  - returns the next upcoming meetup event

module.exports = function(robot) {
  var API_KEY = process.env.MEETUP_API_KEY;

  var meetupURL = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=1722581%2C17778422%2C19558444%2C12345482%2C18829161%2C18789928%2C18617250%2C18888248&only=created%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&key="+API_KEY;
  var room = "#events";
  var result;

  robot.brain.set("lastcheck",new Date());

  interval = setInterval(function(){
    console.log("Checking for new meetups");

    robot.http(meetupURL).get()(function(err, res, body){
      if(err) console.log(err);
      result = JSON.parse(body).results;

      if(result && result.length > 0){
        result.forEach(function(meetup){
          var created = new Date(meetup.created);
          if(created > robot.brain.get("lastcheck")){
            robot.messageRoom(room, meetup.event_url);
          }
        });
      }

      robot.brain.set("lastcheck",new Date());
    });
  }, 1000 * 3600);

}
