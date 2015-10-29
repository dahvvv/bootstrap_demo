console.log(":0");

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function surpriseBegin(img, audio) {
	$("#popup")[0].appendChild(img);
	audio.play();
	$("button.stop").show();
}

function surpriseEnd(img, audio) {
	audio.pause();
	$(img).hide();
}

function prepareSurprise(img, audio) {
	var msStart = distanceFromNow(timeStart.hours, timeStart.minutes);
	var msEnd = distanceFromNow(timeEnd.hours, timeEnd.minutes);
	var msRand = Math.floor(Math.random() * (msEnd - msStart)) + msStart;

	setTimeout(function(){
		surpriseBegin(img, audio);
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

function setAMPM(hours, setting) {
	if (["AM", "PM"].indexOf(setting) == -1) {
		return false;
	}
	hours = (setting == "AM") ? (hours % 12) : (hours % 12 + 12);
	return hours;
}

var timeStart = { "hours": 9, "minutes": 0 };
var timeEnd = { "hours": 17, "minutes": 0 };

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
			img.className = "petPic";
			img.file = file;
			img.addEventListener("click", function() {
				surpriseEnd(img, audio);
			});
			
			var reader = new FileReader();
			reader.onload = (function(aImg) {
				return function(event) {
					aImg.src = event.target.result;
				};
			})(img);
			reader.readAsDataURL(file);

			prepareSurprise(img, audio);
		};
	});

	var dropdowns = document.getElementsByClassName("dropdown");
	Array.prototype.forEach.call(dropdowns, function(dropdown) {
		dropdown.addEventListener("click", function(e) {
			if (e.target.getAttribute("role") == "menuitem") {
				e.preventDefault();

				console.log("timeStart:", timeStart);
				console.log("timeEnd:", timeEnd);

				var timeStartOrEnd, minutesOrHours;
				if (Array.prototype.indexOf.call(this.classList, "start-time") != -1) {
					timeStartOrEnd = timeStart;
				} else {
					timeStartOrEnd = timeEnd;
				}
				if (["AM", "PM"].indexOf(e.target.innerText) != -1) {
					timeStartOrEnd.hours = setAMPM(timeStartOrEnd.hours, parseInt(e.target.innerText));
				} else {
					if (Array.prototype.indexOf.call(this.classList, "minutes") != -1) {
						minutesOrHours = "minutes";
					} else {
						minutesOrHours = "hours";
					}
					timeStartOrEnd[minutesOrHours] = parseInt(e.target.innerText);
					this.querySelector(".dropdown-toggle").innerText = e.target.innerText;
				}

				console.log("new timeStart:", timeStart);
				console.log("new timeEnd:", timeEnd);
				
			}
		});
	
	});

})
