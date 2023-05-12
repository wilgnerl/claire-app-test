import { createClient } from 'next-sanity'

export const cms = createClient({
  projectId: 'krpexbv5',
  dataset: 'production',
  apiVersion: '2022-03-25',
  useCdn: true,
  token: process.env.TOKEN_SANITY as string,
})
