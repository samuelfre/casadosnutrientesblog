import { prisma } from '@/lib/prisma'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Footer from '@/components/Footer'
import Menu from '@/components/Menu'

type PropsCategoryPage = {
    serializabledPost: {
        image: string;
        created_at: string;
        category: {
            name: string;
        };
        slug: string;
        title: string;
        content: string;
    }[]
}

const CategoryPage: NextPage<PropsCategoryPage> = ({ serializabledPost }) => {
    return (
        <div>
            <Head>
                <title className="text-white text-3xl text-center font-bold my-8">{`${serializabledPost[0].category.name}`}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                {
                    //Aqui é lista de tags fornecidas pelo google keywords
                }
            </Head>
            <Menu />
            <main className="bg-gray-800 min-h-screen">
                <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                    <h1 className="text-4xl text-center font-bold text-white">{`${serializabledPost[0].category.name}`}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                        {
                            serializabledPost.map((post, index) => (
                                <div key={index} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                                    <div className="h-64 bg-cover bg-center">
                                        <Image style={{
                                            objectFit: 'cover',
                                            width: 600,
                                            height: 256
                                        }}
                                            alt={post.title}
                                            src={`data:image/webP;base64,${post.image}`}
                                            width={600}
                                            height={600} />
                                    </div>
                                    <div className="px-6 py-4">
                                        <Link href={`/posts/${post.slug}`} className='block text-xl font-semibold text-white hover:text-gray-300'>
                                            {post.title}
                                        </Link>
                                        <p className="text-gray-400 mt-2">{new Date(post.created_at ?? '').toLocaleDateString()}</p>
                                        <p className="text-gray-400 mt-2 truncate">{post.content}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default CategoryPage










export const getStaticProps: GetStaticProps = async (context) => {
    const { params } = context

    const nameCategory = params!.category as string

    const posts = await prisma.post.findMany({
        select: {
            title: true,
            content: true,
            image: true,
            slug: true,
            created_at: true,
            category: {
                select: {
                    name: true
                }
            }
        },
        where: {
            category: {
                slug: {
                    equals: nameCategory
                }
            }
        }
    })

    const serializabledPost = posts.map(post => ({
        ...post,
        image: post!.image.toString('base64'),
        created_at: new Date(post.created_at!).toString()
    }));


    return {
        props: {
            serializabledPost,
            nameCategory
        }
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const getPaths = await prisma.category.findMany({
        select: {
            slug: true
        }
    })

    const paths = getPaths.map(path => ({
        params: { category: path.slug! },
    }))

    return { paths, fallback: false };
}