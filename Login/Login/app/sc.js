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
setTimeout(async() => {
  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
  const resizedDetections = faceapi.resizeResults(detections, displaySize)
  console.table(detections[0].expressions)
  function openReplacement(method, url, async, user, password) {  
    this._url = url;
    return open.apply(this, arguments);
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:7080/mtest", true);
  
  
  xhr.setRequestHeader("Content-Type", "application/json");
  var jsonstring = JSON.stringify(detections[0].expressions);
     console.table(jsonstring);
     xhr.send(jsonstring);
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  faceapi.draw.drawDetections(canvas, resizedDetections)
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
},1000)
})

  
