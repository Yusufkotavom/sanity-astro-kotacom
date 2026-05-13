# Sanity Schema Reference - sanity-astro-kotacom

**Project:** a729084u  
**Dataset:** production  
**Studio Path:** /home/ubuntu/sanity-astro-kotacom/studio

---

## 📋 Post Schema

**File:** `studio/schemas/documents/post.ts`

### Fields

| Field | Type | Required | Group | Description |
|-------|------|----------|-------|-------------|
| `title` | string | ✅ | content | Post title |
| `slug` | slug | ✅ | settings | URL slug (auto from title, max 96 chars) |
| `excerpt` | text | ❌ | content | Short description/summary |
| `author` | reference | ❌ | settings | Reference to `author` document |
| `image` | image | ❌ | settings | Featured image with hotspot & alt text |
| `categories` | array | ❌ | settings | Array of references to `category` documents |
| `body` | block-content | ❌ | content | Main content (Portable Text) |
| `pageBlocks` | array | ❌ | content | Additional page blocks |
| `affiliateItems` | array | ❌ | content | Products/services being reviewed |
| `overallRating` | number | ❌ | content | Rating 1-5 (precision 0.1) |
| `verdict` | text | ❌ | content | Review conclusion |
| `aggregateRating` | object | ❌ | seo | Override rating for SEO |
| `meta` | object | ❌ | seo | SEO metadata |

### Groups

1. **content** - Main content fields (title, excerpt, body, etc.)
2. **seo** - SEO & metadata fields
3. **settings** - Configuration (slug, author, categories, image)

---

## 📝 Block Content Schema

**File:** `studio/schemas/blocks/shared/block-content.ts`

### Supported Block Types

#### 1. Text Block (Portable Text)
```typescript
{
  _type: "block",
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote",
  children: [
    {
      _type: "span",
      text: "Content here",
      marks: ["strong", "em"]
    }
  ],
  markDefs: []
}
```

**Styles:**
- `normal` - Paragraph
- `h1`, `h2`, `h3`, `h4` - Headings
- `blockquote` - Quote

**Lists:**
- `bullet` - Unordered list
- `number` - Ordered list

**Marks:**
- `strong` - Bold
- `em` - Italic
- `link` - Hyperlink (internal or external)

#### 2. Link Annotation
```typescript
{
  _type: "link",
  isExternal: boolean,
  internalLink: reference, // to page|post|service|product|project
  href: string,            // external URL
  target: boolean          // open in new tab
}
```

#### 3. Image Block
```typescript
{
  _type: "image",
  asset: reference,
  alt: string,
  hotspot: {...}
}
```

#### 4. YouTube Embed
```typescript
{
  _type: "youtube",
  videoId: string
}
```

#### 5. Code Block
```typescript
{
  _type: "code",
  code: string,
  filename: string,
  language: "typescript" | "javascript" | "jsx" | "tsx" | "html" | "css" | 
            "scss" | "json" | "python" | "php" | "ruby" | "shell" | 
            "markdown" | "yaml" | "graphql" | "sql"
}
```

---

## 🔗 Related Schemas

### Author
```typescript
{
  _type: "author",
  name: string,
  slug: slug,
  image: image
}
```

### Category
```typescript
{
  _type: "category",
  title: string,
  slug: slug,
  description: text
}
```

### Affiliate Item
```typescript
{
  _type: "affiliateItem",
  name: string,
  rating: number,
  pros: array,
  cons: array,
  url: string
}
```

---

## 📊 All Document Types

| Type | Title | Purpose |
|------|-------|---------|
| `post` | Post | Blog posts |
| `page` | Page | Static pages |
| `product` | Product | Products catalog |
| `project` | Project | Portfolio projects |
| `service` | Service | Services offered |
| `author` | Author | Content authors |
| `category` | Category | Content categories |
| `navigation` | Navigation | Site navigation menus |
| `redirect` | Redirect | URL redirects |
| `testimonial` | Testimonials | Customer testimonials |
| `faq` | FAQ | Frequently asked questions |
| `service-cluster` | Service Cluster | Service groupings |
| `service-lane` | Service Lane | Service lanes |
| `service-type` | Service Type | Service types |
| `why-choose-reason` | Why Choose Reason | Why choose us reasons |
| `reusable-section` | Reusable Section | Reusable page sections |
| `home-content` | Home Page Content | Homepage content |
| `site-settings` | Site Settings | Site configuration |
| `seo-settings` | SEO Settings | SEO configuration |
| `seo-ops-settings` | SEO Ops Settings | SEO operations config |
| `theme-settings` | Theme Settings | Theme colors |
| `settings` | Settings | General settings |

---

## 🔍 Query Examples

