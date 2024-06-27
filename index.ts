import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const baseVideo = path.join(__dirname, '/assets/video1.mp4');
const image = path.join(__dirname, '/assets/cupom.jpeg');
const outputVideo = path.join(__dirname, '/assets/output.mp4');
const sound = path.join(__dirname, '/assets/sound.mp3');

// Unify the video and the image

function createVideo() {
  ffmpeg(baseVideo)
    .input(image)
    .input(image)
    .input(sound)
    .inputOptions(['-t 2'])
    .complexFilter([
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: 'between(t,1,2)',
        },
        inputs: ['0:v', '1:v'], // 0:v é o vídeo base, 1:v é a primeira imagem
        outputs: 'overlay1'
      },
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: 'between(t,3,4)',
        },
        inputs: ['overlay1', '2:v'], // overlay1 é o output do primeiro overlay, 2:v é a segunda imagem
        outputs: 'final'
      }
    ], 'final')
    .output(outputVideo)
    .on('start', () => {
      console.log('Creating video...');
    })
    .on('end', () => {
      console.log('Video created');
    })
    .on('error', (err) => {
      console.error('Error: ' + err.message);
    })
    .run();
}

createVideo();
