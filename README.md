# Sri Lanka College of Radiologists  Official Website

The official website for the **Sri Lanka College of Radiologists (SLCR)**, built with Next.js 16, React 19, and Tailwind CSS v4. It serves as the digital presence for the college  showcasing leadership, academic sessions, membership information, publications, and more.

**Live URL:** [radiologist.lk](https://www.radiologist.lk)

---

## Tech Stack

| Layer | Technology |
| ------------ | ------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Framer Motion 12 |
| Database | MongoDB 7 (native driver) |
| Object Store | Cloudflare R2 (via AWS S3 SDK) |
| PDF Viewer | react-pdf 10 |
| Icons | lucide-react |
| Fonts | Inter (body), Montserrat (headings) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or Atlas)
- Cloudflare R2 bucket (for PDF storage)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
MONGODB_DB=slcr

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=https://<bucket>.<accountid>.r2.dev

# Admin Auth
ADMIN_SECRET=<your-admin-password>
JWT_SECRET=<random-secret-for-session-tokens>
```

### 3. Seed the database (optional)

```bash
npm run seed              # Presidents, councils, past presidents
npm run seed:newsletters  # Sample newsletters
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
�� app/                        # Next.js App Router
   �� page.tsx                # Home page
   �� layout.tsx              # Root layout
   �� not-found.tsx           # Custom 404
   
   �� the-college/            # About the college
      �� president-message/
      �� president-and-council/
      �� past-presidents/
      �� past-presidents-message/
      �� past-councils/
      �� history-of-the-college/
      �� committees-and-subcommittees/
   
   �� academic-sessions/
      �� upcoming-sessions/
      �� registration/
   
   �� membership/
      �� description/
      �� fellowship/
      �� application/          # Subscription plans
      �� register/            # Membership registration (Become a Member)
      �� member-login/
   
   �� publications/
      �� newsletters/
   
   �� contact-us/
   
   �� admin/                   # Protected admin pages
      �� newsletters/
      �� fellowship/
   
   �� api/                     # API routes
       �� admin/auth/
       �� newsletters/
          �� route.ts         # GET (list) / POST (create)
          �� [id]/route.ts    # DELETE
          �� upload/route.ts  # POST (presigned URL)
       �� membership/fellowship/
           �� route.ts
           �� [id]/route.ts
           �� upload/route.ts

�� components/
   �� admin/                   # Admin dashboard components
   �� home/                    # Home page sections
   �� layout/                  # Navbar, Footer, BackToTop
   �� membership/              # Forms, cards, content blocks
   �� newsletters/             # Cards, grid, PDF viewer
   �� the-college/             # PageHeader, council cards

�� lib/
   �� mongodb.ts               # DB client singleton
   �� r2.ts                    # R2 upload/delete helpers
   �� auth.ts                  # Admin session auth
   �� motion.ts                # Animation variants
   �� types.ts                 # Shared TypeScript types
   �� data/                    # Data access & static data
       �� newsletters.ts
       �� fellowshipDocuments.ts
       �� membershipDescription.ts
       �� pastCouncils.ts
       �� pastPresidents.ts
       �� presidentMessages.ts

�� data/                        # Static JSON
   �� stories.json
   �� upcomingSessions.json

public/
�� images/                      # Logos, photos
�� videos/                      # Hero background videos
�� docs/                        # Static PDFs
```

---

## Key Features

### Public Pages
- **Home**  Hero video, president's message, latest stories, college overview
- **The College**  President & council profiles, past presidents, history, committees
- **Academic Sessions**  Upcoming session schedules, registration info
- **Membership** — Description (collapsible sections), fellowship docs, subscription plans, member login, and membership registration
- **Publications**  Newsletter archive with PDF thumbnails and in-browser PDF viewer
- **Contact Us**  Contact details and location

### Admin Dashboard
- **Newsletter Management** (`/admin/newsletters`)  Upload PDFs to R2, manage metadata in MongoDB
- **Fellowship Doc Management** (`/admin/fellowship`)  Upload fellowship guidelines/forms to R2

### Document Pipeline
1. Admin requests a presigned upload URL from the API
2. PDF is uploaded directly to Cloudflare R2 from the browser
3. Metadata (title, description, URL, R2 key) is saved to MongoDB
4. Documents appear on public pages automatically

---

## Available Scripts

| Command | Description |
| ----------------------- | ------------------------------------------ |
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed presidents, councils data |
| `npm run seed:newsletters` | Seed sample newsletter records |
| `npm run deploy` | Deploy to Vercel (`vercel --prod`) |

---

## Design System

| Token | Value | Usage |
| ----------- | --------- | ----------------------------- |
| `navy` | `#0D1442` | Primary dark color |
| `gold` | `#C9A84C` | Accent / CTA color |
| `surface` | `#F8F9FC` | Light background |

Typography uses **Inter** for body text and **Montserrat** for headings, loaded via `next/font/google`.

---

## Deployment

The project is configured for **Vercel**:

```bash
npm run deploy
```

The `vercel.json` at the root handles deployment settings. Ensure all environment variables are configured in the Vercel project dashboard.

---

## License

This project is proprietary software developed for the Sri Lanka College of Radiologists.