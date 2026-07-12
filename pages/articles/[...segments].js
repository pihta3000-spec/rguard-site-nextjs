import ArticleCategoryPage from '@/components/ArticleCategoryPage'
import ArticleDetail from '@/components/ArticleDetail'
import { getArticleCategory, getArticleCategories, getPost, getPosts, getPostsByCategory } from '@/lib/db'

export default function ArticleRoute({ post, category, posts }) {
  if (post) return <ArticleDetail post={post} />
  return <ArticleCategoryPage category={category} posts={posts} />
}

export async function getStaticPaths() {
  const [posts, categories] = await Promise.all([getPosts(), getArticleCategories()])
  return {
    paths: [
      ...(posts || [])
        .filter(post => post.categorySlug && post.slug)
        .map(post => ({ params: { segments: [post.categorySlug, post.slug] } })),
      ...(categories || []).map(category => ({ params: { segments: [category.categorySlug] } })),
    ],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const segments = params?.segments || []

  if (segments.length === 1) {
    const [slug] = segments
    const post = await getPost(slug)
    if (post?.urlPath) {
      return {
        redirect: {
          destination: post.urlPath,
          permanent: true,
        },
      }
    }
    if (post) return { props: { post }, revalidate: 60 }

    const category = await getArticleCategory(slug)
    if (!category) return { notFound: true }
    const posts = await getPostsByCategory(category.categorySlug)
    return { props: { category, posts }, revalidate: 60 }
  }

  if (segments.length === 2) {
    const [categorySlug, slug] = segments
    const post = await getPost(slug)
    if (!post) return { notFound: true }

    if (post.categorySlug && post.categorySlug !== categorySlug) {
      return {
        redirect: {
          destination: post.urlPath || `/articles/${post.categorySlug}/${post.slug}`,
          permanent: true,
        },
      }
    }

    return { props: { post }, revalidate: 60 }
  }

  return { notFound: true }
}
