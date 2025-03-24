const input=document.getElementById("otplen");
const out=document.getElementById("msg-box");
const genButton=document.getElementById("gen");
const maxValue=36;
let otp_data = [];

function randomInt(max) {
	return Math.floor(Math.random()*max);
}

function download(data, filename) {
	let file_data = JSON.stringify(data);
	let file = new Blob([file_data], {type: "text/plain"});
	let url = URL.createObjectURL(file);
	let a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function gosite(site) {
	location.href = site;
}

function download_otp() {
	let otp = {
			data: otp_data,
			pointer: 0
		};
	download(otp, "otp.json");
}

function gen_otp() {
	otp_data = [];
	let otp_length=parseInt(input.value);
	for (let i=0; i<otp_length;i++) {
		otp_data.push(randomInt(maxValue));
	}
	out.innerText += "OTP created, ready for download, Thank for use! \n";
}

gen.addEventListener("click", gen_otp);
