const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('fs');
const decode = require('audio-decode');

/**
 * ฟังก์ชันแปลง WAV เป็น MP3 (128kbps)
 */
async function createPreviewTrack(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .audioBitrate(128)
      .on('end', () => {
        console.log('✅ Preview generated successfully');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('❌ Error transcoding:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

/**
 * ฟังก์ชันวิเคราะห์ Waveform Data
 * คืนค่าเป็น Array of Numbers (0.0 - 1.0) สำหรับส่งให้หน้าบ้าน
 */
async function generateWaveformData(inputPath, samples = 100) {
  try {
    const buffer = fs.readFileSync(inputPath);
    const audioData = await decode(buffer);
    const channelData = audioData.getChannelData(0); // ใช้ Channel แรก
    const step = Math.floor(channelData.length / samples);
    const waveform = [];

    for (let i = 0; i < samples; i++) {
      let min = 1.0;
      let max = -1.0;
      
      // หาค่า Peak ในช่วงนั้นๆ
      for (let j = 0; j < step; j++) {
        const datum = channelData[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      // คำนวณความสูง (Amplitude)
      waveform.push(parseFloat((max - min).toFixed(3)));
    }

    console.log('✅ Waveform analysis complete');
    return waveform;
  } catch (err) {
    console.error('❌ Error analyzing waveform:', err);
    throw err;
  }
}

// ตัวอย่างการเรียกใช้งาน (Workflow สำหรับ Admin อัปโหลด)
async function adminUploadWorkflow(originalWavPath, trackId) {
  const previewPath = `./temp/preview_${trackId}.mp3`;
  const jsonPath = `./temp/waveform_${trackId}.json`;

  console.log(`🚀 Processing track: ${trackId}`);

  // 1. สร้างไฟล์ Preview
  await createPreviewTrack(originalWavPath, previewPath);

  // 2. สร้าง Waveform Data
  const waveform = await generateWaveformData(originalWavPath);
  fs.writeFileSync(jsonPath, JSON.stringify(waveform));

  // 3. (ขั้นตอนต่อไป) อัปโหลดไฟล์ไปยัง Cloud Storage
  console.log('Next step: Upload to Cloud Storage...');
}

module.exports = { createPreviewTrack, generateWaveformData };
