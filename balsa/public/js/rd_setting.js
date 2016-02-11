
var rocketUtil = {
	sendFileUpload : function(fileObj, sUrl, fnCallback) {
		var xhr 		= new XMLHttpRequest();
		var formData 	= new FormData()
		formData.append('uploaddata', fileObj);
		xhr.open('POST', sUrl);
		xhr.send(formData);

		xhr.addEventListener("load", function(evt) {
			var htResult 	= JSON.parse(evt.target.responseText);
			fnCallback(htResult);
		});
	}
};

(function(doc,win) {
	document.addEventListener("DOMContentLoaded", function(){
		init();
	});

	function init() {
		registerEvents();
	}

	function registerEvents() {
		registerAccountTRPlus();
		registerInputFileChange();
	}

	function registerInputFileChange() {
		var elBtn 			= doc.querySelector("button.imageUpload");
		var elFileInput 	= doc.getElementById('companyImageInput');
		var elImagePreview 	= doc.querySelector("#companyImgPreview");

		var fnAfterReceiveData = function(htResult) {
			var sImageURL 		= htResult.data[0].file_uuid;
			elImagePreview.src 	= "/uploadImage/" + sImageURL;
		}

		elFileInput.addEventListener("change", function() {
			var fileObj = document.getElementById('companyImageInput').files[0];
			rocketUtil.sendFileUpload(fileObj, '/upload', fnAfterReceiveData);
		});
	}


	function registerAccountTRPlus() {
		var el = doc.querySelector(".ui.icon.button.plus");
		el.addEventListener("click", function(evt){
			evt.preventDefault();
			appendRow(evt.target);
		});
	}

	function appendRow(elTarget) {
		var sTemplate 		= doc.querySelector("#tableRow").innerHTML;
		var elCurrentButton = (elTarget.nodeName === "BUTTON") ? elTarget : elTarget.parentElement;	
		var elCurrentTR 	= elCurrentButton.parentElement.parentElement.parentElement;
		var elCurrentNextTR = elCurrentTR.nextElementSibling;
		var elTbody 		= doc.querySelector("#accountInfo tbody");

		//var elCopy 			= elTbody.querySelector("tr:last-child").cloneNode(true);
		var elCopy 			= elCurrentTR.cloneNode(true);
		var elCopyPlusBtn 	= elCopy.querySelector(".ui.icon.button.plus");
		var elCopyMinusBtn 	= elCopy.querySelector(".ui.icon.button.minus");


		if(elCurrentNextTR && elCurrentNextTR.nodeName === "TR") {
			elTbody.insertBefore(elCopy, elCurrentTR.nextElementSibling);
		} else {
			elTbody.appendChild(elCopy);
		}

		//register event handler
		elCopyPlusBtn.addEventListener("click", function(evt){
			evt.preventDefault();
			appendRow(evt.target);
		});

		elCopyMinusBtn.addEventListener("click", function(evt){
			evt.preventDefault();
			deleteRow(evt.target);
		});
	}

	function deleteRow(elTarget) {
		var elCurrentButton = (elTarget.nodeName === "BUTTON") ? elTarget : elTarget.parentElement;	
		var elCurrentTR = elCurrentButton.parentElement.parentElement.parentElement;
		elCurrentTR.parentElement.removeChild(elCurrentTR);
	}


})(document,window);
