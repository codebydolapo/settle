///api/graphql/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  // Verify the payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, image_url, email_addresses, username } = evt.data

    // 1. Extract primary email
    const email = email_addresses[0]?.email_address
    
    // 2. Fallback for username if not provided
    const externalUsername = username || `${first_name}${id.slice(-4)}`.toLowerCase()

    // 3. Upsert into Prisma (Create or Update)
    await prisma.user.upsert({
      where: { id: id },
      update: {
        name: `${first_name} ${last_name}`,
        image: image_url,
        email: email,
        username: externalUsername,
      },
      create: {
        id: id,
        name: `${first_name} ${last_name}`,
        image: image_url,
        email: email,
        username: externalUsername,
      },
    })
  }

  return new Response('', { status: 200 })
}