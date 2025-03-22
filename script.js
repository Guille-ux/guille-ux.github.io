class ReinforcementBot {
    constructor(responsesFile, stopFile, maxSaves, jsonFormat = null, epsilon = 0.1) {
        this.epsilon = epsilon;
        this.maxMat = maxSaves;
        this.responses = responsesFile;
        this.stopWords = stopFile;
        this.pointer = 0;
        this.qs = {};
        this.mat = Array.from({ length: maxSaves }, () => Array(responsesFile.length).fill(0));
        this.last = [0, 0];
    }

    format(text) {
        let formatted = text.toLowerCase()
            .normalize("NFD").replace(/[̀-ͯ]/g, "") // Elimina tildes
            .replace(/[¿?¡!.,'";:-]/g, "")
            .trim()
            .split(" ")
            .filter(word => !this.stopWords.includes(word));
        return formatted.join(" ");
    }

    ask(text) {
        text = this.format(text);
        let num;
        if (text in this.qs) {
            num = this.qs[text];
        } else {
            this.qs[text] = this.pointer;
            num = this.pointer;
            this.pointer++;
        }
        if (this.pointer === this.maxMat) {
            this.pointer = 0;
        }
        
        let maxNum = Math.max(...this.mat[num]);
        let candidates = this.mat[num].map((value, index) => value === maxNum ? index : -1).filter(index => index !== -1);
        let selected = Math.random() < this.epsilon ? Math.floor(Math.random() * this.responses.length) : candidates[Math.floor(Math.random() * candidates.length)];
        
        this.last = [num, selected];
        return this.responses[selected];
    }

    reforce(yn) {
        let v = yn === "y" ? 1 : yn === "n" ? -1 : 0;
        if (v === 0) return 0;
        let [x, y] = this.last;
        this.mat[x][y] += v;
        return 1;
    }
}

const MAX_SAVES = 50000;
const history = [];
const MAX_MESSAGES = 100;
const settingsButton = document.getElementById("ajustes");
const modal = document.getElementById("settings");
const rfile = document.getElementById("responses_file");
const sfile = document.getElementById("stopwords_file");
const save_button = document.getElementById("save");
const goodButton = document.getElementById("y"); //y 
const badButton = document.getElementById("n"); // n
const askButton = document.getElementById("send"); //send
const response = document.getElementById("out_data");
const question = document.getElementById("question");
const information = {};
var chatBot;
const loadButton = document.getElementById("load");
const loadFile = document.getElementById("matrix");

function scrollToBottom() {
	window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
}


function afterMessage() {
	scrollToBottom();
	//más cosas, en el futuro se guardara el historial
}

settingsButton.addEventListener("click", ()=> {
	modal.classList.toggle("hided");
});

save_button.addEventListener("click", async () => {
	const refile = rfile.files[0];
	const safile = sfile.files[0];
	data = [await refile.text(), await safile.text()];
	information.responses = JSON.parse(data[0]);
	information.stopwords = JSON.parse(data[1]);
	chatBot = new ReinforcementBot(information.responses, information.stopwords, MAX_SAVES);
});


const botBase = "<div class='message'> <img src='favicon.svg' alt='Logo' width='50' height='50'>";
const userBase = "<div class='user-message'>";
const downloadButton = document.getElementById("download");

function downFile(filedata, filename) {
	const blob = new Blob([filedata], {type: "text/plain"});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

loadButton.addEventListener("click", async ()=> {
	const myfile = loadFile.files[0];
	const mymatrix = await myfile.text();
	mymatrix = JSON.parse(mymatrix);
	chatBot.pointer = mymatrix.pointer;
	chatBot.mat = mymatrix.mat;
	chatBot.qs = mymatrix.qs;
});

askButton.addEventListener("click", ()=> {
	let userQuestion = question.value;
	let answer = chatBot.ask(userQuestion);
	response.innerHTML += userBase + userQuestion + "</div>";
	response.innerHTML += botBase + answer + "</div>";
	scrollToBottom();
});

downloadButton.addEventListener("click", ()=> {
	let matrix = {
		pointer:chatBot.pointer,
		mat:chatBot.mat,
		qs:chatBot.qs
	};
	let save = JSON.stringify(matrix);
	downFile(save, "save.json");
});

goodButton.addEventListener("click", () => {
	chatBot.reforce("y");
});

badButton.addEventListener("click", () => {
	chatBot.reforce("n");
});
