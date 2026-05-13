# Sanity CMS Integration - Quick Reference

**Project:** a729084u  
**Dataset:** production  
**Studio:** /home/ubuntu/sanity-astro-kotacom/studio  
**Web:** /home/ubuntu/sanity-astro-kotacom/web (Astro Rocket 1.3.0)

---

## 🔧 CLI Tools

### Query (Bash)
```bash
~/.hermes/scripts/sanity-query.sh 'GROQ query' [json|table|list]

# Examples
sanity-query.sh '*[_type == "post"][0...5]{_id, title, slug}'
sanity-query.sh 'count(*[_type == "post"])'
sanity-query.sh '*[_type == "post" && slug.current == "my-slug"][0]'
```

### Query & Mutate (Python)
```bash
~/.hermes/scripts/sanity.py <command>

# Commands
sanity.py query 'GROQ query'
sanity.py list-types
sanity.py create post '{"title": "...", "slug": {"current": "..."}}'
sanity.py update doc-id '{"title": "New Title"}'
sanity.py delete doc-id
```

---

## 📚 Installed Skills

Load with `skill_view(name='...')`:

1. **sanity-best-practices** - Schema, GROQ, TypeGen, Visual Editing, Portable Text, Studio, localization, migrations, framework integrations
2. **content-modeling-best-practices** - Schema design, content architecture, reuse patterns, references vs embedded
3. **content-experimentation-best-practices** - A/B testing, experiment design, metrics, statistical analysis
4. **portable-text-conversion** - HTML/Markdown → Portable Text (migration, import pipelines)
5. **portable-text-serialization** - Portable Text → React/Svelte/Vue/Astro/HTML/Markdown
6. **seo-aeo-best-practices** - SEO & AEO (metadata, Open Graph, sitemaps, JSON-LD, EEAT, AI optimization)

**Skill references:**
```bash
skill_view(name='sanity-best-practices', file_path='references/astro.md')
skill_view(name='sanity-best-practices', file_path='references/groq.md')
skill_view(name='sanity-best-practices', file_path='references/schema.md')
```

---

## 🔍 Common GROQ Queries

```groq
# List all posts
*[_type == "post"]{_id, title, slug, publishedAt}

# Get single post by slug
*[_type == "post" && slug.current == "my-slug"][0]

# Posts with author reference
*[_type == "post"]{
  title,
  "author": author->name,
  "categories": categories[]->title
}

# Count documents
count(*[_type == "post"])

# List all types
array::unique(*[]._type)

# Recent posts
*[_type == "post"] | order(publishedAt desc)[0...10]

# Search
*[_type == "post" && title match "*keyword*"]
```

---

## 🌐 Direct API (curl)

```bash
# Query
curl -s "https://a729084u.api.sanity.io/v2021-10-21/data/query/production?query=ENCODED_QUERY" \
  -H "Authorization: Bearer $SANITY_API_TOKEN"

# Create
curl -X POST "https://a729084u.api.sanity.io/v2021-10-21/data/mutate/production" \
  -H "Authorization: Bearer $SANITY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mutations": [{"create": {"_type": "post", "title": "..."}}]}'

# Update
curl -X POST "https://a729084u.api.sanity.io/v2021-10-21/data/mutate/production" \
  -H "Authorization: Bearer $SANITY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mutations": [{"patch": {"id": "doc-id", "set": {"title": "New"}}}]}'

# Delete
curl -X POST "https://a729084u.api.sanity.io/v2021-10-21/data/mutate/production" \
  -H "Authorization: Bearer $SANITY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mutations": [{"delete": {"id": "doc-id"}}]}'
```

---

## 📦 Document Types

Current schema types:
- `post` - Blog posts
- `product` - Products
- `project` - Projects
- `service` - Services
- `author` - Authors
- `category` - Categories
- `navigation` - Navigation menus
- `redirect` - URL redirects
- `siteSettings` - Site configuration
- `seoSettings` - SEO configuration

---

## 🚀 Quick Start Examples

### List all posts
```bash
sanity.py query '*[_type == "post"]{_id, title, slug}'
```

### Create new post
```bash
sanity.py create post '{
  "title": "My New Post",
  "slug": {"current": "my-new-post"},
  "publishedAt": "2026-05-13T10:00:00Z"
}'
```

### Update post title
```bash
sanity.py update post-id '{"title": "Updated Title"}'
```

### Get post with author
```bash
sanity.py query '*[_type == "post" && _id == "post-id"][0]{
  title,
  "author": author->name,
  "categories": categories[]->title
}'
```

---

## 🔐 Environment Variables

Stored in `~/.hermes/.env`:
```bash
SANITY_PROJECT_ID=a729084u
SANITY_DATASET=production
SANITY_API_TOKEN=skdyp68u...
```

---

## 📖 Resources

- **Sanity Docs:** https://www.sanity.io/docs
- **GROQ Docs:** https://www.sanity.io/docs/groq
- **API Reference:** https://www.sanity.io/docs/http-api
- **Studio:** http://localhost:3333 (when running)
- **Web:** http://localhost:4321 (Astro dev server)

---

**Last Updated:** 2026-05-13
