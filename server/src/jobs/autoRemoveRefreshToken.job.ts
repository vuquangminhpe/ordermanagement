import prisma from '@/database'
import { Cron } from 'croner'

const autoRemoveRefreshToken = async () => {
  new Cron('@hourly', async () => {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })
    } catch (error) {
      console.log('Error when remove refresh token', error)
    }
  })
}
export default autoRemoveRefreshToken
