const allowedCategories = ['milk','paneer','ghee','sweets'];

function validateProduct(data, { partial=false } = {}){
  const errors = [];
  if (!partial) {
    if (!data.name) errors.push('name is required');
    if (!data.category) errors.push('category is required');
    if (data.price == null) errors.push('price is required');
  }
  if (data.category && !allowedCategories.includes(data.category)) errors.push('invalid category');
  if (data.price != null && isNaN(Number(data.price))) errors.push('price must be a number');
  if (data.mrp != null && isNaN(Number(data.mrp))) errors.push('mrp must be a number');
  if (data.inStock != null && typeof data.inStock !== 'boolean') errors.push('inStock must be boolean');
  return { valid: errors.length===0, errors };
}

module.exports = { validateProduct, allowedCategories };
