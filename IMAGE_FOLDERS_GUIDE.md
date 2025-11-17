# Image Folders Guide

This document lists all the image folders created for each page in the application.

## Folder Structure

Each page has its own `imgs` folder located within its directory:

### Main Pages
- `src/app/imgs/` - Homepage images
- `src/app/about/imgs/` - About page images
- `src/app/contact/imgs/` - Contact page images
- `src/app/features/imgs/` - Features page images
- `src/app/how-it-works/imgs/` - How It Works page images
- `src/app/pro/imgs/` - Pro/Premium page images
- `src/app/download/imgs/` - Download page images
- `src/app/jobs/imgs/` - Jobs/Careers page images
- `src/app/faq/imgs/` - FAQ page images

### Authentication Pages
- `src/app/auth/login/imgs/` - Login page images
- `src/app/auth/signup/imgs/` - Signup page images

### Application Pages
- `src/app/dashboard/imgs/` - Dashboard page images
- `src/app/groups/imgs/` - Groups page images
- `src/app/settings/imgs/` - Settings page images

### Calculator Pages
- `src/app/calculators/imgs/` - Main calculators page images
- `src/app/calculators/bill-splitter/imgs/` - Bill splitter calculator images
- `src/app/calculators/fairness/imgs/` - Fairness calculator images
- `src/app/calculators/rent/imgs/` - Rent calculator images
- `src/app/calculators/travel/imgs/` - Travel calculator images

### Content Pages
- `src/app/blog/imgs/` - Blog listing page images
- `src/app/press/imgs/` - Press page images

### Legal & Info Pages
- `src/app/privacy/imgs/` - Privacy policy page images
- `src/app/terms/imgs/` - Terms of service page images
- `src/app/security/imgs/` - Security page images
- `src/app/pay/imgs/` - Payment services page images

## Usage Guidelines

### Image Naming Convention
- Use lowercase with hyphens: `hero-image.png`
- Be descriptive: `feature-track-balances.svg`
- Include size if multiple versions: `logo-small.png`, `logo-large.png`

### Recommended Image Formats
- **SVG**: For icons, logos, and illustrations (scalable, small file size)
- **PNG**: For images with transparency
- **JPG/JPEG**: For photographs and complex images
- **WebP**: For modern browsers (better compression)

### Image Optimization
- Compress images before adding them
- Use appropriate dimensions (don't use 4K images for thumbnails)
- Consider using Next.js Image component for automatic optimization

### Accessing Images in Code
```tsx
import Image from 'next/image';

// For images in the same page folder
<Image src="/app/about/imgs/team-photo.jpg" alt="Our team" width={800} height={600} />

// Or using relative imports
import heroImage from './imgs/hero-image.png';
<Image src={heroImage} alt="Hero" />
```

## Next Steps

1. Add your images to the appropriate folders
2. Update the page components to reference the images
3. Ensure all images are optimized for web
4. Add alt text for accessibility

## Notes

- Each folder is ready to receive images specific to that page
- Keep images organized by page to maintain a clean structure
- Consider creating subfolders within imgs/ if a page has many images (e.g., `imgs/icons/`, `imgs/screenshots/`)
