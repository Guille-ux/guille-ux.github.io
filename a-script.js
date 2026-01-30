console.log("The Script is Working!");

terminal = document.createElement("div");
hide_show = document.createElement("button");

terminal_style = document.createElement("style");
hide_show_style = document.createElement("style");

hide_show.id = "hide_show";
terminal.id = "terminal";

function hide_show_term() {
    if (terminal.style.display === "flex") {
        hide_show.innerText = "Show";
        terminal.style.display = "none";
    } else {
        hide_show.innerText = "Hide";
        terminal.style.display = "flex";
    }
}

hide_show.innerText = "Show";

hide_show_style.textContent = `
#hide_show {
    position: fixed;
    top: 20px;
    left: 60px;
    width: 50px;
    height: 20px;
    border-radius: 20px;
    background-color: black;
    font-family: Consolas, Monospace;
    color: white;
    display: flex;
    z-index: 10000;
}
`;

terminal_style.textContent = `
#terminal {
    top: 20px;
    right: 20px;
    width: 500px;
    height: 300px;
    position: fixed;
    display: none;
    background-color: black;
    border-radius: 20px;
    color: #00ffaa;
    font-family: Consolas, Monospace;
    z-index: 100000;
}
`;

hide_show.addEventListener("click", hide_show_term);

document.head.appendChild(hide_show_style);
document.head.appendChild(terminal_style);
document.body.appendChild(hide_show);
document.body.appendChild(terminal);
