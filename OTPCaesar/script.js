const input_text = document.getElementById("input_data");
const backButton = document.getElementById("back");
const downloadButton = document.getElementById("download");
const padFile = document.getElementById("pad_input");
const encryptButton = document.getElementById("encrypt");
const decryptButton = document.getElementById("decrypt");
const copyButton = document.getElementById("copy");
const outText = document.getElementById("out");
const data = document.getElementById("data");

const codification = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let padData = null; 
let pointer = 0; 

function download(data, filename) {
    let file_data = JSON.stringify(data);
    let file = new Blob([file_data], { type: "text/plain" });
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
    return function() { 
        location.href = site;
    };
}

function download_otp(otp_data, index) {
    let otp = {
        data: otp_data,
        pointer: index,
    };
    download(otp, "otp.json");
}

function loadPad() {
    if (padFile.files && padFile.files[0]) {
        let file = padFile.files[0];
        let reader = new FileReader();

        reader.onload = function(e) {
            padData = JSON.parse(e.target.result).data; 
            pointer = JSON.parse(e.target.result).pointer; 
        };
        reader.readAsText(file);
    } else {
        alert("Please, load a PadFile");
    }
}

function encryptDecrypt(text, encrypt) {
    if (!padData) {
        alert("Please, load a PadFile");
        return "";
    }

    let inputText = text.toUpperCase();
    let outputText = "";

    for (let char of inputText) {
        let charIndex = codification.indexOf(char);
        if (charIndex !== -1) {
            let padValue = padData[pointer];
            let resultIndex;

            if (encrypt) {
                resultIndex = (charIndex + padValue) % codification.length;
            } else {
                resultIndex = (charIndex - padValue + codification.length) % codification.length;
            }

            outputText += codification[resultIndex];
            pointer = (pointer + 1) % padData.length;
        } else {
            outputText += char;
        }
    }
    return outputText;
}

backButton.addEventListener("click", gosite("https://guille-ux.github.io"));

padFile.addEventListener("change", loadPad);

encryptButton.addEventListener("click", () => {
    data.textContent = encryptDecrypt(input_text.value, true);
});

decryptButton.addEventListener("click", () => {
    outText.textContent = encryptDecrypt(input_text.value, false);
});

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(outText.textContent)
        .then(() => {
            console.log("Text Copied!");
        })
        .catch(err => {
            console.error("Error Copying", err);
        });
});

downloadButton.addEventListener("click", () =>{
    download_otp(padData,pointer);
});
