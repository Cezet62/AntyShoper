import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const ALLOWED_ORIGINS = [
  'https://anty-shoper.vercel.app',
  'http://localhost:5173',
]

function corsHeaders(origin: string) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin') || ''

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) })
  }

  try {
    const { orderId, items, shippingCost, customerEmail } = await req.json()

    // Buduj line_items z produktów
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'pln',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // grosze
        },
        quantity: item.quantity,
      })
    )

    // Dodaj koszt dostawy jako osobną pozycję
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'pln',
          product_data: { name: 'Dostawa' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['p24', 'blik', 'card'],
      mode: 'payment',
      locale: 'pl',
      customer_email: customerEmail,
      line_items: lineItems,
      metadata: { orderId },
      success_url: `https://anty-shoper.vercel.app/sukces?session_id={CHECKOUT_SESSION_ID}&order=${orderId}`,
      cancel_url: 'https://anty-shoper.vercel.app/koszyk',
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Stripe session error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
