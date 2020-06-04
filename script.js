const fs = require('fs')
const getVideoWH = require('./vidMetadata')
const readVideo =async(path)=>{

    const {width,height} = await getVideoWH(path)
    const HW = height.toString()+'x'+width.toString()
    const logStream = fs.createWriteStream('./logFile.log');
    
    console.log(HW)
    const spawnProcess = require('child_process').spawn
      ffmpeg = spawnProcess('ffmpeg', [
          '-i', path,
          '-vcodec', 'mjpeg',
          '-f','rawvideo',
          '-s', HW, // size of one frame
          'pipe:1'
      ]);
       
      // ffmpeg.stderr.setEncoding('utf8'); 
      ffmpeg.stderr.pipe(logStream);
      
      let frames = []
      let pushedCounter = 0
      let errorCounter =0
      ffmpeg.stdout.pipe(new ExtractFrames("FFD8FF")).on('data', (data) => {
          frames.push(data)
    })
      return new Promise((resolve)=>{
        ffmpeg.on('close', function (code) {
          console.log("pushed",pushedCounter)
          console.log("Error",errorCounter)
          resolve(frames)
        
          console.log('child process exited with code ' + code);
      })
    });
    
  }
  