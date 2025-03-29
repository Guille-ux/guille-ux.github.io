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
function goback() {
	location.href = "https://guille-ux.github.io";
}

function add_more() {
	history.push(text.value);
	salida.innerText += "\n" + text.value;
	text.value = "";
}

function download_file() {
	let content = JSON.stringify(history);
	let file = new Blob([content], {type:"text/plain"});
	const file_url = URL.createObjectURL(file);
	const a = document.createElement("a");
	a.href = file_url;
	a.target = "_blank";
	a.download = name.value + ".json";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(file_url);
}

const add = document.getElementById("addone");
const text = document.getElementById("question");
let history = [];
const downloadButton = document.getElementById("download");
const out = document.getElementById("salida");
const clear = document.getElementById("clear");
const name = document.getElementById("name");

add.addEventListener("click", add_more);

text.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		add_more();
	}
});

clear.addEventListener("click", () => {
	salida.innerText = "";
	history = [];
});

downloadButton.addEventListener("click", download_file);
name.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		download_file();
	}
});
