import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'banner');
const filesToCrop = ['banner.jpeg', 'banner2.png', 'banner3.png', 'banner4.png', 'banner5.png', 'banner6.png', 'banner7.png'];

async function cropBanners() {
  const cropAmount = 45;

  for (const file of filesToCrop) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    const tempPath = path.join(dir, `temp_${file}`);

    try {
      const metadata = await sharp(filePath).metadata();
      const newHeight = metadata.height - cropAmount;

      await sharp(filePath)
        .extract({ left: 0, top: 0, width: metadata.width, height: newHeight })
        .toFile(tempPath);

      fs.renameSync(tempPath, filePath);
      console.log(`Successfully cropped watermark from: ${file}`);
    } catch (error) {
      console.error(`Error cropping ${file}:`, error.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
}

cropBanners();
