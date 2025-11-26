# BlogXpress

BlogXpress A fast, clean, and fully functional personal blog built with Next.js 15, Prisma, Kinde Authentication, and a clean, responsive UI powered by TailwindCSS and shadcn/ui. It allows authenticated users to create, manage, and publish blog articles with pagination, rich content, and a dashboard experience.

---

**Features**

- Secure login and registration via Kinde Auth.
- Protected dashboard routes.
- Create rich blog posts with title, content, and cover image.
- Server‑side pagination for user articles.
- SEO‑friendly URL structure.
- Responsive design using TailwindCSS.
- Reusable components including cards, buttons, forms, and pagination controls.

**Database Layer**

- Prisma ORM connected to a PostgreSQL (Neon) database

- Typed data models and efficient queries.

**Deployment**

- Fully deployed on Vercel with optimized builds.
- Image optimization with remote patterns.

---

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 15 (App Router)             |
| Language       | TypeScript                          |
| Styling        | TailwindCSS + shadcn/ui             |
| Authentication | Kinde                               |
| Database       | PostgreSQL on **Neon** (serverless) |
| ORM            | Prisma                              |
| Deployment     | Vercel                              |
| Image Hosting  | Cloudinary / Direct upload          |


## Environment Variables (.env.local)

```env
DATABASE_URL="postgresql://..."

KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGIN_REDIRECT_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
DATABASE_URL=
---

##Running Locally

```bash
git clone https://github.com/Habiboyewo/blogxpress
cd blogxpress
npm install
npm run dev
Visit:http://localhost:3000

---

## Deployment

This project is ready for one‑click deployment on **Vercel**:

- Automatic builds from the `main` branch
- Environment variables handled through Vercel dashboard

---

 project is licensed for personal and educational use. You may modify and extend it for your own projects.

---

Pull requests and feature suggestions are welcome! Feel free to open an issue.

---
## Contact

For questions or collaboration, reach out:

- **GitHub:** Habiboyewo
- **Mail:** Habiboyewo98@gmail.com
- **Project Repository:** [https://github.com/Habiboyewo/blogxpress]
