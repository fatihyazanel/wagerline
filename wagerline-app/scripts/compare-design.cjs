const sharp = require('sharp');
const path = require('path');
(async () => {
 const folder=path.resolve(__dirname,'../../artifacts');
 const before=await sharp(path.join(folder,'before-corporate/home-1440.png')).resize({width:720}).extract({left:0,top:0,width:720,height:700}).toBuffer();
 const after=await sharp(path.join(folder,'corporate/home-1440.png')).resize({width:720}).extract({left:0,top:0,width:720,height:700}).toBuffer();
 const labels=Buffer.from('<svg width="1440" height="48"><rect width="1440" height="48" fill="#fff"/><text x="24" y="31" fill="#586b82" font-family="Arial" font-size="17">ÖNCE</text><text x="744" y="31" fill="#175cce" font-family="Arial" font-size="17" font-weight="bold">YENİ KURUMSAL TASARIM</text></svg>');
 await sharp({create:{width:1440,height:748,channels:4,background:'#fff'}}).composite([{input:labels,left:0,top:0},{input:before,left:0,top:48},{input:after,left:720,top:48}]).png().toFile(path.join(folder,'corporate/before-after.png'));
 console.log('Before/after comparison saved.');
})().catch(error=>{console.error(error);process.exitCode=1});
