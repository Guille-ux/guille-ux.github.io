// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
// Copyright (c) 2025 Guillermo Leira Temes
// 
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
