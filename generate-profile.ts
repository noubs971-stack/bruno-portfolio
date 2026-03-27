import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function generateProfileImage() {
  console.log('🚀 Initializing Z-AI SDK...');
  
  const zai = await ZAI.create();
  
  console.log('🎨 Generating profile image...');
  
  const response = await zai.images.generations.create({
    prompt: 'Professional tech entrepreneur portrait, man with confident smile, modern minimalist style, cyan and green glowing tech background, dark theme, high quality portrait photography, studio lighting, clean professional look, friendly expression',
    size: '1024x1024'
  });
  
  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  
  const outputPath = path.join(process.cwd(), 'public', 'profile.png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log('✅ Profile image saved to:', outputPath);
}

generateProfileImage().catch(console.error);
