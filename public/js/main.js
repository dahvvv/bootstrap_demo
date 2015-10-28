console.log(":0");

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

$(function() {


$("#browse-button").click(function() {
	$("input[type='file']").click();
});


})
