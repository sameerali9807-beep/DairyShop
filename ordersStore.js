const fs = require('fs').promises;
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'orders.json');

async function readOrders(){
  try{
    const raw = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(raw || '[]');
  }catch(err){
    if(err.code==='ENOENT') return [];
    throw err;
  }
}

async function writeOrders(data){
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

async function addOrder(order){
  const orders = await readOrders();
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

async function getAllOrders(){
  return await readOrders();
}

async function updateOrder(id, patch){
  const orders = await readOrders();
  const idx = orders.findIndex(o => String(o.orderId) === String(id));
  if(idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch };
  await writeOrders(orders);
  return orders[idx];
}

async function removeOrder(id){
  const orders = await readOrders();
  const filtered = orders.filter(o => String(o.orderId) !== String(id));
  if (filtered.length === orders.length) return false;
  await writeOrders(filtered);
  return true;
}

module.exports = { readOrders, writeOrders, addOrder, getAllOrders, updateOrder, removeOrder };
