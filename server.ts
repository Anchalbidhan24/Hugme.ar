import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SUPABASE_URL = 'https://cvujghhfccldlsuetwqi.supabase.co';
const PROJECT_REF = 'cvujghhfccldlsuetwqi';

const VALID_ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Packed with Love',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Refunded',
] as const;

type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];

interface OrderItemInput {
  productId: string;
  name: string;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  itemType?: 'product' | 'bundle' | 'custom-bundle';
  bundleItems?: {
    productId: string;
    name: string;
    image?: string;
    quantity: number;
    unitPrice: number;
  }[];
}

interface OrderRow {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  payment_method: 'Cash on Delivery' | 'Online Payment';
  status: OrderStatus;
  subtotal: number;
  gift_wrap_fee: number;
  coupon_code: string | null;
  discount: number;
  loyalty_reward_id: string | null;
  loyalty_reward_title: string | null;
  loyalty_points_redeemed: number;
  loyalty_discount: number;
  shipping: number;
  total: number;
  gift_wrap_name: string | null;
  gift_wrap_price: number | null;
  gift_card_design: string | null;
  gift_recipient_name: string | null;
  gift_sender_name: string | null;
  gift_message: string | null;
  items: OrderItemInput[];
  tracking_steps: { title: string; date: string; completed: boolean }[];
  order_date: string;
  created_at?: string;
}

function getSupabaseEnv() {
  const url = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  return { url, key };
}

function getSupabaseClient(): { client: SupabaseClient | null; error?: string; code?: string } {
  const { url, key } = getSupabaseEnv();
  if (!key) {
    return {
      client: null,
      code: 'MISSING_SUPABASE_KEY',
      error:
        'Supabase API key is not configured yet. Add SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in Secrets for project cvujghhfccldlsuetwqi.',
    };
  }
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return { client };
}

function formatDisplayDate(d = new Date()): string {
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function generateOrderId(): string {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const tail = String(Date.now()).slice(-2);
  return `HUG-${year}-${suffix}${tail}`;
}

function buildTrackingSteps(status: OrderStatus, dateLabel: string) {
  const orderPlaced = true;
  const confirmed = [
    'Confirmed',
    'Packed with Love',
    'Out for Delivery',
    'Delivered',
  ].includes(status);
  const packed = ['Packed with Love', 'Out for Delivery', 'Delivered'].includes(status);
  const outForDelivery = ['Out for Delivery', 'Delivered'].includes(status);
  const delivered = status === 'Delivered';

  const steps = [
    { title: 'Order Placed', date: dateLabel, completed: orderPlaced },
    { title: 'Order Confirmed', date: confirmed ? dateLabel : 'Awaiting confirmation', completed: confirmed },
    { title: 'Packed with Love', date: packed ? dateLabel : 'Preparing your parcel', completed: packed },
    { title: 'Out for Delivery', date: outForDelivery ? dateLabel : 'Pending courier pickup', completed: outForDelivery },
    { title: 'Delivered', date: delivered ? dateLabel : 'Estimated 3–5 business days', completed: delivered },
  ];

  if (status === 'Cancelled' || status === 'Refunded') {
    steps.push({ title: `Order ${status}`, date: formatDisplayDate(), completed: true });
  }
  return steps;
}

function mapRowToOrder(row: OrderRow) {
  const fullShipping = [row.shipping_address, row.city, row.state, row.pincode, row.country]
    .filter(Boolean)
    .join(', ');

  const hasGift =
    Boolean(row.gift_wrap_name) ||
    Boolean(row.gift_card_design) ||
    Boolean(row.gift_message) ||
    Boolean(row.gift_recipient_name);

  return {
    id: row.id,
    customerId: row.customer_id || 'guest',
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    date: row.order_date,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal ?? 0),
    giftWrapFee: Number(row.gift_wrap_fee ?? 0),
    discount: Number(row.discount ?? 0),
    loyaltyDiscount: Number(row.loyalty_discount ?? 0),
    loyaltyRewardTitle: row.loyalty_reward_title || undefined,
    loyaltyPointsRedeemed: Number(row.loyalty_points_redeemed ?? 0) || undefined,
    shipping: Number(row.shipping ?? 0),
    total: Number(row.total ?? 0),
    paymentMethod: row.payment_method,
    status: row.status,
    shippingAddress: fullShipping,
    giftSelection: hasGift
      ? {
          wrapName: row.gift_wrap_name || undefined,
          wrapPrice: row.gift_wrap_price ?? undefined,
          cardDesignTitle: row.gift_card_design || undefined,
          recipientName: row.gift_recipient_name || undefined,
          senderName: row.gift_sender_name || undefined,
          message: row.gift_message || undefined,
        }
      : undefined,
    trackingSteps: Array.isArray(row.tracking_steps) ? row.tracking_steps : [],
    isDemoSeed: false,
  };
}

