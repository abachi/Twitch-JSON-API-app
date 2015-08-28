$(document).ready(function(){
/*
User Story: As a user, I can see whether Free Code Camp is currently streaming on Twitch.tv.

User Story: As a user, I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.

User Story: As a user, if Free Code Camp is streaming, I can see additional details about what they are streaming.

Bonus User Story: As a user, I can search through the streams listed.

Bonus User Story: As a user, I will see a placeholder notification if a streamer has closed their Twitch account. You can verify this works by adding brunofin and comster404 to your array of Twitch streamers.

*/
	var streamersNames = ["comster404", "freecodecamp", "newjs", "storbeck", "pokerstarsfrance", "terakilobyte", "meow", "habathcx", "Izzaldin2001", "pax", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff"],
		streamsUrl="https://api.twitch.tv/kraken/streams/", // online == stream obj,
		channelsUrl="https://api.twitch.tv/kraken/channels/",
		streamersList = $(".streamers-list ul"),
		defaultLogo = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png",
		search = $(".search input"),
		MAX_LINE = 40;

// return a jQuery obj that have a 'name' string
var getStreamerItem = function(name){
		var lis = $(streamersList.children("li")),
			item;
		for(var i=0; i<lis.length; i++){
			if($(lis[i]).find(".name").text().toLowerCase() == name.toLowerCase())
			return $(lis[i]);
		}
};
var createEmptyStreamer = function(s){

	var a = $(document.createElement("a"))
										  .attr("href", (s.url) ? s.url: "")
											.attr("target", "_blank"),
		li  = $(document.createElement("li")),
		img = $(document.createElement("img")).addClass("float-left"),
		name   = $(document.createElement("p")).addClass("name"),
		details   = $(document.createElement("p")).addClass("details"),
		span   = $(document.createElement("span")).addClass("stream-state float-right");
	a.append(img, name, details, span);
	li.append(a);
	return li;
};

var streamerOnline = function(channel){

	var s = createEmptyStreamer(channel);
	s.attr("title", "Streaming now.. "+channel.status);
	s.addClass("text-left");
	s.find("img").attr("src", (channel.logo) ? channel.logo : defaultLogo);
	s.find(".name").text(channel.display_name);
	s.find(".details").text((channel.status.length < MAX_LINE) ? channel.status : channel.status.substring(0, MAX_LINE)+"...");
	s.find(".stream-state").addClass("on");

	streamersList.append(s)
};
var streamerOffline = function(streamerName){

	$.get(channelsUrl+streamerName+"?callback=?", function(channel){
		var s = createEmptyStreamer(channel);
		if(channel.error){
			s.find("img").attr("src", defaultLogo)
			s.find(".name").text(streamerName).parents("li").addClass("error");
			s.find(".details").text(channel.message);
		}else{
			s.attr("title", "Offline");
			s.addClass("offline");
			s.find("img").attr("src", (channel.logo) ? channel.logo : defaultLogo);
			s.find(".name").text(channel.display_name);
			s.find(".stream-state").addClass("off");
		}
		streamersList.append(s);

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

var isStartWith = function(txt, s){
	return txt.substring(0, s.length) == s	
};
	search.on("keyup", function(){
		var txt = $(this).val().trim()
		if(txt.length < 1){
			$(streamersList.children("li")).css('display', 'block')
		}
		streamersNames.forEach(function(name){
			var item = getStreamerItem(name.toLowerCase())
			
			if(!isStartWith(name.toLowerCase(), txt.toLowerCase())){
				console.log('hada ta3 '+name.toLowerCase(), item)
				if(item)
					$(item[0]).css('display', 'none')
			}else{
				if(item)
					$(item[0]).css('display', 'block')
			}
		});
	});
});