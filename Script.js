const webcam = document.querySelector('#video') // variavel para webcam

Promise.all([ // Retorna apenas uma promisse quando todas já estiverem resolvidas
//Promises é um objeto em JavaScript que permite a execução de processamentos de forma assíncrona dentro do seu código
    
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),// É igual uma detecção facial normal, porém menor e mais rapido
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),// Pegar os pontos de referencia do rosto.
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),// Vai permitir a api saber onde o rosto está localizado no video
    faceapi.nets.faceExpressionNet.loadFromUri('/models') // Vai permitir a api saber suas expressões.

]).then(startVideo)

async function startVideo() {      //função para estartar o video 
    const constraints = { video: true };//objeto

    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);

        webcam.srcObject = stream;
        webcam.onloadedmetadata = e => {
            webcam.play();// iniciar a webcam
        }

    } catch (err) {     // mostrar erro
        console.error(err);
    }
}

webcam.addEventListener('play', () => {

    const canvas = faceapi.createCanvasFromMedia(video)// Criando canvas para mostrar nossos resultador
    document.body.append(canvas)// Adicionando canvas ao body

    const displaySize = { width: webcam.width, height: webcam.height }// criando tamanho do display a partir das dimenssões da nossa webcam

    faceapi.matchDimensions(canvas, displaySize)// mostra o quadrado onde o rosto esta sempre

    setInterval(async () => { // Intervalo para detectar os rostos a cada 100ms
        const detections = await faceapi.detectAllFaces(//detectAllFaces pega mais de uma face na webcam
            webcam, // Primeiro parametro é nossa camera
            new faceapi.TinyFaceDetectorOptions()// Qual tipo de biblioteca vamos usar para detectar os rostos

        )
            .withFaceLandmarks()// Vai desenhar os pontos de marcação no rosto
            .withFaceExpressions()// Vai determinar nossas expressões


        const resizedDetections = faceapi.resizeResults(detections, displaySize) // Redimensionado as detecções


        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)// Apagando nosso quadrado antes de desenhar outro

        faceapi.draw.drawDetections(canvas, resizedDetections) // Desenhando o quadrado da  decções
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) // Desenhando os pontos de referencia
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections) // Mostra as expressões

    }, 100);
})