function mapSupabaseError(err: { code?: string; message?: string; details?: string } | null) {
  const code = err?.code || '';
  const msg = err?.message || 'Supabase database request failed.';

  if (code === '42P01' || code === 'PGRST205' || msg.includes('schema cache')) {
    return {
      status: 503,
      code: 'MISSING_SUPABASE_TABLES',
      error:
        'Supabase connected, but required tables (orders, order_items, enquiries, newsletter_subscribers) were not found. Run /supabase/schema.sql in your Supabase SQL Editor.',
    };
  }
  if (code === '42501' || msg.toLowerCase().includes('row-level security')) {
    return {
      status: 503,
      code: 'SUPABASE_RLS_BLOCKED',
      error:
        'Supabase Row Level Security blocked the operation. Add SUPABASE_SERVICE_ROLE_KEY in Secrets or run the RLS policies in /supabase/schema.sql.',
    };
  }
  if (msg.toLowerCase().includes('invalid api key') || msg.toLowerCase().includes('jwt')) {
    return {
      status: 503,
      code: 'INVALID_SUPABASE_KEY',
      error:
        'The configured Supabase API key was rejected. Verify SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY for project cvujghhfccldlsuetwqi.',
    };
  }

  return {
    status: 500,
    code: code || 'SUPABASE_ERROR',
    error: msg,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    const { url, key } = getSupabaseEnv();
    res.json({
      ok: true,
      projectRef: PROJECT_REF,
      supabaseUrl: url,
      hasKey: Boolean(key),
    });
  });

  // Create order & persist into public.orders + public.order_items
  app.post('/api/orders', async (req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const body = req.body ?? {};
    const customerName = String(body.customerName || '').trim();
    const customerEmail = String(body.customerEmail || '').trim().toLowerCase();
    const customerPhone = String(body.customerPhone || '').trim();
    const streetAddress = String(body.streetAddress || '').trim();
    const city = String(body.city || '').trim();
    const state = String(body.state || '').trim();
    const pincode = String(body.pincode || '').trim();
    const country = String(body.country || 'India').trim();
    const paymentMethod: 'Cash on Delivery' | 'Online Payment' =
      body.paymentMethod === 'Online Payment' || body.paymentMethod === 'online'
        ? 'Online Payment'
        : 'Cash on Delivery';

    const rawItems: OrderItemInput[] = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerEmail || !customerPhone || !streetAddress || !city || !pincode) {
      return res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        error: 'Please complete all required customer and shipping fields before placing the order.',
      });
    }
    if (rawItems.length === 0) {
      return res.status(400).json({
        ok: false,
        code: 'EMPTY_CART',
        error: 'Your shopping cart is empty.',
      });
    }

    const orderId = generateOrderId();
    const orderDate = formatDisplayDate();
    const status: OrderStatus = 'Pending';
    const trackingSteps = buildTrackingSteps(status, orderDate);

    const normalizedItems: OrderItemInput[] = rawItems.map((it) => ({
      productId: String(it.productId || ''),
      name: String(it.name || 'Plushie'),
      image: it.image ? String(it.image) : '',
      color: String(it.color || ''),
      size: String(it.size || ''),
      quantity: Math.max(1, Number(it.quantity || 1)),
      price: Number(it.price || 0),
      itemType: it.itemType || 'product',
      bundleItems: Array.isArray(it.bundleItems) ? it.bundleItems : undefined,
    }));

    const orderInsert: OrderRow = {
      id: orderId,
      customer_id: String(body.customerId || 'guest'),
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: streetAddress,
      city,
      state,
      pincode,
      country,
      payment_method: paymentMethod,
      status,
      subtotal: Number(body.subtotal ?? 0),
      gift_wrap_fee: Number(body.giftWrapFee ?? 0),
      coupon_code: body.couponCode ? String(body.couponCode) : null,
      discount: Number(body.discount ?? 0),
      loyalty_reward_id: body.loyaltyRewardId ? String(body.loyaltyRewardId) : null,
      loyalty_reward_title: body.loyaltyRewardTitle ? String(body.loyaltyRewardTitle) : null,
      loyalty_points_redeemed: Number(body.loyaltyPointsRedeemed ?? 0),
      loyalty_discount: Number(body.loyaltyDiscount ?? 0),
      shipping: Number(body.shipping ?? 0),
      total: Number(body.total ?? 0),
      gift_wrap_name: body.giftSelection?.wrapName ? String(body.giftSelection.wrapName) : null,
      gift_wrap_price:
        body.giftSelection?.wrapPrice !== undefined ? Number(body.giftSelection.wrapPrice) : null,
      gift_card_design: body.giftSelection?.cardDesignTitle
        ? String(body.giftSelection.cardDesignTitle)
        : null,
      gift_recipient_name: body.giftSelection?.recipientName
        ? String(body.giftSelection.recipientName)
        : null,
      gift_sender_name: body.giftSelection?.senderName
        ? String(body.giftSelection.senderName)
        : null,
      gift_message: body.giftSelection?.message ? String(body.giftSelection.message) : null,
      items: normalizedItems,
      tracking_steps: trackingSteps,
      order_date: orderDate,
    };

    const { data: insertedOrder, error: orderErr } = await client
      .from('orders')
      .insert(orderInsert)
      .select()
      .single();

    if (orderErr || !insertedOrder) {
      const mapped = mapSupabaseError(orderErr);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    const lineRows = normalizedItems.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      name: item.name,
      image: item.image || null,
      color: item.color || '',
      size: item.size || '',
      quantity: item.quantity,
      unit_price: item.price,
      item_type: item.itemType || 'product',
      bundle_items: item.bundleItems || null,
    }));

    const { error: itemsErr } = await client.from('order_items').insert(lineRows);
    if (itemsErr) {
      // Non-fatal fallback only if order row already persisted; log cleanly without failing confirmed order
      console.error('Failed inserting relational order_items rows:', itemsErr.message);
    }

    return res.status(201).json({
      ok: true,
      order: mapRowToOrder(insertedOrder as OrderRow),
    });
  });

  // List orders (optionally filtered by customer email)
  app.get('/api/orders', async (req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const emailFilter = typeof req.query.email === 'string' ? req.query.email.trim().toLowerCase() : '';
    let query = client.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
    if (emailFilter) {
      query = query.ilike('customer_email', emailFilter);
    }

    const { data, error } = await query;
    if (error) {
      const mapped = mapSupabaseError(error);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    return res.json({
      ok: true,
      orders: (data || []).map((row) => mapRowToOrder(row as OrderRow)),
    });
  });

  // Track single order by ID
  app.get('/api/orders/:id', async (req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const id = String(req.params.id || '').trim();
    if (!id) {
      return res.status(400).json({ ok: false, code: 'INVALID_ID', error: 'Order ID is required.' });
    }

    const { data, error } = await client
      .from('orders')
      .select('*')
      .ilike('id', id)
      .maybeSingle();

    if (error) {
      const mapped = mapSupabaseError(error);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    if (!data) {
      return res.status(404).json({ ok: false, code: 'NOT_FOUND', error: `Order ${id} was not found.` });
    }

    return res.json({
      ok: true,
      order: mapRowToOrder(data as OrderRow),
    });
  });

  // Update order status
  app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const id = String(req.params.id || '').trim();
    const status = req.body?.status as OrderStatus;
    if (!VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ ok: false, code: 'INVALID_STATUS', error: 'Invalid order status.' });
    }

    const { data: existing, error: fetchErr } = await client
      .from('orders')
      .select('order_date')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) {
      const mapped = mapSupabaseError(fetchErr);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }
    if (!existing) {
      return res.status(404).json({ ok: false, code: 'NOT_FOUND', error: `Order ${id} not found.` });
    }

    const nextSteps = buildTrackingSteps(status, existing.order_date || formatDisplayDate());
    const { data: updated, error: updErr } = await client
      .from('orders')
      .update({
        status,
        tracking_steps: nextSteps,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updErr || !updated) {
      const mapped = mapSupabaseError(updErr);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    return res.json({ ok: true, order: mapRowToOrder(updated as OrderRow) });
  });

  // Customer Enquiries (Contact Us form)
  app.post('/api/enquiries', async (req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const subject = String(req.body?.subject || '').trim();
    const message = String(req.body?.message || '').trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        error: 'Name, email, subject, and message are required.',
      });
    }

    const id = `ENQ-${Date.now().toString().slice(-6)}`;
    const enquiryDate = formatDisplayDate();

    const { data, error } = await client
      .from('enquiries')
      .insert({
        id,
        name,
        email,
        subject,
        message,
        status: 'New',
        enquiry_date: enquiryDate,
      })
      .select()
      .single();

    if (error || !data) {
      const mapped = mapSupabaseError(error);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    return res.status(201).json({
      ok: true,
      enquiry: {
        id: data.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        date: data.enquiry_date,
        status: data.status,
        isDemoSeed: false,
      },
    });
  });

  app.get('/api/enquiries', async (_req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const { data, error } = await client
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      const mapped = mapSupabaseError(error);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    return res.json({
      ok: true,
      enquiries: (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        date: row.enquiry_date,
        status: row.status,
        isDemoSeed: false,
      })),
    });
  });

  app.patch('/api/enquiries/:id', async (req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const id = String(req.params.id || '').trim();
    const { error } = await client
      .from('enquiries')
      .update({ status: 'Replied' })
      .eq('id', id);

    if (error) {
      const mapped = mapSupabaseError(error);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    return res.json({ ok: true });
  });

  // Newsletter subscribers
  app.post('/api/subscribers', async (req: Request, res: Response) => {
    const { client, error: cfgErr, code: cfgCode } = getSupabaseClient();
    if (!client) {
      return res.status(503).json({ ok: false, code: cfgCode, error: cfgErr });
    }

    const email = String(req.body?.email || '').trim().toLowerCase();
    const source = String(req.body?.source || 'Homepage Newsletter').trim();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ ok: false, code: 'VALIDATION_ERROR', error: 'Valid email required.' });
    }

    const { data: existing } = await client
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.json({
        ok: true,
        alreadySubscribed: true,
        subscriber: {
          id: existing.id,
          email: existing.email,
          source: existing.source,
          date: existing.subscribed_date,
          isDemoSeed: false,
        },
      });
    }

    const id = `SUB-${Date.now().toString().slice(-6)}`;
    const subscribedDate = formatDisplayDate();
    const { data, error } = await client
      .from('newsletter_subscribers')
      .insert({
        id,
        email,
        source,
        subscribed_date: subscribedDate,
      })
      .select()
      .single();

    if (error || !data) {
      const mapped = mapSupabaseError(error);
      return res.status(mapped.status).json({ ok: false, code: mapped.code, error: mapped.error });
    }

    return res.status(201).json({
      ok: true,
      alreadySubscribed: false,
      subscriber: {
        id: data.id,
        email: data.email,
        source: data.source,
        date: data.subscribed_date,
        isDemoSeed: false,
      },
    });
  });

  // Vite dev middleware or production static assets
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`HUGME.AR server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start HUGME.AR server:', err);
  process.exit(1);
});
