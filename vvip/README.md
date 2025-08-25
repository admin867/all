# LUXE Nightclub Website

A premium, futuristic nightclub website built with pure HTML, CSS, and JavaScript featuring 3D WebGL backgrounds, smooth animations, and responsive design.

## Features

- **Multi-page static website** with 8 main pages
- **3D WebGL particle background** using Three.js
- **Smooth GSAP animations** and micro-interactions
- **Responsive design** optimized for all devices
- **SEO optimized** with structured data and meta tags
- **Internationalization** support (English/Arabic RTL)
- **High performance** with lazy loading and optimized assets
- **Accessibility compliant** with ARIA labels and semantic HTML
- **PWA ready** with service worker and offline functionality
- **Performance monitoring** with Core Web Vitals tracking

## Pages

- `index.html` - Homepage with hero section and features
- `about.html` - About the nightclub
- `gallery.html` - Photo gallery with masonry layout
- `blog.html` - Events and news blog
- `reservation.html` - Table reservation form with WhatsApp integration
- `contact.html` - Contact form and location with interactive map
- `faq.html` - Frequently asked questions with search functionality
- `404.html` - Custom error page

## Project Structure

\`\`\`
/
├── index.html
├── about.html
├── gallery.html
├── blog.html
├── reservation.html
├── contact.html
├── faq.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── favicon.ico
├── manifest.json
├── service-worker.js
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   ├── main.css
│   │   ├── animations.css
│   │   ├── shared-components.css
│   │   └── i18n.css
│   ├── js/
│   │   ├── three.min.js
│   │   ├── gsap.min.js
│   │   ├── webgl-background.js
│   │   ├── animations.js
│   │   ├── main.js
│   │   ├── shared-components.js
│   │   ├── i18n.js
│   │   ├── seo.js
│   │   ├── performance.js
│   │   ├── gallery.js
│   │   ├── blog.js
│   │   ├── reservation.js
│   │   ├── contact.js
│   │   ├── faq.js
│   │   └── build-optimizer.js
│   ├── img/
│   │   └── (images will be added)
│   └── fonts/
│       ├── inter-variable.woff2
│       └── playfair-display-variable.woff2
└── README.md
\`\`\`

## Getting Started

### Prerequisites

- A modern web browser with WebGL support
- A local web server (recommended for development)

### Installation

1. Download or clone this repository
2. Navigate to the project directory
3. Start a local web server

### Running Locally

#### Option 1: Using Python (if installed)
\`\`\`bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
\`\`\`

#### Option 2: Using Node.js (if installed)
\`\`\`bash
# Install a simple server globally
npm install -g http-server

# Run the server
http-server -p 8000
\`\`\`

#### Option 3: Using PHP (if installed)
\`\`\`bash
php -S localhost:8000
\`\`\`

#### Option 4: Using Live Server (VS Code Extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Accessing the Website

Once the server is running, open your browser and navigate to:
- `http://localhost:8000` (or the port you specified)

## Advanced Features

### WebGL Background
- Interactive 3D particle system
- Mouse interaction and parallax scrolling
- Performance optimization with FPS monitoring
- Automatic quality adjustment for lower-end devices

### Internationalization
- Full English and Arabic language support
- RTL (Right-to-Left) layout for Arabic
- Dynamic content translation
- SEO-optimized hreflang tags

### Performance Optimization
- Service worker for offline functionality
- Lazy loading for images and resources
- Critical CSS inlining
- Resource preloading and prefetching
- Core Web Vitals monitoring

### SEO Features
- JSON-LD structured data
- Open Graph and Twitter Card meta tags
- XML sitemap generation
- Robots.txt optimization
- Breadcrumb navigation

## Customization

### Colors
The color scheme can be customized by modifying the CSS custom properties in `assets/css/main.css`:

\`\`\`css
:root {
    --color-primary: #00ffff;    /* Cyan */
    --color-secondary: #ff0080;  /* Magenta */
    --color-accent: #8000ff;     /* Purple */
    /* ... other colors */
}
\`\`\`

### Fonts
The website uses two variable fonts:
- **Inter Variable** for body text
- **Playfair Display Variable** for headings

Font files should be placed in `assets/fonts/` directory.

### Content
- Update text content directly in the HTML files
- Replace placeholder images in `assets/img/`
- Modify contact information and social links
- Update reservation form WhatsApp integration

### WebGL Settings
Adjust particle count and animation settings in `assets/js/webgl-background.js`:

\`\`\`javascript
this.particleCount = 1000; // Reduce for better performance
\`\`\`

## Performance Optimization

### Production Build
For production deployment:

1. **Minify CSS and JavaScript files**
2. **Optimize images** (convert to WebP format)
3. **Enable Gzip/Brotli compression** on your server
4. **Set appropriate cache headers**
5. **Use a CDN** for static assets

### Performance Monitoring
The website includes built-in performance monitoring:
- Core Web Vitals tracking
- FPS monitoring for WebGL
- Memory usage optimization
- Automatic quality adjustment

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**WebGL Support Required** for 3D background effects.

## Accessibility

- WCAG 2.1 AA compliant
- Screen reader compatible
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences
- ARIA labels and semantic HTML

## Deployment

### Static Hosting
This website can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

### Server Configuration
For optimal performance, configure your server with:
- Gzip/Brotli compression
- Proper cache headers
- HTTPS enabled
- HTTP/2 support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact the development team or create an issue in the project repository.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release with all core features
- Multi-page website with WebGL backgrounds
- Full internationalization support
- Performance optimization and PWA features
- SEO optimization and accessibility compliance
