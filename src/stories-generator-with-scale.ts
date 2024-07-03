import ffmpeg from 'fluent-ffmpeg';

import path from 'path';
import fs from 'fs';

const INPUT_VIDEO = path.join(__dirname, '../assets/base.mp4');
const OUTPUT_VIDEO_FOLDER = path.join(__dirname, '../assets/exports');

const OVERLAY_IMAGE_1_FOLDER = path.join(__dirname, '../assets/input/overlay1');
const OVERLAY_IMAGE_2_FOLDER = path.join(__dirname, '../assets/input/overlay2');

const ALIGNMENTS = {
  center: {
    x: '(main_w-overlay_w)/2',
    y: '(main_h-overlay_h)/2',
  }
}

const CONFIG = {  
  inputVideo: INPUT_VIDEO,
  outputVideo: OUTPUT_VIDEO_FOLDER,
  outputVideoFormat: '.mp4',
  overlayImage1: {
    initialTime: 20,
    finalTime: 22,
    alignment: ALIGNMENTS.center
  },
  overlayImage2: {
    initialTime: 38,
    finalTime: 40,
    alignment: ALIGNMENTS.center
  }

}

function execute() {

  const clients = fs.readdirSync(OVERLAY_IMAGE_1_FOLDER).map((file)=> {
    const fileNameSplitted = file.split('_')
    const id = parseInt(fileNameSplitted[fileNameSplitted.length - 1].split('.')[0], 10)

    const overlayImage1 = path.join(OVERLAY_IMAGE_1_FOLDER, file)
    const overlayImage2 = path.join(OVERLAY_IMAGE_2_FOLDER, file)

    return {
      id,
      overlayImage1,
      overlayImage2
    }

  })

  console.log('clients', clients.slice(0, 1))

  clients.slice(0, 1).map((client)=> {
    ffmpeg()
    .input(INPUT_VIDEO)
    .input(client.overlayImage1)
    .input(client.overlayImage2)
    .complexFilter([
      {
        filter: 'scale',
        options: {
          w: '400',
          h: '800',
        },
        inputs: '1:v', // 0:v é o vídeo base, 1:v é a imagem para overlay
        outputs: 'scaled_overlayImage1'
      },
      {
        filter: 'scale',
        options: {
          w: '400',
          h: '800',
        },
        inputs: '2:v', // 0:v é o vídeo base, 1:v é a imagem para overlay
        outputs: 'scaled_overlayImage2'
      },
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: `between(t,19,23)`,
        },
        inputs: ['0:v', 'scaled_overlayImage1'], // 0:v é o vídeo base, 1:v é a imagem para overlay
        outputs: 'output1'
      },
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: 'between(t,38,40)',
        },
        inputs: ['output1', 'scaled_overlayImage2'], // output1 é o resultado do primeiro overlay, 1:v é a segunda imagem
        outputs: 'output2'
      },
    ], 'output2')
    .output(`${OUTPUT_VIDEO_FOLDER}/${client.id}${CONFIG.outputVideoFormat}`)
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
  })
}


execute();




