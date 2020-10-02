
const spawn = require('child_process').spawn;

function resizeVideo(video, name, bitrate) {
    // const p = new Promise((resolve, reject) => {
    //     const ffmpeg = spawn('ffmpeg', [
    //         '-i', `${video}`,
    //         '-codec:v', 'libx264',
    //         '-profile:v', 'main',
    //         '-preset', 'superfast',
    //         '-b:v', `${bitrate}`,
    //         '-maxrate', `${bitrate}`,
    //         '-bufsize', `${bitrate}`,
    //         '-vf', `scale=-2:${quality}`,
    //         '-f', 'hls',
    //         '-threads', '0',
    //         '-b:a', '128k',
    //         '-hls_time', '1',
    //         '-hls_list_size', '0',
    //         '-hls_segment_filename', 'v%v/fileSequence%d.ts',
    //         `./${video}.m3u8`]);
    //     ffmpeg.stderr.on('data', (data) => {
    //         console.log(`${data}`);
    //     });
    //     ffmpeg.on('close', (code) => {
    //         resolve();
    //     });
    // });
    // return p;

    const p = new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', `${video}`,
            '-map', '0:0',
            '-map', '0:1',
            '-map', '0:0',
            '-map', '0:1',
            '-map', '0:0',
            '-map', '0:1',
            '-map', '0:0',
            '-map', '0:1',
            '-s:v:0', '1280x720',
            '-c:v:0', 'libx264',
            '-b:v:0', '2628000',
            '-maxrate:0', `${bitrate}`,
            '-bufsize:0', `${bitrate}`,
            '-s:v:1', '854x480',
            '-c:v:1', 'libx264',
            '-b:v:1', '1128000',
            '-maxrate:1', `${bitrate}`,
            '-bufsize:1', `${bitrate}`,
            '-s:v:2', '640x360',
            '-c:v:2', 'libx264',
            '-b:v:2', '878000',
            '-maxrate:2', `${bitrate}`,
            '-bufsize:2', `${bitrate}`,
            '-s:v:3', '426x240',
            '-c:v:3', 'libx264',
            '-b:v:3', '528000',
            '-maxrate:3', `${bitrate}`,
            '-bufsize:3', `${bitrate}`,
            '-var_stream_map', `v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3`,
            '-preset', 'superfast',
            '-profile:v', 'main',
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
    return p;
}

function processVideos(video, name) {
    resizeVideo(video, name, '400k').then(() => {
        
    });
}

processVideos('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'test1');
processVideos('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'test2');
processVideos('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'test3');