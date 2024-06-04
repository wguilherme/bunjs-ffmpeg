const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const video1 = path.join(__dirname, 'video1.mp4');
const video2 = path.join(__dirname, 'video2.mp4');
const image = path.join(__dirname, 'image.png');
const outputVideo = path.join(__dirname, 'output.mp4');

// Função para criar o vídeo
function createVideo() {
  ffmpeg()
    .input(video1)
    .input(video2)
    .input(image)
    .videoFilters([
      {
        filter: "crop",
        options: {
          w: 1280,
          h: 720,
          x: 0,
          y: 0,
        },
      },
    ])
    // .complexFilter([])
    .outputOptions([
      '-c:v libx264',
      '-c:a aac',
      '-strict experimental'
    ])
    .on('start', (commandLine: string) => {
      console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('progress', (progress: { percent: string; }) => {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .on('stderr', (stderrLine: string) => {
      console.log('Stderr output: ' + stderrLine);
    })
    .on('error', (err: { message: string; }, stdout: any, stderr: string) => {
      console.error('Error: ' + err.message);
      console.error('FFmpeg stderr: ' + stderr);
    })
    .on('end', () => {
      console.log('Processing finished !');
    })
    .save(outputVideo);
}

// Chamar a função para criar o vídeo
createVideo();
