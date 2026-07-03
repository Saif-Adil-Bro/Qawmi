const fs = require('fs');
let code = fs.readFileSync('app/dashboard/academic/id-cards/IdCardClient.tsx', 'utf8');

code = code.replace(/export default function IdCardClient\(\{ users, userType \}: \{ users: any\[\], userType: string \}\) \{/, 
  'export default function IdCardClient({ users, userType, madrasaInfo }: { users: any[], userType: string, madrasaInfo?: {name: string, address: string, phone: string} }) {');

code = code.replace(/QawmiERP/g, '{madrasaInfo?.name || "QawmiERP"}');

// We have strings like `QawmiERP` inside JSX text so replacing it with `{madrasaInfo?.name || "QawmiERP"}` is correct, e.g. <h3 ...>QawmiERP</h3> becomes <h3 ...>{madrasaInfo?.name || "QawmiERP"}</h3>.

fs.writeFileSync('app/dashboard/academic/id-cards/IdCardClient.tsx', code);
