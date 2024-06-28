import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const baseVideo = path.join(__dirname, '/assets/video1.mp4');
const image = path.join(__dirname, '/assets/cupom.jpeg');
const sound = path.join(__dirname, '/assets/sound.mp3');

const outputVideo = path.join(__dirname, '/assets/output.mp4');
const outputVideoWithSound = path.join(__dirname, '/assets/output2.mp4');

function createVideo() {
  ffmpeg()
    .input(baseVideo)
    .input(image)
    .input(image)
    .input(sound)
    .inputOptions(['-t 4']) // Definindo a duração total do vídeo para 4 segundos
    .complexFilter([
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: 'between(t,1,2)',
        },
        inputs: ['0:v', '1:v'], // 0:v é o vídeo base, 1:v é a imagem para overlay
        outputs: 'output1'
      },
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: 'between(t,3,4)',
        },
        inputs: ['output1', '1:v'], // output1 é o resultado do primeiro overlay, 1:v é a segunda imagem
        outputs: 'output2'
      },
    ], 'output2')
    .output(outputVideo)
    .on('start', (command) => {
      console.log('Creating video...', command);
    })
    .on('end', () => {
      console.log('Video created');
    })
    .on('error', (err) => {
      console.error('Error: ' + err.message);
    })
    .run();
}

function addSoundToVideo(){
  ffmpeg()
  .input(outputVideo)
  .input(sound)
  .outputOptions(['-c:v copy', '-c:a aac', '-strict experimental'])
  .output(outputVideoWithSound)
  .on('start', (command) => {
    console.log('Adding sound to video...', command);
  })
  .on('end', () => {
    console.log('Sound added to video');
  })
  .on('error', (err) => {
    console.error('Error: ' + err.message);
  })
  .run();
}

createVideo();

// Aguardar a criação do vídeo para adicionar o som
setTimeout(() => {
  addSoundToVideo();
}, 3000);





