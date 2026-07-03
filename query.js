const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if(key) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: users } = await supabase.from('users').select('*').limit(1);
  console.log('User:', users);
  if(users && users[0]) {
    const { data: madrasas } = await supabase.from('madrasas').select('*').eq('id', users[0].madrasa_id);
    console.log('Madrasa:', madrasas);
  }
}
run();
