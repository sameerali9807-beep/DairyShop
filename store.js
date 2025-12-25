const fs = require('fs').promises;
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'products.json');

async function readData() {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

async function getAll({ search, category, inStock } = {}) {
  const items = await readData();
  let res = items;
  if (category) {
    res = res.filter(p => p.category === category);
  }
  if (inStock !== undefined) {
    const flag = inStock === 'true' || inStock === true;
    res = res.filter(p => Boolean(p.inStock) === flag);
  }
  if (search) {
    const q = search.toLowerCase();
    res = res.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
  }
  return res;
}

async function getById(id) {
  const items = await readData();
  return items.find(p => String(p.id) === String(id));
}

async function add(product) {
  const items = await readData();
  items.unshift(product);
  await writeData(items);
  return product;
}

async function update(id, patch) {
  const items = await readData();
  const idx = items.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeData(items);
  return items[idx];
}

async function remove(id) {
  const items = await readData();
  const idx = items.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return false;
  items.splice(idx, 1);
  await writeData(items);
  return true;
}

module.exports = { getAll, getById, add, update, remove };
