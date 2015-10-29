console.log(":0");

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function surpriseBegin() {
	$("#petPic").show();
	$("audio.chosen")[0].play();
	$("button.stop").show();
}

function surpriseEnd(img) {
	$("audio.chosen")[0].pause();
	$(img).hide();
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

// not necessary?
// function hours24To12(hours) {
// 	var meridiem = hours < 12 ? "AM" : "PM";
// 	var hours = hours % 12 ? hours % 12 : 12;
// 	return { "hours": hours, "meridiem": meridiem };
// }

var timeStart = { "hours": 9, "minutes": 0, "meridiem": "AM" };
var timeEnd = { "hours": 5, "minutes": 0, "meridiem": "PM" };
var surprisePrepared;

$(function() {

	$("#browse-button").click(function() {
		$("input[type='file']").click();
	});

	// display name of file once it's been uploaded

	$("input[type='file']").click(function(e) {
		e.target.value = "";
		function pollUpload() {
			if (!e.target.files.length) {
				setTimeout(pollUpload, 0);
			} else {
				var filename = e.target.files[0].name;
				$("#uploaded-filename")[0].innerText = filename;
			}
		}
		pollUpload();
	});

	$("#upload-form").submit(function(e) {
		e.preventDefault();

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
			img.addEventListener("click", function() {
				surpriseEnd(img);
			});
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
			$(soundOptions).removeClass("chosen");
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

		var timeStartOrEnd;
		if (Array.prototype.indexOf.call(dropdown.classList, "start-time") != -1) {
			timeStartOrEnd = timeStart;
		} else {
			timeStartOrEnd = timeEnd;
		}

		var minutesHoursOrMeridiem = Array.prototype.filter.call(dropdown.classList, function(aClass) {
			return ["minutes", "hours", "meridiem"].indexOf(aClass) != -1;
		})[0];

		var display = timeStartOrEnd[minutesHoursOrMeridiem];
		if (minutesHoursOrMeridiem == "minutes") {
			display = twoDigits(display);
		}
		dropdown.querySelector(".dropdown-toggle").innerText = display;

		if (minutesHoursOrMeridiem != "meridiem") {
			var liMin = minutesHoursOrMeridiem == "minutes" ? 0 : 1;
			var liMax = minutesHoursOrMeridiem == "minutes" ? 59 : 12;

			for (var i = liMin; i <= liMax + 1; i++) {
				var li = $("<li>"), a = $("<a>");
				li.attr("role", "presentation");
				a.attr("role", "menuitem").attr("tabindex", "-1").attr("href", "#")
				[0].innerText = minutesHoursOrMeridiem == "minutes" ? twoDigits(i) : i;
				$(dropdown).find("ul").append(li.append(a));
			};
		}

		dropdown.addEventListener("click", function(e) {
			if (e.target.getAttribute("role") == "menuitem") {
				e.preventDefault();

				var newTimeVal = e.target.innerText;
				this.querySelector(".dropdown-toggle").innerText = newTimeVal;
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

