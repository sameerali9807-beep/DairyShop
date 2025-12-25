const express = require('express');
const router = express.Router();
const ordersStore = require('../lib/ordersStore');
const { requireAuth } = require('../lib/auth');
const notify = require('../lib/notify');

// Helper: default admin numbers (can be overridden by request or env)
const rawAdmins = process.env.ADMIN_WHATSAPP_NUMBERS || process.env.ADMIN_NOTIFY_NUMBERS || '7007120750,9807235659';
const DEFAULT_ADMIN_NUMBERS = (rawAdmins || '').split(/[;,\s]+/).filter(Boolean).map(n => {
  const d = n.replace(/\D/g,'');
  return d.length===10? '91'+d : d;
});

// Public: create order
router.post('/', async (req, res, next) => {
  try{
    const data = req.body;
    const orderId = 'DD' + Date.now();
    const order = {
      orderId,
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      customerName: data.customerName || 'Guest',
      customerPhone: data.customerPhone || '',
      customerAddress: data.customerAddress || '',
      status: 'received',
      date: new Date().toISOString()
    };
    await ordersStore.addOrder(order);
    // Notify admins asynchronously (best-effort)
    (async()=>{
      try{
        const adminNumbers = DEFAULT_ADMIN_NUMBERS;
        await notify.notifyAdmins(order, adminNumbers);
      }catch(e){ console.warn('Order notify failed', e); }
    })();
    res.status(201).json({ success: true, order });
  }catch(err){ next(err); }
});

// Admin: delete order by id (no auth to simplify local admin use)
router.delete('/:id', async (req, res, next) => {
  try{
    const id = req.params.id;
    const removed = await ordersStore.removeOrder(id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  }catch(err){ next(err); }
});

// Admin: list orders
router.get('/', requireAuth, async (req, res, next) => {
  try{
    const list = await ordersStore.getAllOrders();
    res.json(list);
  }catch(err){ next(err); }
});

// Admin: update order status or details
router.put('/:id', requireAuth, async (req, res, next) => {
  try{
    const updated = await ordersStore.updateOrder(req.params.id, req.body);
    if(!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  }catch(err){ next(err); }
});

module.exports = router;
