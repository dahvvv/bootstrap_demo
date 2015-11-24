var Surprise = function(args) {
	this.audio = args.audio;
	this.pic = args.pic;
	this.tagsToHide = args.tagsToHide;

	var that = this;
	this.pic.addEventListener("click", this.end.bind(that));
};

Surprise.prototype.begin = function() {
	this.audio.play();
	$(this.pic).show();
	$(this.tagsToHide).hide();
};

Surprise.prototype.end = function() {
	this.audio.pause();
	$(this.pic).hide();
	$(this.tagsToHide).show();
};

Surprise.prototype.countdown = function() {
	var timeStartHours = hours12To24(timeStart.hours, timeStart.meridiem);
	var msStart = distanceFromNow(timeStartHours, timeStart.minutes);
	var timeEndHours = hours12To24(timeEnd.hours, timeEnd.meridiem);
	var msEnd = distanceFromNow(timeEndHours, timeEnd.minutes);
	var msRand = Math.floor(Math.random() * (msEnd - msStart)) + msStart;

	var that = this;
	return setTimeout(this.begin.bind(that), msRand);
};
