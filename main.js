$(document).ready(function(){
/*
User Story: As a user, I can see whether Free Code Camp is currently streaming on Twitch.tv.

User Story: As a user, I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.

User Story: As a user, if Free Code Camp is streaming, I can see additional details about what they are streaming.

Bonus User Story: As a user, I can search through the streams listed.

Bonus User Story: As a user, I will see a placeholder notification if a streamer has closed their Twitch account. You can verify this works by adding brunofin and comster404 to your array of Twitch streamers.

*/
	var streamersNames = ["comst er404", "pax", "freecodecamp", "storbeck", ,"pokerstarsfrance", "terakilobyte", "habathcx","RobotCaleb","						thomasballinger","noobs2ninjas","beohoff"],
		streamsUrl="https://api.twitch.tv/kraken/streams/", // online == stream obj,
		channelsUrl="https://api.twitch.tv/kraken/channels/",
		streamersList = $(".streamers-list ul"),
		defaultLogo = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";

function Streamer(){
	this.name = null;
	this.pic = null;
	this.url = null;
	this.streamDesc = null;
}
Streamer.prototype.DOMHandler = function(stremer){
	
};

var createEmptyStreamer = function(s){
	var li  = $(document.createElement("li")),
		img = $(document.createElement("img")).addClass("float-left"),
		name   = $(document.createElement("p")).addClass("name"),
		details   = $(document.createElement("p")).addClass("details"),
		span   = $(document.createElement("span")).addClass("stream-state float-right");
	
	li.append(img, name, details, span);
	console.log(li);
	return li;
};

var streamerOnline = function(channel){
	/*
	<li title="streaming now" class="text-left">
		<img class="float-left inline-block" src="http://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-f1b681380c0b0380-300x300.png">
		<p class="name">GeoffStorbeck</p>
		<span class="stream-state float-right on"></span>
		<p class="details float-left inline-block">Lorem ipsum dolor sit amet</p>
	</li>
	*/
	var s = createEmptyStreamer();
	s.attr("title", "online");
	s.addClass("text-left");
	s.find("img").attr("src", (channel.logo) ? channel.logo : defaultLogo);
	s.find(".name").text(channel.display_name);
	s.find(".details").text(channel.status);
	s.find(".stream-state").addClass("on");

	streamersList.append(s)
};
var streamerOffline = function(streamerName){

	$.get(channelsUrl+streamerName+"?callback=?", function(channel){
		var s = createEmptyStreamer();
		console.log("Offline : ", channel)
		if(channel.error){
			s.find("img").attr("src", defaultLogo)
			s.find("p").text(channel.message).css('text-decoration', "line-through");
			streamersList.append(s);
			console.log(channel.message)
		}else{
			/*
				<li title="offline">
					<img class="float-left" src="http://static-cdn.jtvnw.net/jtv_user_pictures/habathcx-profile_image-d75385dbe4f42a66-300x300.jpeg">
					<p class="name">GeoffStorbeck</p>
					<span class="stream-state float-right off"></span>
				</li>
			*/
			s.attr("title", "offline");
			s.find("img").attr("src", (channel.logo) ? channel.logo : defaultLogo);
			s.find(".name").text(channel.display_name);
			s.find(".stream-state").addClass("off");
			streamersList.append(s);
		}

	}, "jsonp");

};
	
	streamersNames.forEach(function(streamerName){
		$.get(streamsUrl+streamerName+"?callback=?", function(data){
			if(data.stream){
				streamerOnline(data.stream.channel)
			}else{
				streamerOffline(streamerName)
			}
		}, "jsonp");
	});
});