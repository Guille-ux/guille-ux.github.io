const n_keys = 18;
const keyboard_container = document.getElementById("keyboard");

function buildKeyBoard() {
  for (let i=1;i<n_keys;i++) {
    const newKey = document.createElement("div");
    newKey.className = "key";
    newKey.innerText = "0x" + scancode.toString(16).toUpperCase().padStart(2, '0');
    document.appendChild(newKey);
  }
}

buildKeyBoard();
