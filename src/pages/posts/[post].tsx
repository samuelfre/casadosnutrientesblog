import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Post from '../components/Post';
import { post } from '@prisma/client';
import { useRouter } from 'next/router';
import { API_POST, API_POSTS } from '@/utils/globalvars';

const fetcher = (url: string, options: {
  'slug': string}) => fetch(url, {
  body: JSON.stringify(options),
  method: 'POST'
}).then((res) => res.json());


type Data = {
  post: post,
  imagesSTR: string
//   category: category,
//   tags: tag[]
}

type PropsPost = {
  resPostPage: Data
}

// const PostPage: NextPage<PropsPost> = ({resPostPage}) --------> lembrança de como tava.

const PostPage: NextPage<PropsPost> = () => {
  // const {post, imagesSTR} = resPostPage
  // const router = useRouter()
  // if (router.isFallback) {
  //   return <div>Loading...</div>
  // }

  return (
    <div>
      {/* <Post
        title= {post.title}
        content= {post.content}
        imageUrl= {imagesSTR}
        instagramLink= {post.ig_url ?? '#'}
        kawaiLink= {post.kawai_url ?? '#'}
        tiktokLink= {post.tiktok_url}
        youtubeLink= {post.yt_url ?? '#'}
        createdAt= {new Date(post.created_at ?? '').toLocaleDateString()}
      /> */}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context

  // const resPostPage: Data = await fetcher(API_POST, {
  //   slug: params!.post as string
  // });

  return {
      props: {
        'resPostPage': 'teste'
      }
  };
}







type Dataa = {
  posts: post[],
}

const fetcherr = (url: string) => fetch(url).then((res) => res.json());

export const getStaticPaths: GetStaticPaths = async () =>{
  const posts: Dataa = await fetcherr(API_POSTS);

  const paths = posts.posts.map(post => ({
    params: { post: post.slug }
  }))
  
  return { paths, fallback: false };
}

export default PostPage;