### Get Post with Full Relations
```groq
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "author": author->{
    _id,
    name,
    slug,
    "imageUrl": image.asset->url
  },
  "categories": categories[]->{
    _id,
    title,
    slug
  },
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  body,
  affiliateItems,
  overallRating,
  verdict,
  meta
}
```

### Get Post Body as Plain Text
```groq
*[_type == "post" && slug.current == $slug][0]{
  title,
  "bodyText": pt::text(body)
}
```

### List Posts with Pagination
```groq
*[_type == "post"] | order(publishedAt desc)[0...10]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "author": author->name,
  "categories": categories[]->title,
  "imageUrl": image.asset->url
}
```

### Count Posts by Category
```groq
{
  "total": count(*[_type == "post"]),
  "byCategory": *[_type == "category"]{
    title,
    "count": count(*[_type == "post" && references(^._id)])
  }
}
```

---

## 🛠️ Create Post via API

### Minimal Post
```bash
sanity.py create post '{
  "title": "My Post Title",
  "slug": {"current": "my-post-title"}
}'
```

### Full Post with Relations
```bash
sanity.py create post '{
  "title": "Complete Post Example",
  "slug": {"current": "complete-post-example"},
  "excerpt": "This is a short description",
  "publishedAt": "2026-05-13T10:00:00Z",
  "author": {"_ref": "5f03d4d9-2813-41ea-9af0-f260fb665a24"},
  "categories": [
    {"_ref": "c2591c42-aed0-49a3-adec-9e2a4caa7ff2"}
  ],
  "body": [
    {
      "_type": "block",
      "style": "h2",
      "children": [
        {"_type": "span", "text": "Introduction"}
      ]
    },
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {"_type": "span", "text": "This is the first paragraph."}
      ]
    }
  ]
}'
```

### Post with Image
```bash
# First upload image, get asset ID
# Then create post with image reference
sanity.py create post '{
  "title": "Post with Image",
  "slug": {"current": "post-with-image"},
  "image": {
    "_type": "image",
    "asset": {"_ref": "image-asset-id"},
    "alt": "Image description"
  }
}'
```

---

## 📚 Portable Text Examples

### Heading + Paragraph
```json
[
  {
    "_type": "block",
    "style": "h2",
    "children": [{"_type": "span", "text": "Section Title"}]
  },
  {
    "_type": "block",
    "style": "normal",
    "children": [{"_type": "span", "text": "Paragraph content here."}]
  }
]
```

### Bold & Italic
```json
{
  "_type": "block",
  "children": [
    {"_type": "span", "text": "This is "},
    {"_type": "span", "text": "bold", "marks": ["strong"]},
    {"_type": "span", "text": " and "},
    {"_type": "span", "text": "italic", "marks": ["em"]},
    {"_type": "span", "text": " text."}
  ]
}
```

### External Link
```json
{
  "_type": "block",
  "children": [
    {"_type": "span", "text": "Visit "},
    {"_type": "span", "text": "our website", "marks": ["link-1"]}
  ],
  "markDefs": [
    {
      "_key": "link-1",
      "_type": "link",
      "isExternal": true,
      "href": "https://example.com",
      "target": true
    }
  ]
}
```

### Internal Link
```json
{
  "_type": "block",
  "children": [
    {"_type": "span", "text": "Read "},
    {"_type": "span", "text": "this post", "marks": ["link-1"]}
  ],
  "markDefs": [
    {
      "_key": "link-1",
      "_type": "link",
      "isExternal": false,
      "internalLink": {"_ref": "post-id-here"}
    }
  ]
}
```

### Bullet List
```json
[
  {
    "_type": "block",
    "listItem": "bullet",
    "children": [{"_type": "span", "text": "First item"}]
  },
  {
    "_type": "block",
    "listItem": "bullet",
    "children": [{"_type": "span", "text": "Second item"}]
  }
]
```

### Image in Body
```json
{
  "_type": "image",
  "asset": {"_ref": "image-asset-id"},
  "alt": "Image description"
}
```

### YouTube Embed
```json
{
  "_type": "youtube",
  "videoId": "dQw4w9WgXcQ"
}
```

### Code Block
```json
{
  "_type": "code",
  "language": "typescript",
  "filename": "example.ts",
  "code": "const hello = 'world';"
}
```

---

## 🔐 Field Validation

### Post
- `title` - Required
- `slug` - Required, max 96 chars, auto-generated from title
- `overallRating` - Min 1, Max 5, precision 0.1

### Author
- `name` - Required
- `slug` - Required

### Category
- `title` - Required
- `slug` - Required

---

## 📖 Resources

- **Schema Files:** `/home/ubuntu/sanity-astro-kotacom/studio/schemas/`
- **Documents:** `schemas/documents/`
- **Blocks:** `schemas/blocks/`
- **Objects:** `schemas/objects/`
- **Singletons:** `schemas/singletons/`

---

**Last Updated:** 2026-05-13
