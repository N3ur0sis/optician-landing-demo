# Optician Landing Page - Demo for ODB.re

A modern, interactive landing page demo for Optique de Bourbon (ODB), featuring a clean UI/UX with smooth animations and a comprehensive store pages system.

## 🚀 Features

### Landing Page
- **Interactive 3D Glasses Model** with scroll-based animation
- **Smooth Content Reveal** effect as you scroll
- **Custom Cursor** with hover effects
- **Responsive Design** optimized for all devices
- **Performance Optimized** with Framer Motion animations

### Store Pages System
- **Store Listing Page** (`/magasins`) - Browse all ODB stores
- **Individual Store Pages** (`/magasins/[slug]`) - Detailed store information
- **Navigation Dropdown** - Easy access to all stores from the main page

### Store Page Features
- Store photos gallery with image selection
- Complete store information (address, phone, hours, email)
- Customer ratings and reviews display
- Services and brands offered
- Interactive map location
- Call-to-action buttons for appointments and contact
- Responsive design matching the main landing page aesthetic

## 🏪 Available Store Pages

The demo includes several store pages based on real ODB locations:

- **Saint-Pierre Casabona** - `/magasins/saint-pierre`
- **Saint-Denis Centre** - `/magasins/saint-denis` 
- **Saint-Paul Ville** - `/magasins/saint-paul`
- **Le Port Maritime** - `/magasins/le-port`
- **Saint-André Est** - `/magasins/saint-andre`
- **Saint-Louis Sud** - `/magasins/saint-louis`

## 🛠 Technical Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Three.js & React Three Fiber** - 3D graphics for the glasses model
- **React Icons** - Icon library for UI elements
- **Lenis** - Smooth scrolling library

## 📁 Project Structure

```
app/
├── page.tsx                    # Main landing page
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── ClientLayout.tsx            # Client-side scroll context
└── magasins/                   # Store pages
    ├── page.tsx                # Store listing page
    ├── layout.tsx              # Stores layout
    ├── not-found.tsx           # 404 for invalid stores
    └── [slug]/                 # Dynamic store routes
        └── page.tsx            # Individual store page

components/
├── GlassesModel.tsx            # 3D glasses component
├── ContentReveal.tsx           # Scroll-reveal content
└── CustomCursor.tsx            # Custom cursor component

styles/
├── luxury.css                  # Luxury design styles
└── transitions.css             # Animation transitions
```

## 🎨 Design Features

### Landing Page
- **Radial gradient background** for depth
- **Typography hierarchy** with Poppins font
- **Micro-interactions** on hover and scroll
- **Loading animation** with branded elements
- **Scroll indicators** that fade as user progresses

### Store Pages
- **Hero sections** with gradient backgrounds
- **Image galleries** with smooth transitions
- **Information cards** with consistent styling
- **Interactive elements** with hover effects
- **Call-to-action sections** for conversions

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

All pages are fully responsive with optimized layouts for each breakpoint.

## 🎯 Performance Optimizations

- **CSS optimizations** with will-change properties
- **Image optimization** with Next.js Image component
- **Animation performance** with GPU acceleration
- **Code splitting** with dynamic imports
- **Font optimization** with Google Fonts

## 🔗 Navigation

The main navigation includes a dropdown menu for "MAGASINS" that provides:
- Link to view all stores (`/magasins`)
- Direct links to individual store pages
- Smooth hover animations and transitions

## 📞 Contact Integration

Each store page includes:
- **Direct phone links** for immediate contact
- **Email links** with pre-filled recipients
- **Appointment booking** links to external system
- **Social media** links to Facebook and Instagram

## 🗺 Future Enhancements

- **Interactive maps** with Google Maps integration
- **Real-time store hours** and availability
- **Online appointment booking** system integration
- **Customer reviews** API integration
- **Inventory management** for frames and services

## 📄 License

This is a demo project created for Optique de Bourbon (ODB.re). All branding and content are used for demonstration purposes.

---

**Demo URL:** [Your deployed URL here]  
**Original Site:** https://odb.re  
**Contact:** [Your contact information]
