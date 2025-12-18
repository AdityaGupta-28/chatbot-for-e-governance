require('dotenv').config();
const u = process.env.EMAIL_USER || 'MISSING';
const p = process.env.EMAIL_PASS || 'MISSING';
console.log(`EMAIL_USER: ${u.substring(0, 2)}...${u.substring(u.length - 2)} (Length: ${u.length})`);
console.log(`EMAIL_PASS: ${p.substring(0, 2)}...${p.substring(p.length - 2)} (Length: ${p.length})`);
