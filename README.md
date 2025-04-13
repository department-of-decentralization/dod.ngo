# dod.ngo

<div align="center">
  <div align="center">Website and blog of the Department of Decentralization</div>
  <img src="./public/static/images/wolpy.png" alt="Wolpy" width="300" />
  
</div>

## Install

1. Clone the repo

SSH: `git clone git@github.com/department-of-decentralization/dod.ngo.git`
HTTP: `git clone https://github.com/department-of-decentralization/dod.ngo.git`

2. Install

```bash
yarn
```

Please note, that if you are using Windows, you may need to run:

```bash
$env:PWD = $(Get-Location).Path
```

## Development

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Edit the layout in `app` or content in `data`. With live reloading, the pages auto-updates as you edit them.

## Adding blog posts

You can write blog posts in Extended Markdown (`.mdx`) format nicely. Create a `.mdx` file under `data/blog`. The file name will be the slug of the post. E.g. if you create `my-blog-post.mdx` the post will be at `powdr.org/blog/my-blog.post.mdx`. Alternatively you can create a folder `/my-blog-post` and add an `my-blog-post/index.mdx`.

Easisest is to check out some examples. See https://tailwind-nextjs-starter-blog.vercel.app/ for example posts. Source code of the posts are [here](https://github.com/timlrx/tailwind-nextjs-starter-blog/tree/main/data/blog).

The part above the `.mdx` file is called a "frontmatter":

```
---
title: Deriving the OLS Estimator
date: '2020-12-21'
draft: false
summary: 'How to derive the OLS Estimator with matrix notation and a tour of math typesetting using markdown with the help of KaTeX.'
layout: PostBanner
bibliography: references-data.bib
authors: ['default', 'sparrowhawk']
images: ['/static/images/canada/mountains.jpg']
---
```

Each post must contain a `title` and a `date`, rest is optional.

Some additional notes about blog posts:

- you can set `draft:true` to see it in your developement environment but not publish it.
- The default author is "Powdr Labs", you can add additional authors in `data/authors` and refer them in `authors` in the frontmatter.
- The default post layout is `PostLayout`. You can see the layouts in directory `layouts/`.
  To have a post with a banner image use `layout: PostBanner` and add images (typically only one image) in `images: ['/static/images/canada/mountains.jpg']`. The images should be under the directory `public/static`.

## Build and Deploy

For a static HTML build run:

```sh
$ EXPORT=1 UNOPTIMIZED=1 yarn build
```

Then, deploy the generated `out` folder or run `npx serve out` it locally.

## Licence

Based on [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)

[MIT](./LICENSE)
