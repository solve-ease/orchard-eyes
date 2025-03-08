// import { prisma } from '../utils/prismaClient.js'

// prisma.$use(async (params, next) => {
//   const result = await next(params)

//   if (
//     params.model === 'Analysis' &&
//     (params.action === 'create' ||
//       params.action === 'update' ||
//       params.action === 'delete')
//   ) {
//     const farmId = params.args.data
//       ? params.args.data.farmId
//       : params.args.where.farmId

//     const analyses = await prisma.analysis.findMany({
//       where: { farmId },
//       select: { score: true }
//     })

//     const overallScore =
//       analyses.reduce((acc, analysis) => acc + analysis.score, 0) /
//       analyses.length

//     await prisma.farm.update({
//       where: { id: farmId },
//       data: { OverallScore: overallScore }
//     })
//   }

//   return result
// })
