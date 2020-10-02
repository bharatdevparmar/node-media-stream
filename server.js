const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const spawn = require('child_process').spawn;

const app = express();
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.options('*', cors());
app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  return res.status(200).send("OK!!! Streaming Service Working")
});

app.get('/testVideoStream', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.post('/start/videoStream', (req, res) => {
  try {
    const name = req.body.name;
    const url = req.body.url;
    const p = new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', `${url}`,
            '-map', '0:0',
            '-map', '0:1',
            '-map', '0:0',
            '-map', '0:1',
            '-map', '0:0',
            '-map', '0:1',
            '-map', '0:0',
            '-map', '0:1',
            // '-map', '0:0',
            // '-map', '0:1',

            '-s:v:0', '426x240',
            '-c:v:0', 'libx264',
            '-b:v:0', '400k',
            '-profile:v', 'baseline',
            '-crf:','20',
            '-maxrate:0', '400k',
            '-bufsize:0', '800k',

            '-s:v:1', '640x360',
            '-c:v:1', 'libx264',
            '-b:v:1', '1000k',
            '-profile:v', 'main',
            '-crf:','20',
            '-maxrate:1', '1200k',
            '-bufsize:1', '2400k',

            '-s:v:2', '854x480',
            '-c:v:2', 'libx264',
            '-b:v:2', '1400k',
            '-profile:v', 'main',
            '-crf:','20',
            '-maxrate:2', '1500k',
            '-bufsize:2', '3000k',

            '-s:v:3', '1280x720',
            '-c:v:3', 'libx264',
            '-b:v:3', '2750k',
            '-profile:v', 'main',
            '-crf:','20',
            '-maxrate:3', '4000k',
            '-bufsize:3', '8000k',

            '-var_stream_map', `v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3`,
            '-preset', 'ultrafast',
            '-master_pl_name', `${name}.m3u8`,
            '-f', 'hls',
            '-threads', 'auto',
            '-max_muxing_queue_size', '1024',
            '-hls_time', '1',
            '-hls_list_size', '0',
            '-hls_segment_filename', `./videos/${name}_%v/%d.ts`,
            `./videos/${name}_%v/index.m3u8`
        ]);
        ffmpeg.stderr.on('data', (data) => {
            console.log(`${data}`);
        });
        ffmpeg.on('close', (code) => {
            resolve();
        });
    });
    return res.sendStatus(200); 
  } catch(err) {
    console.log(err)
    return res.sendStatus(500); 
  }
})

app.use('/video', express.static(path.join(__dirname + '/videos')));
app.use('/videojs', express.static(path.join(__dirname + '/node_modules/video.js/dist/')));
app.use('/quality_selector', express.static(__dirname + '/node_modules/videojs-hls-quality-selector/dist/'));
app.use('/videojs_contrib', express.static(__dirname + '/node_modules/videojs-contrib-quality-levels/dist/'));

app.use("*",function(req,res){
  res.sendFile(path.join(__dirname + "/view/404.htm"));
});

const port = process.env.APP_PORT || '5010';
app.listen(port, err => {
  if (err) {
    log.error(err);
  } else {
    console.log(`server is listening on ${port}`);
  }
});
