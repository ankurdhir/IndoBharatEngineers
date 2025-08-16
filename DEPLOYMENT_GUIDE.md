# 🚀 GitHub Pages Deployment Guide
**Indo Bharat Engineers Website**

## ✅ Pre-Deployment Verification

### All paths are correctly configured as relative:
- ✅ CSS: `assets/css/styles.css`
- ✅ JavaScript: `assets/js/script.js`
- ✅ Images: `assets/images/[filename]`
- ✅ Navigation: `index.html`, `about.html`, `contact.html`
- ✅ All links are relative and GitHub Pages compatible

## 📋 Step-by-Step Deployment Instructions

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and log in
2. Click **"New Repository"** (green button)
3. Repository Name: `megaampere` (or your preferred name)
4. Description: `Professional electrical engineering services website`
5. Make it **Public** (required for free GitHub Pages)
6. ✅ Check **"Add a README file"**
7. Click **"Create repository"**

### Step 2: Upload Your Website Files

#### Option A: Using GitHub Web Interface (Easier)
1. In your new repository, click **"uploading an existing file"**
2. Drag and drop these files/folders:
   ```
   📁 assets/
   📄 index.html
   📄 about.html
   📄 contact.html
   📄 package.json
   📄 tailwind.config.js
   ```
3. **Important:** Upload the `assets` folder with all its contents
4. Scroll down, add commit message: "Initial website deployment"
5. Click **"Commit changes"**

#### Option B: Using Git (Advanced)
```bash
# In your megaampere folder
git init
git add .
git commit -m "Initial website deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/megaampere.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your repository, go to **"Settings"** tab
2. Scroll down to **"Pages"** section (left sidebar)
3. Under **"Source"**, select **"Deploy from a branch"**
4. Branch: **"main"** 
5. Folder: **"/ (root)"**
6. Click **"Save"**

### Step 4: Access Your Website
1. GitHub will provide a URL like: `https://YOUR-USERNAME.github.io/megaampere/`
2. Website will be live in 2-10 minutes
3. Green checkmark ✅ appears when deployment succeeds

## 🔧 Important Files Structure
Your repository should look like this:
```
megaampere/
├── index.html          # Home page (must be in root)
├── about.html          # Services page
├── contact.html        # Contact page
├── assets/
│   ├── css/
│   │   └── styles.css  # All styles
│   ├── js/
│   │   └── script.js   # All JavaScript
│   └── images/         # All images (28 files)
├── package.json        # Dependencies info
├── tailwind.config.js  # Tailwind configuration
└── README.md          # Project description
```

## ⚠️ Important Notes

### Domain URLs
- Update these in `index.html` after deployment:
  ```html
  <meta property="og:url" content="https://YOUR-USERNAME.github.io/megaampere/">
  <meta property="twitter:url" content="https://YOUR-USERNAME.github.io/megaampere/">
  ```

### What Works on GitHub Pages:
✅ Static HTML, CSS, JavaScript
✅ Images and assets
✅ Responsive design
✅ Dark mode toggle
✅ Carousel functionality
✅ Contact forms (WhatsApp integration)
✅ All animations and interactions

### What Doesn't Work:
❌ Server-side code (PHP, Node.js, etc.)
❌ Database connections
❌ Server-side form processing

## 🧪 Testing Your Deployment

Visit your live website and test:
1. **Navigation**: All pages load correctly
2. **Images**: Carousel and all images display
3. **Responsive**: Test on mobile/tablet
4. **Dark Mode**: Toggle works
5. **Contact Form**: WhatsApp integration functions
6. **Links**: All internal/external links work

## 🔄 Making Updates

After initial deployment, to update your website:

#### Via GitHub Web:
1. Go to your repository
2. Navigate to file you want to edit
3. Click pencil ✏️ icon to edit
4. Make changes and commit

#### Via Git:
```bash
# Make your changes locally
git add .
git commit -m "Update description"
git push origin main
# Changes go live automatically!
```

## 🌐 Custom Domain (Optional)

To use your own domain (like `indobharatengineers.com`):
1. Buy domain from registrar
2. In repository Settings → Pages → Custom domain
3. Enter your domain
4. Update DNS at your registrar:
   ```
   CNAME → YOUR-USERNAME.github.io
   ```

## 📞 Support

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Pages Status**: https://www.githubstatus.com/
- **Your Website**: `https://YOUR-USERNAME.github.io/megaampere/`

## ✅ Post-Deployment Checklist

- [ ] Repository is public
- [ ] All files uploaded correctly
- [ ] GitHub Pages enabled
- [ ] Website loads at provided URL
- [ ] All pages accessible
- [ ] Images display correctly
- [ ] Contact form works
- [ ] Mobile responsive
- [ ] Dark mode functional

**Your website is ready for professional use! 🎉**
