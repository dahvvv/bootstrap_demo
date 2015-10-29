console.log(":0");

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function surpriseBegin(audio) {
	$("#petPic").show();
	audio.play();
	$("button.stop").show();
}

function surpriseEnd(img, audio) {
	audio.pause();
	$(img).hide();
}

function prepareSurprise(audio) {
	var timeStartHours = hours12To24(timeStart.hours, timeStart.meridiem);
	var timeEndHours = hours12To24(timeEnd.hours, timeEnd.meridiem);
	var msStart = distanceFromNow(timeStartHours, timeStart.minutes);
	var msEnd = distanceFromNow(timeEndHours, timeEnd.minutes);
	var msRand = Math.floor(Math.random() * (msEnd - msStart)) + msStart;

	setTimeout(function(){
		surpriseBegin(audio);
	}, msRand);
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

var timeStart = { "hours": 1, "minutes": 7, "meridiem": "AM" };
var timeEnd = { "hours": 1, "minutes": 8, "meridiem": "AM" };

$(function() {

	$("a.about").click(function(e) {
		e.preventDefault();
		$("p.about").slideToggle();
	})

	$("#browse-button").click(function() {
		$("input[type='file']").click();
	});

	$("#upload-form").submit(function(e) {
		e.preventDefault();
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
				surpriseEnd(img, audio);
			});
			$("#popup")[0].appendChild(img);
			
			var reader = new FileReader();
			reader.onload = (function(aImg) {
				return function(event) {
					aImg.src = event.target.result;
				};
			})(img);
			reader.readAsDataURL(file);

			prepareSurprise(audio);
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

		dropdown.querySelector(".dropdown-toggle").innerText = timeStartOrEnd[minutesHoursOrMeridiem];

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
				
			}
		});
	
	});

})
