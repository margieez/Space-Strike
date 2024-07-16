document.addEventListener('DOMContentLoaded', function() {
    let gamePaused = false;
    let spawnTimer;
    let fallDuration = 5;
    let spawnInterval = 1000;
    let posX, posY;

    // Reproducir el audio de fondo al cargar la página
    const backgroundAudio = document.getElementById('background-audio');
    backgroundAudio.play();

    // Evento para el botón de "Play"
    document.getElementById('play-button').addEventListener('click', function() {
        // Ocultar menú y mostrar pantalla de carga
        document.getElementById('menu').style.display = 'none';
        document.getElementById('loader').style.display = 'flex';

        // Iniciar animación de carga después de un breve tiempo para que se vea
        setTimeout(function() {
            document.querySelector('.bar').style.animationPlayState = 'running';

            // Mostrar el juego después de la pantalla de carga
            setTimeout(function() {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('game-container').style.display = 'flex';
                
                // Iniciar el juego
                startGame();
            }, 5000); // 5000 milisegundos = 5 segundos
        }, 100); // Inicia la animación después de 100 milisegundos para asegurarse de que se vea
    });

    function startGame() {
        const movableDiv = document.getElementById('movable-div');
        const container = document.getElementById('container');
        posX = window.innerWidth / 2;
        posY = window.innerHeight / 2;

        // Mover el div con las teclas del teclado
        document.addEventListener('keydown', function(event) {
            if (!gamePaused) {
                const step = 10;
                switch(event.key) {
                    case 'ArrowUp':
                        posY = Math.max(0, posY - step);
                        break;
                    case 'ArrowDown':
                        posY = Math.min(window.innerHeight - movableDiv.offsetHeight, posY + step);
                        break;
                    case 'ArrowLeft':
                        posX = Math.max(0, posX - step);
                        break;
                    case 'ArrowRight':
                        posX = Math.min(window.innerWidth - movableDiv.offsetWidth, posX + step);
                        break;
                }
                movableDiv.style.top = posY + 'px';
                movableDiv.style.left = posX + 'px';

                // Verificar colisión con enemigos
                checkCollisions();
            }
        });

        // Función para crear enemigos
        function createEnemy() {
            if (!gamePaused) {
                const enemyDiv = document.createElement('div');
                enemyDiv.classList.add('enemy-div');
                enemyDiv.style.left = Math.random() * (window.innerWidth - 50) + 'px';
                enemyDiv.style.animationDuration = fallDuration + 's';
                container.appendChild(enemyDiv);

                // Eliminar el div después de que salga de la pantalla
                setTimeout(() => {
                    enemyDiv.remove();
                }, fallDuration * 1000); // Duración de la animación

                // Verificar colisión con enemigos
                checkCollisions();
            }
        }

        // Crear enemigos a intervalos regulares
        spawnTimer = setInterval(createEnemy, spawnInterval);

        // Función para verificar colisiones
        function checkCollisions() {
            const movableRect = movableDiv.getBoundingClientRect();
            const enemies = document.getElementsByClassName('enemy-div');

            for (let enemy of enemies) {
                const enemyRect = enemy.getBoundingClientRect();
                if (isColliding(movableRect, enemyRect)) {
                    // Colisión detectada
                    pauseGame();
                    showRestartPopup();
                    return;
                }
            }
        }

        // Función para detectar colisión entre dos elementos rectangulares
        function isColliding(rect1, rect2) {
            return !(rect1.right < rect2.left ||
                     rect1.left > rect2.right ||
                     rect1.bottom < rect2.top ||
                     rect1.top > rect2.bottom);
        }

        // Función para pausar el juego
        function pauseGame() {
            gamePaused = true;
            clearInterval(spawnTimer);
        }

        // Función para mostrar la ventana emergente de reinicio
        function showRestartPopup() {
            const popup = document.createElement('div');
            popup.classList.add('popup');
            popup.innerHTML = `
                <div class="popup-content">
                    <p>¡Has perdido!</p>
                    <button id="restartButton">Reiniciar Juego</button>
                </div>
            `;
            document.body.appendChild(popup);

            // Agregar evento al botón dentro de la ventana emergente
            document.getElementById('restartButton').addEventListener('click', function() {
                // Cierra la ventana emergente
                popup.remove();
                
                // Reinicia el juego
                restartGame();
            });
        }

        // Función para reiniciar el juego
        function restartGame() {
            gamePaused = false;
            document.querySelectorAll('.enemy-div').forEach(e => e.remove());
            posX = window.innerWidth / 2;
            posY = window.innerHeight / 2;
            spawnInterval = 1000; // Restaurar intervalo inicial
            fallDuration = 5; // Restaurar duración inicial
            startGame(); // Volver a iniciar el juego
        }

        // Incrementar la velocidad y la frecuencia de los enemigos cada 10 segundos
        setInterval(() => {
            if (!gamePaused) {
                if (fallDuration > 1) fallDuration -= 0.5; // Aumentar la velocidad (disminuir duración)
                if (spawnInterval > 200) {
                    clearInterval(spawnTimer);
                    spawnInterval -= 100; // Aumentar la frecuencia (disminuir intervalo)
                    spawnTimer = setInterval(createEnemy, spawnInterval);
                }
            }
        }, 15000); // Cada 10 segundos
    }
});

