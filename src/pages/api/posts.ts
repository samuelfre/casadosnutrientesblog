// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  posts: {
    slug: string;
    title: string;
    content: string;
    created_at: Date | null;
}[],
  imagesSTR: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        title: true,
        created_at: true,
        content: true,
        slug: true
      },
      take: 6
    })
    const images = await prisma.post.findMany({
      select: {
        image: true
      },
      take: 6
    })
    //Precisa fazer essa separação aqui, pois no cliente não é possível utilizar image.toString('base64')
    const imagesSTR = images.map(image => image.image).map(image => image.toString('base64'))
    // console.log(
    //   JSON.stringify({ posts: posts, imagesSTR}).length
    // );
    res.setHeader('Cache-Control', 'max-age=86400')
    res.status(200).json({ posts: posts , imagesSTR: imagesSTR})
  } catch (error) {
    console.log(error)
  }
}

// export const config = {
//   api: {
//     responseLimit: '128kb',
//   },
// }
