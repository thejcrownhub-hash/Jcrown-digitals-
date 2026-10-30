# JCROWN DIGITALS — Technical Specification

## 1. Concept & Vision

JCROWN DIGITALS is a premium personal-brand website for Jediah Akeredolu — a digital publications platform that feels like stepping into a private library, not a storefront. The experience is confident, intelligent, and luxurious: deep blacks contrasted with restrained gold accents create a sense of exclusivity and trust. Every interaction is purposeful; every page tells Jediah's story first, then guides visitors to his work.

**Primary visitor journey:** Discover JCrown -> Learn about Jediah -> Click "DOWNLOAD BOOKS HERE" -> Browse and download available books.

---

## 2. Design Language

### Aesthetic Direction
Inspired by luxury editorial design and premium publishing houses — think Monocle magazine meets a private members' club. Clean, spacious, authoritative.

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background (primary) | Rich Black | `#0A0A0A` |
| Background (secondary) | Charcoal | `#1A1A1A` |
| Background (panels) | Dark Gray | `#141414` |
| Accent (primary) | Royal Gold | `#C9A84C` |
| Accent (hover) | Bright Gold | `#D4B85A` |
| Text (primary) | Ivory | `#F5F0E8` |
| Text (secondary) | Muted Ivory | `#C8C0B0` |
| Text (dark bg) | White | `#FFFFFF` |
| Border/Divider | Subtle Gold | `#3A3A3A` |
| Success | Muted Green | `#4CAF50` |
| Error | Muted Red | `#E57373` |

### Typography
- **Headings:** Playfair Display (serif) — elegant, editorial authority
- **Body:** Inter (sans-serif) — clean, readable, modern
- **Fallbacks:** Georgia, serif / system-ui, sans-serif

### Spatial System
- Base unit: 8px
- Section padding: 80px–120px vertical
- Container max-width: 1200px
- Card gap: 32px
- Border radius: 4px (subtle, not rounded)

### Motion Philosophy
- Scroll-triggered fade-up reveals: 600ms ease-out
- Button hover: 200ms color + subtle lift (translateY -2px)
- Page transitions: none (instant, for speed)
- Smooth scroll behavior with 80px offset for fixed header
- Focus states: gold outline, 2px offset

### Visual Assets
- Icons: Lucide icons (line style, 1.5px stroke)
- Book covers: Admin-uploaded images, displayed in 3:4 ratio frames
- Portrait: Admin-uploaded, displayed in subtle gold-bordered circle
- Decorative: Subtle gradient overlays, fine gold dividers

---

## 3. Layout & Structure

### Public Site Structure
```
/ (Homepage)
  ├── Navigation (fixed, transparent → solid on scroll)
  ├── Hero (100vh, centered, book mockup visual)
  ├── About Jediah (two-column: portrait + text)
  ├── What JCROWN Offers (three feature cards)
  ├── Download CTA (centered gold button)
  ├── Books Section (#books, card grid)
  ├── Newsletter (centered subscription)
  ├── Contact (two-column: info + form)
  └── Footer (minimal, links)
```

### Admin Structure
```
/admin
  ├── Login
  └── Dashboard
      ├── Overview (stats)
      ├── Books Management (CRUD)
      ├── Homepage Content Editor
      ├── Subscriber Management
      └── Contact Messages
```

### Responsive Strategy
- Desktop: 1200px container, multi-column layouts
- Tablet (768px): 2-column grids, adjusted spacing
- Mobile (480px): single column, full-width cards, hamburger nav

---

## 4. Features & Interactions

### Navigation
- Fixed header, 70px height, transitions from transparent to `#0A0A0A` on scroll
- Logo left, nav links right
- Mobile: hamburger menu, full-screen overlay
- Active section highlighting via scroll spy
- Smooth scroll to anchors with 80px offset

### Hero Section
- Full viewport height
- Centered content: wordmark, welcome text, quote
- Subtle animated book stack or floating eBook covers
- Scroll indicator (chevron) at bottom

### About Section
- Two columns: portrait (40%) + bio text (60%)
- Gold divider line between portrait and text
- Editable text via admin

### What We Offer
- Three cards in a row (stacked on mobile)
- Each: icon, heading, short description
- Subtle hover: lift + gold border glow

### Download CTA Button
- Large gold button, centered
- Label: "DOWNLOAD BOOKS HERE"
- Links to `#books` with smooth scroll + 80px offset
- Keyboard accessible, visible focus/hover states

### Books Section (#books)
- Grid of book cards
- Each card: cover image, title, description, author, format badge, price label, action button
- Free books: "Download Free" button → direct file download (no login required)
- Paid books: "Get This Book" → checkout flow (Stripe or placeholder)
- Empty state: "New publications are coming soon" message
- Only published books shown

### Newsletter Section
- Email input + "Subscribe for Updates" button
- Client + server validation (valid email format)
- Success: "Thank you for subscribing!" message
- Error: specific error message displayed
- Stores subscribers in database

### Contact Section
- Fields: Name, Email, Subject, Message
- Client + server validation
- Success: "Message sent successfully" + form reset
- Error: "Failed to send. Please try again."
- Stores messages in database

### Footer
- Brand name, copyright
- Quick links (scroll to sections)
- Privacy Policy, Terms pages
- Social links (configurable in admin)

---

## 5. Component Inventory

