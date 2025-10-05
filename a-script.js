console.log("The Script is Working!");

// este código es una prueba conceptual hecha con IA, solo queria ver un poco como seria mi idea
document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. CREACIÓN DEL NÚCLEO, ESTILOS Y CLASES DE ESTADO
    // -----------------------------------------------------------------

    // Inyectar Estilos
    const style = document.createElement('style');
    style.textContent = `
        #terminal-container { position: fixed; bottom: 20px; right: 20px; width: 500px; height: 300px; 
            background-color: #1a1a1a; color: #f0f0f0; font-family: 'Consolas', 'Monospace'; 
            padding: 10px; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); 
            display: flex; flex-direction: column; z-index: 10000; }
        #terminal-output { flex-grow: 1; overflow-y: auto; margin-bottom: 5px; white-space: pre-wrap; font-size: 0.9em; }
        #terminal-input-line { display: flex; align-items: center; }
        #prompt-icon { margin-right: 5px; color: #00ffaa; font-weight: bold; }
        #terminal-input { flex-grow: 1; background: none; border: none; color: #f0f0f0; outline: none; font-family: inherit; font-size: 0.9em; }
        .term-error { color: #ff6666; }
        .term-success { color: #66ff66; }
        .term-info { color: #66ccff; }
        .term-output-value { color: #ffcc00; } /* Valor devuelto por eval */
        .term-input-waiting { color: #ffff99; } /* Pregunta de input */
    `;
    document.head.appendChild(style);

    // Crear elementos DOM
    const container = document.createElement('div');
    container.id = 'terminal-container';
    const output = document.createElement('div');
    output.id = 'terminal-output';
    const inputLine = document.createElement('div');
    inputLine.id = 'terminal-input-line';
    const promptIcon = document.createElement('span');
    promptIcon.id = 'prompt-icon';
    promptIcon.textContent = '>>';
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'terminal-input';
    input.autofocus = true;

    inputLine.appendChild(promptIcon);
    inputLine.appendChild(input);
    container.appendChild(output);
    container.appendChild(inputLine);
    document.body.appendChild(container);

    // -----------------------------------------------------------------
    // 2. LÓGICA DEL TERMINAL Y FUNCIÓN INPUT()
    // -----------------------------------------------------------------

    // Cola y estado para manejar la entrada asíncrona
    let inputResolver = null; // Función resolve de la Promesa de input()
    let isWaitingForInput = false; // Bandera de estado

    // Función principal para la salida
    function print(text, className = '') {
        const line = document.createElement('div');
        line.textContent = text;
        line.className = className;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    /**
     * SIMULACIÓN DEL MÉTODO INPUT().
     * Crea y devuelve una Promesa que se resuelve con la siguiente entrada del usuario.
     */
    window.input = function(pregunta) {
        if (isWaitingForInput) {
            print("Error: Ya se está esperando una entrada.", 'term-error');
            return Promise.resolve(null);
        }
        
        isWaitingForInput = true;
        promptIcon.textContent = '??'; // Cambia el prompt para indicar que espera entrada
        print(`> ${pregunta}`, 'term-input-waiting');
        
        return new Promise(resolve => {
            inputResolver = resolve;
        });
    };

    /**
     * Ejecuta el código JS o procesa la entrada de input().
     */
    async function executeCommand(command) {
        // 1. Manejo de la función input()
        if (isWaitingForInput) {
            isWaitingForInput = false;
            promptIcon.textContent = '>>'; // Vuelve al prompt normal
            
            if (inputResolver) {
                inputResolver(command); // Resuelve la Promesa con el comando
                inputResolver = null;
            }
            return; // Termina aquí para no ejecutar eval()
        }

        // 2. Interpretación de JavaScript (eval)
        try {
            // Usa 'await' para permitir que el usuario pruebe código asíncrono
            const result = await eval(`(async () => { ${command} })()`); 
            
            // Muestra el valor de retorno, si existe
            if (result !== undefined) {
                print(`<= ${result}`, 'term-output-value');
            }
        } catch (e) {
            print(`Error JS: ${e.message}`, 'term-error');
        }
    }

    // Manejo de la entrada del usuario al pulsar Enter
    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const command = input.value;
            print(`${promptIcon.textContent} ${command}`, 'term-echo'); 
            input.value = '';
            
            if (command.trim() !== '') {
                await executeCommand(command);
            }
            input.focus();
        }
    });

    // Mensaje de Bienvenida e Instrucciones
    function printWelcomeMessage() {
        print("*************************************************", 'term-info');
        print("  TERMINAL JS CON EVAL() E INPUT() SIMULADO");
        print("  - Escribe cualquier código JS (ej: 2 + 2)");
        print("  - Usa 'await input(\"pregunta\")' para pausar el código.");
        print("*************************************************", 'term-info');
    }

    printWelcomeMessage();
});
