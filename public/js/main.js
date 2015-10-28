console.log(":0");

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
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
			var img = document.createElement("img");
			img.className = "petPic";
			img.file = file;
			
			var reader = new FileReader();
			reader.onload = (function(aImg) {
				return function(event) {
					aImg.src = event.target.result;
				};
			})(img);
			reader.readAsDataURL(file);

			setTimeout(function() {
				$("#popup")[0].appendChild(img);
			}, 5000);
		};
	})

})
