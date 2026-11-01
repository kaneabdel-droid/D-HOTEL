'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLogin(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = (formData.get('password') as string || '').trim()

  const allowedEmails = (process.env.ADMIN_EMAILS || 'admin@dembasolution.com,superadmin@dembasolution.com,kaneabdel@gmail.com')
    .split(',')
    .map(e => e.trim().toLowerCase())

  // Validation
  const isValidEmail = allowedEmails.includes(email) || email.endsWith('@dembasolution.com')
  const isValidPass = password.length >= 6 // Master / Admin check

  if (!isValidEmail || !isValidPass) {
    return { error: 'Identifiants SuperAdmin incorrects ou non autorisés.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('d_hotel_admin_session', 'authenticated_' + Date.now(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  })
  cookieStore.set('d_hotel_admin_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/admin')
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('d_hotel_admin_session')
  cookieStore.delete('d_hotel_admin_email')
  redirect('/admin/login')
}

