console.log(":0");

function surpriseBegin() {
	$("#petPic").show();
	$("audio.chosen")[0].play();
	$(".init-hidden, #browse-button").hide();
}

function surpriseEnd() {
	$("audio.chosen")[0].pause();
	$("#petPic").hide();
	$(".init-hidden, #browse-button").show();
}

function prepareSurprise() {
	var timeStartHours = hours12To24(timeStart.hours, timeStart.meridiem);
	var timeEndHours = hours12To24(timeEnd.hours, timeEnd.meridiem);
	var msStart = distanceFromNow(timeStartHours, timeStart.minutes);
	var msEnd = distanceFromNow(timeEndHours, timeEnd.minutes);
	var msRand = Math.floor(Math.random() * (msEnd - msStart)) + msStart;

	return setTimeout(surpriseBegin, msRand);
}

function distanceFromNow(hours, minutes) {
	var now = new Date();
	var future = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
	var distance = future - now;
	while (distance < 0) {
		distance += 24 * 60 * 60 * 1000;
	}
	return distance;
}

function hours12To24(hours, meridiem) {
	hours = (meridiem == "AM") ? (hours % 12) : (hours % 12 + 12);
	return hours;
}

function twoDigits(num) {
	if (String(num).length == 1) {
		num = "0" + num;
	}
	return num;
}

var timeStart = { "hours": 9, "minutes": 0, "meridiem": "AM" };
var timeEnd = { "hours": 5, "minutes": 0, "meridiem": "PM" };
var surprisePrepared;

$(function() {

	$("#browse-button").click(function() {
		$("input[type='file']").click();
	});

	// once a file has been uploaded,
	// display the file's name
	// and show the rest of the form's html

	$("input[type='file']").click(function(e) {
		e.target.value = "";
		function pollUpload() {
			if (!e.target.files.length) {
				setTimeout(pollUpload, 0);
			} else {
				var filename = e.target.files[0].name;
				$("#uploaded-filename").html(filename);
				console.log('$("#uploaded-filename"):', $("#uploaded-filename"));
				$(".init-hidden").show();
				$("input[type='radio']")[0].focus();
				$(".about").hide();
			}
		}
		pollUpload();
	});

	$("#upload-form").submit(function(e) {
		e.preventDefault();

		// change the submit button's appearance
		
		$(this).find("input[type='submit']").css("background-color", "#E9E9E9");
		$("#start-hours").focus();

		// create an <img> from the uploaded file and append it to the DOM (but invisibly for now)

		var file = $(this).find("input[type='file']")[0].files[0];
		var imageType = /^image\//;
		if (!imageType.test(file.type)) {
			alert('please select an image to upload');
		} else {
			var audio = $("audio")[0];
			var img = document.createElement("img");
			img.id = "petPic";
			img.file = file;
			img.style.display = "none";
			img.addEventListener("click", surpriseEnd);
			$("#popup")[0].appendChild(img);
			
			var reader = new FileReader();
			reader.onload = (function(aImg) {
				return function(event) {
					aImg.src = event.target.result;
				};
			})(img);
			reader.readAsDataURL(file);

			// choose a species of animal sounds based on the user's animal-species choice, and choose a random audio clip from that species

			var species = $("input[name='species']:checked", "#upload-form").val();
			var soundOptions = $("." + species + "-sounds");
			$("audio").removeClass("chosen");
			var chosenSound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
			$(chosenSound).addClass("chosen");
			console.log("chosen sound:", chosenSound);

			// pick a random moment between the user-selected time boundaries, and tell the <img> to become visible at that moment

			if (surprisePrepared) {
				clearTimeout(surprisePrepared);
			}
			surprisePrepared = prepareSurprise();
		};
	});

	var dropdowns = document.getElementsByClassName("dropdown");
	Array.prototype.forEach.call(dropdowns, function(dropdown) {

		// onload function relating to the time-display dropdown menus

		var timeStartOrEnd;
		if (Array.prototype.indexOf.call(dropdown.classList, "start-time") != -1) {
			timeStartOrEnd = timeStart;
		} else {
			timeStartOrEnd = timeEnd;
		}

		var minutesHoursOrMeridiem = Array.prototype.filter.call(dropdown.classList, function(aClass) {
			return ["minutes", "hours", "meridiem"].indexOf(aClass) != -1;
		})[0];

		// create dropdown buttons and uls for hours and minutes, append to DOM

		if (minutesHoursOrMeridiem != "meridiem") {
			var liMin = minutesHoursOrMeridiem == "minutes" ? 0 : 0;
			var liMax = minutesHoursOrMeridiem == "minutes" ? 59 : 11;
			var label = $(dropdown).hasClass("start-time") ? "start-" : "end-";
			label += minutesHoursOrMeridiem;

			var button = $("<button>"), ul = $("<ul>");
			button.addClass("dropdown-toggle").attr("id",label).attr("data-toggle", "dropdown");
			button.css("background-color", "#0D0000")
			.css("color", "white");
			$(dropdown).append(button);
			ul.addClass("dropdown-menu").attr("role", "menu").attr("aria-labelledby", label);
			var maxHeight = minutesHoursOrMeridiem == "minutes" ? 250 : 150;
			$(ul).css("max-height", maxHeight + "px").css("top", maxHeight / -2 + "px");

			for (var i = liMin; i <= liMax; i++) {
				var li = $("<li>"), a = $("<a>"), display;
				li.attr("role", "presentation");
				a.attr("role", "menuitem").attr("tabindex", "-1").attr("href", "#").html(minutesHoursOrMeridiem == "minutes" ? twoDigits(i) : (i || 12));
				ul.append(li.append(a));
			};

			$(dropdown).append(ul);
		}

		// set DOM to display whatever times are stored in the timeStart and timeEnd js objects

		var display = timeStartOrEnd[minutesHoursOrMeridiem];
		display = minutesHoursOrMeridiem == "minutes" ? twoDigits(display) : (display || 12);
		console.log("display:", display);
		$(dropdown).find(".dropdown-toggle").html(display);

		// add click event so that each item in the dropdown menu will, on click, update the stored time values, update the DOM, and set a new waiting time for the pet surprise

		dropdown.addEventListener("click", function(e) {
			if (e.target.getAttribute("role") == "menuitem") {
				e.preventDefault();

				var newTimeVal = $(e.target).html();
				console.log("newTimeVal:", newTimeVal);
				$(this).find(".dropdown-toggle").html(newTimeVal);
				console.log('$(this).find(".dropdown-toggle"):', $(this).find(".dropdown-toggle"));
				if (minutesHoursOrMeridiem != "meridiem") {
					newTimeVal = parseInt(newTimeVal);
				}
				timeStartOrEnd[minutesHoursOrMeridiem] = newTimeVal;
				
				if ($("#petPic").length) {
					clearTimeout(surprisePrepared);
					prepareSurprise();
				}

			}
		});
	
	});

})

