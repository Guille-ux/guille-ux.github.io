const n_keys = 105;
const keyboard_container = document.getElementById("#keyboard");
const generate_button = document.getElementById("#generate_button");
const resultado = document.getElementById("#resultado");

function buildKeyBoard() {
  for (let i=0;i<n_keys;i++) {
    const newKey = document.createElement("div");
    newKey.className = "key";
    let scancode = i + 1;
    newKey.innerText = "0x" + scancode.toString(16).toUpperCase().padStart(2, '0');
    const character = document.createElement("input");
    character.className = "character";
    newKey.appendChild(character);
    keyboard_container.appendChild(newKey);
  }
}

buildKeyBoard();

function returnCodes() {
  resultado.value = "char keyboard_layout[] = [ 0";
  for (let i=0;i<n_keys;i++) {
    resultado.value += ", '" + keyboard_container.children[i].children[0].value + "'";
  }
  resultado.value += " ];";
}

generate_button.addEventListener("click", returnCodes, false)
