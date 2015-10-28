console.log(":0");

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function surprise(img, audio) {
	$("#popup")[0].appendChild(img);
	audio.play();
	$("button.stop").show();
}

function surpriseEnd(img, audio) {
	audio.pause();
}

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

			setTimeout(function(){
				surprise(img, audio);
			}, 5000);
		};
	})

})
