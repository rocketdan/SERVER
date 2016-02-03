(function(doc,win) {
	document.addEventListener("DOMContentLoaded", function(){
		init();
	});

	function init() {
		registerEvents();
	}

	function registerEvents() {
		uploadCompanyImage();
		plusTR();
	}

	function plusTR() {
		var el = doc.querySelector(".ui.icon.button.plus");
		el.addEventListener("click", function(evt){
			evt.preventDefault();
			appendRow(evt.target);
		});
	}

	function minusTR() {
		var el = doc.querySelector(".ui.icon.button.minus");
		el.addEventListener("click", function(evt){
			evt.preventDefault();
			deleteRow(evt.target);
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

	function uploadCompanyImage() {
    	var xhr 		= new XMLHttpRequest();
		var elBtn 		= doc.querySelector("button.imageUpload");

		elBtn.addEventListener("click", function(evt){
			evt.preventDefault();
			var formData 	= new FormData()
			var file = doc.getElementById('companyImageInput').files[0];
			formData.append('file', file);
			xhr.open('POST', 'myserver/uploads');
			xhr.send(formData);
		});
	}

})(document,window);