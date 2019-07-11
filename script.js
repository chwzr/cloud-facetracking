const video = document.getElementById('video')
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    resizedDetections.forEach(rdetection => {
      let lx = rdetection.landmarks.getLeftEye()[0].x;
      let ly = rdetection.landmarks.getLeftEye()[0].y;
      let rx = rdetection.landmarks.getRightEye()[0].x;
      let ry = rdetection.landmarks.getRightEye()[0].y;
      let nx = rdetection.landmarks.getNose()[4].x;
      let ny = rdetection.landmarks.getNose()[4].y;
      let ex = rdetection.landmarks.getLeftEyeBrow()[2].x;
      let ey = rdetection.landmarks.getLeftEyeBrow()[2].y;
      let ctx = canvas.getContext("2d");
      ctx.font = "30px Replica";
      // ctx.fillText("[", lx,ly + 10);
      // ctx.fillText("]", rx,ry + 10);
      ctx.fillText("[cloud]", ex,ey - 12);
    })
  }, 100)
})