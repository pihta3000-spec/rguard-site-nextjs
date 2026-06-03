import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'y9ptramm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function getPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id, title, "slug": slug.current, category,
    publishedAt, excerpt, body, seo,
    "coverImage": coverImage.asset->url,
    "relatedPosts": relatedPosts[]->{
      _id, title, "slug": slug.current, category, publishedAt, excerpt,
      "coverImage": coverImage.asset->url
    }
  }`)
}

export async function getPost(slug) {
  return client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, category,
    publishedAt, excerpt, body, seo,
    "coverImage": coverImage.asset->url,
    "relatedPosts": relatedPosts[]->{
      _id, title, "slug": slug.current, category, publishedAt, excerpt,
      "coverImage": coverImage.asset->url
    }
  }`, { slug })
}

export async function getCases() {
  return client.fetch(`*[_type == "case"] | order(order asc) {
    _id, "id": slug.current, title, service, accent,
    shortText, task, solution, metrics, links, whatWorked, featured
  }`)
}

export async function getIndustries() {
  return client.fetch(`*[_type == "industry"] | order(order asc) {
    _id, title, "slug": slug.current, icon, shortDesc,
    body, linkedServices, seo,
    "coverImage": coverImage.asset->url
  }`)
}

export async function getIndustry(slug) {
  return client.fetch(`*[_type == "industry" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, icon, shortDesc,
    body, linkedServices, seo,
    "coverImage": coverImage.asset->url
  }`, { slug })
}

export async function getBloggers() {
  return client.fetch(`*[_type == "blogger"] | order(order asc) {
    _id, name, "slug": slug.current, desc, bio,
    metrics, socials, specializations,
    "photos": photos[].asset->url,
    showreel
  }`)
}

export async function getBlogger(slug) {
  return client.fetch(`*[_type == "blogger" && slug.current == $slug][0] {
    _id, name, "slug": slug.current, desc, bio,
    metrics, socials, specializations,
    "photos": photos[].asset->url,
    showreel
  }`, { slug })
}