### Button (Primary)
- Default: Gold `#C9A84C` bg, black text, 4px radius
- Hover: Lighter gold `#D4B85A`, translateY(-2px), subtle shadow
- Active: Darker gold, translateY(0)
- Disabled: 50% opacity, no pointer
- Focus: 2px gold outline, 2px offset

### Button (Secondary/Ghost)
- Default: Transparent bg, gold border, gold text
- Hover: Gold bg at 10% opacity
- Focus: Gold outline

### Book Card
- Dark panel `#141414`, subtle border
- Cover image (3:4), title, description (2-line clamp), format badge, price
- Hover: border brightens to gold, subtle lift
- Action button at bottom

### Input Field
- Dark bg `#1A1A1A`, subtle border
- Focus: gold border, no outline
- Error: red border + error message below
- Placeholder: muted ivory

### Navigation Link
- Default: ivory text
- Hover: gold text, no underline
- Active: gold text, subtle underline

---

## 6. Technical Approach

### Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Template Engine:** EJS
- **Database:** SQLite (better-sqlite3 for sync operations)
- **File Storage:** Local filesystem (`/public/uploads/`)
- **Authentication:** Express sessions + bcrypt
- **Payments:** Stripe (optional, configured via env)

### API Design

#### Public
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Homepage |
| GET | `/admin` | Admin login page |
| POST | `/admin/login` | Authenticate admin |
| POST | `/admin/logout` | End session |
| POST | `/api/subscribe` | Newsletter signup |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/books` | List published books |
| GET | `/download/:bookId` | Download free book file |

#### Admin (protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin/dashboard` | Dashboard overview |
| GET | `/admin/books` | Book management list |
| POST | `/admin/books` | Create book |
| PUT | `/admin/books/:id` | Update book |
| DELETE | `/admin/books/:id` | Delete book |
| PUT | `/admin/content` | Update homepage content |
| GET | `/admin/subscribers` | View subscribers |
| DELETE | `/admin/subscribers/:id` | Unsubscribe |
| GET | `/admin/messages` | View contact messages |
| PUT | `/admin/settings` | Update site settings |

### Data Model

#### books
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- author (TEXT, default "Jediah Akeredolu")
- cover_image (TEXT, filepath)
- file_path (TEXT, filepath)
- file_format (TEXT, e.g. "PDF")
- price (REAL, 0 for free)
- is_free (INTEGER, 0/1)
- is_published (INTEGER, 0/1)
- download_count (INTEGER, default 0)
- created_at (DATETIME)
- updated_at (DATETIME)

#### subscribers
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- is_active (INTEGER, default 1)
- subscribed_at (DATETIME)
- unsubscribed_at (DATETIME)

#### contacts
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT)
- subject (TEXT)
- message (TEXT)
- is_read (INTEGER, default 0)
- created_at (DATETIME)

#### admin_users
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- password_hash (TEXT)
- created_at (DATETIME)

#### site_content
- id (INTEGER PRIMARY KEY)
- section (TEXT, e.g. "hero", "about", "offers")
- content (TEXT, JSON)
- updated_at (DATETIME)

### Authentication
- Session-based with `express-session`
- Bcrypt password hashing (cost factor 12)
- Session stored in SQLite
- Protected routes check session admin flag
- CSRF protection on forms

### File Handling
- Multer for upload middleware
- Allowed extensions: .jpg, .jpeg, .png, .gif, .webp (covers); .pdf, .epub, .mobi (books)
- Max file size: 10MB covers, 50MB books
- Files stored in `/public/uploads/covers/` and `/public/uploads/books/`
- Filenames sanitized with UUID

### Security
- Input sanitization on all user inputs
- Parameterized queries (no raw SQL interpolation)
- XSS prevention via EJS escaping
- CSRF tokens on all forms
- Rate limiting on contact/subscribe endpoints
- Secure password requirements for admin

---

## 7. Pages & States

### Homepage
- All 9 sections visible
- Books section shows published books or empty state
- Navigation highlights current section

### Book Detail (inline in grid)
- Card shows all info
- Click download: triggers file download for free books
- Click purchase: opens checkout or payment modal

### Admin Login
- Username + password fields
- Error states for invalid credentials
- Redirect to dashboard on success

### Admin Dashboard
- Stats cards: total books, subscribers, messages, downloads
- Quick actions: Add Book, Edit Content, View Messages

### Book Management
- Table of all books (published + draft)
- Add/Edit modal or page
- Upload cover + file
- Toggle free/paid, published status

### Empty States
- No books: "New publications are coming soon"
- No subscribers: "No subscribers yet"
- No messages: "No messages yet"

---

## 8. SEO & Metadata

- Title: "JCROWN DIGITALS — Jediah Akeredolu"
- Description: "Discover digital publications and resources by Jediah Akeredolu. Explore books, access free resources, and stay updated with JCROWN DIGITALS."
- OG tags for social sharing
- Semantic HTML (header, main, section, article, footer)
- Canonical URL

---

## 9. Setup & Deployment

### Requirements
- Node.js 18+
- npm

### Installation
```bash
npm install
npm run setup    # Creates admin user, DB tables
npm start        # Runs on http://localhost:3000
```

### Environment Variables
- `SESSION_SECRET` — session encryption key
- `ADMIN_USERNAME` — default admin username
- `ADMIN_PASSWORD` — default admin password
- `STRIPE_KEY` — Stripe API key (optional)
