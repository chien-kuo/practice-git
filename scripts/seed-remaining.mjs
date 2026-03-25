import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;
const API_KEY = process.env.VITE_FIREBASE_API_KEY;

const REMAINING_HOUSES = [30, 32, 36, 38]; // 28 was manually added
const COLLECTION_PATH = 'artifacts/default-house-app/public/data/house_opinions_v2';

const SAMPLE_OPINIONS = [
  '社區環境整潔，非常滿意',
  '希望增加停車位',
  '公共區域燈光需要維修',
  '管理員服務態度很好',
  '垃圾分類請大家配合',
  '電梯保養需要加強',
  '希望加裝監視器',
  '社區綠化做得不錯',
  '門禁系統建議升級',
  '希望舉辦住戶聯誼活動',
];

function randomOpinion(houseNumber) {
  const base = SAMPLE_OPINIONS[Math.floor(Math.random() * SAMPLE_OPINIONS.length)];
  return `[${houseNumber}號] ${base}`;
}

for (const house of REMAINING_HOUSES) {
  const opinion = randomOpinion(house);
  const docPath = `${COLLECTION_PATH}/house_${house}`;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${docPath}?key=${API_KEY}`;

  const body = {
    fields: {
      houseNumber: { integerValue: house },
      opinion: { stringValue: opinion },
      updatedBy: { stringValue: 'seed-script' },
    }
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    console.log(`✓ house ${house}: ${opinion}`);
  } else {
    const err = await res.json();
    console.error(`✗ house ${house}:`, err.error?.message);
  }
}

console.log('\nDone!');
