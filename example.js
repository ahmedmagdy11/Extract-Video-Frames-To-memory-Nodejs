const readVideo = require('./script')



const videoPath = __dirname + '/imagineryVideo.mp4'
// return Frames in array of buffers [buffer<> , buffer<> ,.....]
const frames = await readVideo(videoPath)
console.log(frames.length)




