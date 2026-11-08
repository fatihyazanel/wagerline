const sharp=require('sharp');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#143451"/><circle cx="1080" cy="90" r="320" fill="#225f92"/><path d="M0 530H1200" stroke="#f4c34e" stroke-width="12"/><text x="80" y="270" fill="white" font-family="Arial" font-size="112" font-weight="bold">WAGERline</text><text x="85" y="370" fill="#dbe8f3" font-family="Arial" font-size="38">SPORT. PICKS. REWARDS.</text></svg>`;
sharp(Buffer.from(svg)).png().toFile('public/share-card.png').catch(e=>{console.error(e);process.exitCode=1});
