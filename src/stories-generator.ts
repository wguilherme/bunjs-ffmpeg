import ffmpeg from 'fluent-ffmpeg';

import path from 'path';
import fs from 'fs';
import util from 'util'

const INPUT_VIDEO = path.join(__dirname, '../assets/base.mp4');
const INPUT_AUDIO = path.join(__dirname, '../assets/base_sound.mp3');
const OUTPUT_VIDEO_FOLDER = path.join(__dirname, '../assets/exports');
const OUTPUT_VIDEO_FOLDER_TEMP = path.join(__dirname, '../assets/tmp');
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

type Client = {
  id: number
  overlayImage1: string
  overlayImage2: string
}

function addSoundToVideo({
  video,
  sound,
  output,
}: {
  video: string,
  sound: string,
  output: string,
}){
  ffmpeg()
  .input(video)
  .input(sound)
  .outputOptions(['-c:v copy', '-c:a aac', '-strict experimental'])
  .output(output)
  .on('start', (command) => {
    // console.log('Adding sound to video...', command);
  })
  .on('end', () => {
    // console.log('Sound added to video');
  })
  .on('error', (err) => {
    console.error('Error: ' + err.message);
  })
  .run();
}

type GenerateResponse = {
  output: string
  outputTemp: string
}

async function generate(client: Client): Promise<void> {    
  return new Promise((resolve,reject)=>{
    const outputTemp = `${OUTPUT_VIDEO_FOLDER_TEMP}/${client.id}${CONFIG.outputVideoFormat}`
    const output = `${OUTPUT_VIDEO_FOLDER}/${client.id}${CONFIG.outputVideoFormat}`
    
    ffmpeg()
    .input(INPUT_VIDEO)
    .input(client.overlayImage1)
    .input(client.overlayImage2)
    .audioFrequency(16000)
    .audioChannels(1)
    .complexFilter([
      {
        filter: 'scale',
        options: {
          w: '480',
          h: '848',
        },
        inputs: '1:v', // 0:v é o vídeo base, 1:v é a imagem para overlay
        outputs: 'scaled_overlayImage1'
      },
      {
        filter: 'scale',
        options: {
          w: '480',
          h: '848',
        },
        inputs: '2:v', // 0:v é o vídeo base, 1:v é a imagem para overlay
        outputs: 'scaled_overlayImage2'
      },
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: `between(t,17,22)`,
        },
        inputs: ['0:v', 'scaled_overlayImage1'], // 0:v é o vídeo base, 1:v é a imagem para overlay
        outputs: 'output1'
      },
      {
        filter: 'overlay',
        options: {
          x: '(main_w-overlay_w)/2',
          y: '(main_h-overlay_h)/2',
          enable: 'between(t,28,35)',
        },
        inputs: ['output1', 'scaled_overlayImage2'], // output1 é o resultado do primeiro overlay, 1:v é a segunda imagem
        outputs: 'output2'
      },
    ], 'output2')
    .output(outputTemp)
    .on('start', (command) => {
      // console.log('Creating video...', command);
    })
    .on('end', () => {
        addSoundToVideo({
          video: outputTemp,
          sound: INPUT_AUDIO,
          output: output,
        });
        resolve()
    })
    .on('error', (err) => {
      console.error('Error: ' + err.message);
      return reject(new Error(err))
    }).run();
  })
}

async function execute(){

  const clients = fs.readdirSync(OVERLAY_IMAGE_1_FOLDER).map((file)=> {
    const fileNameSplitted = file.split('_')
    // const id = parseInt(fileNameSplitted[fileNameSplitted.length - 1].split('.')[0], 10)
    const id = file.split('.jpg')[0]

    const overlayImage1 = path.join(OVERLAY_IMAGE_1_FOLDER, file)
    const overlayImage2 = path.join(OVERLAY_IMAGE_2_FOLDER, file)

    return {
      id,
      overlayImage1,
      overlayImage2
    }

  })

  for (const [index, client] of clients.entries()) {   
    console.log(`Gerando video ${index+1}/${clients.length}`)
    await generate(client)    
  }     
}  

execute()