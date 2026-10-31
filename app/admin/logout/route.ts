import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete('d_hotel_admin_session')
  cookieStore.delete('d_hotel_admin_email')
  redirect('/admin/login')
}
