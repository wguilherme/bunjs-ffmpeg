import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const baseVideo = path.join(__dirname, '/assets/video1.mp4');
const image = path.join(__dirname, '/assets/cupom.jpeg');
const outputVideo = path.join(__dirname, '/assets/output.mp4');

// Unify the video and the image

function createVideo() {
  ffmpeg(baseVideo)
    .complexFilter(['[0:v]scale=1080:1920,crop=1080:1920'])
    .input(image)
    .inputOptions(['-t 2'])
    .complexFilter([
      // {
      //   filter: 'scale',
      //   options: {
      //     w: 100,
      //     h: 50
      //   },
      //   inputs: '[1]', // índice do input
      //   outputs: 'rescaled_image'
      // },
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: 'between(t,2,3)',
        },
      }
    ])
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