// Control del fondo y el mini-menú
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos los elementos relevantes del DOM
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    const body = document.body;
    const soundSettingsButton = document.getElementById('sound-settings-button');
    const soundSettingsMenu = document.getElementById('sound-settings-menu');
    const closeSoundSettingsButton = document.getElementById('close-sound-settings');

    // Función para cambiar la imagen de fondo del body
    function cambiarFondo(url) {
        body.style.backgroundImage = `url('${url}')`;
    }

    // Mostrar la imagen de fondo del menú cuando se muestra el menú
    function mostrarMenu() {
        menu.style.display = 'flex'; // Asumiendo que el menú se muestra cambiando el display
        gameContainer.style.display = 'none'; // Ocultamos el contenedor del juego si está visible
        cambiarFondo('https://i.pinimg.com/originals/21/5c/7f/215c7fdca6033092baa04b35c17466bd.gif');
    }

    // Mostrar la imagen de fondo del juego cuando se inicia el juego
    function iniciarJuego() {
        menu.style.display = 'none'; // Ocultamos el menú
        gameContainer.style.display = 'flex'; // Mostramos el contenedor del juego
        cambiarFondo('https://i.pinimg.com/564x/68/01/e8/6801e81cbfa835ca4dfba50c61c0375a.jpg');
    }

    // Evento para el botón de "Play"
    document.getElementById('play-button').addEventListener('click', function() {
        // Simulación de la carga
        document.getElementById('loader').style.display = 'flex';
        setTimeout(function() {
            document.getElementById('loader').style.display = 'none';
            iniciarJuego(); // Llamamos a la función para iniciar el juego después de la carga
        }, 5000); // Simulamos una carga de 5 segundos (ejemplo)
    });

    // Llamamos a la función para mostrar el menú al inicio (por ejemplo, al cargar la página)
    mostrarMenu();

    // Evento para abrir el mini-menú de ajustes de sonido
    soundSettingsButton.addEventListener('click', function() {
        soundSettingsMenu.style.display = 'block';
    });

    // Evento para cerrar el mini-menú de ajustes de sonido
    closeSoundSettingsButton.addEventListener('click', function() {
        soundSettingsMenu.style.display = 'none';
    });

    // Control del audio
    const backgroundAudio = document.getElementById('background-audio');

    document.getElementById('sound-on').addEventListener('click', function() {
        backgroundAudio.play();
    });

    document.getElementById('sound-off').addEventListener('click', function() {
        backgroundAudio.pause();
    });

    document.getElementById('volume-control').addEventListener('input', function() {
        backgroundAudio.volume = this.value;
    });
});
