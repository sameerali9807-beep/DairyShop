const notify = require('../lib/notify');

async function run(){
  const sampleOrder = {
    orderId: 'test-123',
    customerName: 'Test User',
    customerPhone: '9876543210',
    totalAmount: 99,
    items: [{ name: 'Milk', quantity:1, price:40, total:40 }, { name: 'Curd', quantity:1, price:59, total:59 }],
    customerAddress: '123 Test Lane'
  };
  const admins = (process.env.ADMIN_NOTIFY_NUMBERS || '7007120750,9807235659').split(',').map(s=>s.trim()).filter(Boolean);
  console.log('Running notify dry-run. Admins:', admins);
  await notify.notifyAdmins(sampleOrder, admins);
  console.log('Done');
}

run().catch(e=>{ console.error('Test notify failed', e); process.exitCode = 1; });
