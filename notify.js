const fs = require('fs');
const path = require('path');

let twilioClient = null;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+1415xxxxxxx'
const smsFrom = process.env.TWILIO_PHONE_FROM; // e.g. '+1415xxxxxxx'

if (accountSid && authToken) {
  try {
    const Twilio = require('twilio');
    twilioClient = new Twilio(accountSid, authToken);
  } catch (e) {
    console.warn('Twilio not installed or failed to load. WhatsApp will be disabled.');
    twilioClient = null;
  }
}

async function sendWhatsAppTo(number, message) {
  if (!twilioClient) {
    console.log('Twilio not configured; would send WhatsApp to', number, message);
    return false;
  }
  // prefer WhatsApp if configured
  if (whatsappFrom) {
    try {
      const to = number.startsWith('whatsapp:') ? number : 'whatsapp:+' + number.replace(/\D/g, '');
      const from = whatsappFrom.startsWith('whatsapp:') ? whatsappFrom : 'whatsapp:' + whatsappFrom;
      const msg = await twilioClient.messages.create({ from, to, body: message });
      console.log('WhatsApp sent:', msg.sid);
      return true;
    } catch (err) {
      console.warn('Failed to send WhatsApp', err.message || err);
      // fallthrough to SMS if available
    }
  }

  // fallback to SMS if smsFrom set
  if (smsFrom) {
    try {
      const to = number.startsWith('+') ? number : '+' + number.replace(/\D/g, '');
      const msg = await twilioClient.messages.create({ from: smsFrom, to, body: message });
      console.log('SMS sent as fallback:', msg.sid);
      return true;
    } catch (err) {
      console.warn('Failed to send fallback SMS', err.message || err);
      return false;
    }
  }
  console.log('No whatsappFrom or smsFrom configured; skipped sending to', number);
  return false;
}

async function notifyAdmins(order, adminNumbers = []) {
  try {
    const orderId = order.orderId || order.id || '';
    const items = (order.items || []).map(i => `${i.name} x${i.quantity || 1} = ₹${i.total || (i.price * i.quantity)}`).join('\n');
    const message = `नया ऑर्डर!\nID: ${orderId}\nग्राहक: ${order.customerName}\nफोन: ${order.customerPhone}\nकुल: ₹${order.totalAmount}\nआइटम्स:\n${items}\nपता: ${order.customerAddress}`;
    for (const n of adminNumbers) {
      try { await sendWhatsAppTo(n, message); } catch (e) { console.warn('notifyAdmins send failed', e); }
    }
  } catch (e) { console.warn('notifyAdmins error', e); }
}

module.exports = { notifyAdmins, sendWhatsAppTo };
