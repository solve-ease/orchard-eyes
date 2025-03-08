import { prisma } from '../utils/prismaClient.js'

export const getLastAnalysis = async (req, res) => {
  try {
    const { farmId } = req.query
    // const userId = req.user.sub; // Extracted from Auth0 token
    const userId = 1 // Extracted from Auth0 token

    if (!farmId) {
      return res.status(400).json({ error: 'farmId is required' })
    }

    // Fetch the farm along with the latest analysis in one query
    const farmWithAnalysis = await prisma.farm.findFirst({
      where: { id: +farmId, userId },
      include: {
        Analysis: {
          orderBy: { dateTime: 'desc' },
          take: 1 // Get only the latest analysis
        }
      }
    })
    console.log(farmWithAnalysis)
    if (!farmWithAnalysis) {
      return res
        .status(403)
        .json({ error: 'Unauthorized access to this farm or farm not found' })
    }

    const lastAnalysis = farmWithAnalysis.Analysis[0]

    if (!lastAnalysis) {
      return res.status(404).json({ error: 'No analysis found for this farm' })
    }

    res.json(lastAnalysis)
  } catch (error) {
    console.error('Error fetching last analysis:', error)
    res.status(500).json({ error: 'Internal server error, PLease try again' })
  }
}
export const getAllAnalysis = async (req, res) => {}
