import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  const { id } = evt.data
  const eventType = evt.type

  // Ensure `id` is defined
  if (!id) {
    return new Response('Error: Missing user ID in webhook payload', {
      status: 400,
    })
  }

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { first_name, last_name, image_url, email_addresses } = evt.data;
  
    // Provide default values for nullable fields
    const firstName = first_name || '';
    const lastName = last_name || '';
    const imageUrl = image_url || '';
  
    try {
      const user = await createOrUpdateUser(
        id, // `id` is guaranteed to be a string
        firstName, // `firstName` is now guaranteed to be a string
        lastName, // `lastName` is now guaranteed to be a string
        imageUrl, // `imageUrl` is now guaranteed to be a string
        email_addresses[0]?.email_address || '' // Assuming email_addresses is an array
      );
  
      if (user && eventType === 'user.created') {
        try {
          const client = await clerkClient();
          await client.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id, // `_id` is now guaranteed to be a string
            },
          });
        } catch (error) {
          console.log('Error: Could not update user metadata:', error);
        }
      }
    } catch (error) {
      console.log('Error: Could not create or update user:', error);
      return new Response('Error: Could not create or update user', {
        status: 400,
      });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await deleteUser(id) // `id` is guaranteed to be a string
    } catch (error) {
      console.log('Error: Could not delete user:', error)
      return new Response('Error: Could not delete user', {
        status: 400,
      })
    }
  }

  return new Response('Webhook received', { status: 200 })
}

