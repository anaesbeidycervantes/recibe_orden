document.addEventListener("DOMContentLoaded", function() {
    let ultimaOrdenConocida = null;
    let audioActual; // Variable para almacenar el audio actual

    const actualizarOrden = async () => {
        try {
            const response = await ultimaOrden();
            if (response && response.value) {
                const { value } = response;
                const pOrden = document.getElementById("orden");
                if (pOrden) {
                    pOrden.innerText = value.orden;
                    if (value.orden && value.orden !== ultimaOrdenConocida) {
                        ultimaOrdenConocida = value.orden;
                        ejecutarOrden(value.orden);
                        console.log('Orden ejecutada correctamente:', value.orden);
                    } else {
                        console.log('La orden recibida es indefinida o ya ha sido ejecutada previamente.');
                    }
                } else {
                    console.error('Elemento "orden" no encontrado.');
                }
            } else {
                console.error('No se recibió ningún dato de orden.');
            }
        } catch (error) {
            console.error('Error al actualizar la orden:', error);
        }
    };

    // Función para ejecutar la orden
    const ejecutarOrden = (orden) => {
        const usuario = ''; // Agrega el usuario correspondiente
        const fechaHora = new Date().toLocaleString(); // Obtiene la fecha y hora actual
        switch (orden.toLowerCase()) {
            // Sala
            case 'prender sala':
                document.querySelector('.imagen-orden[alt="Foco Sala"]').src = 'imágenes/foco_on_sala.png';
                break;
            case 'apagar sala':
                document.querySelector('.imagen-orden[alt="Foco Sala"]').src = 'imágenes/foco_off_sala.png';
                break;
            // Cuarto
            case 'prender cuarto':
                document.querySelector('.imagen-orden[alt="Foco Recámara"]').src = 'imágenes/foco_on_cuarto.png';
                break;
            case 'apagar cuarto':
                document.querySelector('.imagen-orden[alt="Foco Recámara"]').src = 'imágenes/foco_of_cuarto.png';
                break;
            // Cortinas
            case 'abrir cortinas':
                document.querySelectorAll('.imagen-orden[alt="Cortina"]').forEach(function(cortina) {
                    cortina.src = 'imágenes/cortina_abierta.png';
                });
                break;
            case 'cerrar cortinas':
                document.querySelectorAll('.imagen-orden[alt="Cortina"]').forEach(function(cortina) {
                    cortina.src = 'imágenes/cortina_cerrada.jpg';
                });
                break;
            // Ventilador
            case 'prender ventilador':
                document.querySelector('.imagen-orden[alt="Ventilador"]').src = 'imágenes/ventilador_on.gif';
                break;
            case 'apagar ventilador':
                document.querySelector('.imagen-orden[alt="Ventilador"]').src = 'imágenes/ventilador_off.png';
                break;
            // Jardín
            case 'prender luces':
                document.querySelectorAll('.imagen-orden[alt="Foco Jardín"]').forEach(function(img) {
                    img.src = 'imágenes/foco_on_jardin.png'; 
                });
                break;
            case 'apagar luces':
                document.querySelectorAll('.imagen-orden[alt="Foco Jardín"]').forEach(function(img) {
                    img.src = 'imágenes/foco_off_jardin.png'; 
                });
                break;
            // Cámaras
            case 'prender cámaras':
                document.querySelectorAll('.imagen-orden[alt="Cámaras"]').forEach(function(img) {
                    img.src = 'imágenes/on_camara_seguridad.gif'; 
                });
                break;
            case 'apagar cámaras':
                document.querySelectorAll('.imagen-orden[alt="Cámaras"]').forEach(function(img) {
                    img.src = 'imágenes/off_camara_seguridad.png'; 
                });
                break;
            // Alarma
            case 'enciende alarma':
                // Reproducir audio de alarma
                reproducirAudio('imágenes/alarma_off.mp3');
                // Cambiar imagen de la alarma
                document.querySelector('.imagen-orden[alt="Alarma"]').src = 'imágenes/alarma_prendida.png';
                break;
            case 'apaga alarma':
                // Reproducir audio de alarma
                reproducirAudio('imágenes/alarma_on.mp3');
                // Cambiar imagen de la alarma
                document.querySelector('.imagen-orden[alt="Alarma"]').src = 'imágenes/alarma_apagada.png';
                break;
            default:
                console.log('Orden no reconocida.');
        }
    };

    // Función para reproducir audio
    function reproducirAudio(ruta) {
        // Detener el audio actual antes de reproducir uno nuevo (si hay uno en reproducción)
        if (audioActual) {
            audioActual.pause();
        }
        
        // Crear un nuevo elemento de audio y reproducirlo
        const audio = new Audio(ruta);
        audio.play();

        // Actualizar la referencia al audio actual
        audioActual = audio;
    }  

    // Función para obtener la última orden
    async function ultimaOrden() {
        try {
            const json = await obtenerJson();
            const arrJson = Object.keys(json).map(key => ({ key, value: json[key] }));
            let ultimoElemento;

            for (const orden of arrJson) {
                ultimoElemento = orden;
            }

            console.log('Datos obtenidos correctamente.'); // Mensaje en la consola si se obtuvieron los datos correctamente
            return ultimoElemento;
        } catch (error) {
            console.error('Error al obtener los datos:', error); // Mensaje en la consola si ocurrió un error al obtener los datos
            throw error;
        }
    }

    // Función para obtener los datos de acciones realizadas
    function obtenerJson() {
        return new Promise((resolve, reject) => {
            fetch('https://663042b0c92f351c03d96363.mockapi.io/casa', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener el recurso');
                    }
                    return response.json();
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    reject(error);
                });
        });
    }

    // Llamar a la función actualizarOrden() cada 2 segundos usando setInterval()
    setInterval(actualizarOrden, 2000);

    // Llamar a la función actualizarOrden() inicialmente
    actualizarOrden();
});
