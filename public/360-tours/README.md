# 360° Virtual Tour Media Storage Guide

This directory contains all 360° images and videos for the University of Bohol Virtual Campus Tour.

## 📁 Directory Structure

```
public/360-tours/
├── locations.json          # Configuration file for all locations
├── main-building/
│   ├── panorama.jpg       # 360° equirectangular image
│   ├── video.mp4          # Optional 360° video
│   └── thumbnail.jpg      # Preview thumbnail
├── library/
│   ├── panorama.jpg
│   ├── video.mp4
│   └── thumbnail.jpg
├── student-center/
│   ├── panorama.jpg
│   ├── video.mp4
│   └── thumbnail.jpg
├── cafeteria/
│   ├── panorama.jpg
│   ├── video.mp4
│   └── thumbnail.jpg
└── campus-grounds/
    ├── panorama.jpg
    ├── video.mp4
    └── thumbnail.jpg
```

## 🖼️ Image Requirements

### 360° Panorama Images
- **Format**: JPG or PNG
- **Projection**: Equirectangular (2:1 aspect ratio)
- **Recommended Resolution**: 4096x2048 or higher
- **File Size**: Optimize to under 5MB for web performance
- **Naming**: `panorama.jpg` or `panorama.png`

### Thumbnail Images
- **Format**: JPG
- **Resolution**: 400x200 pixels
- **File Size**: Under 100KB
- **Naming**: `thumbnail.jpg`

### 360° Videos (Optional)
- **Format**: MP4 (H.264 codec)
- **Projection**: Equirectangular
- **Resolution**: 1920x960 or 3840x1920
- **File Size**: Optimize for web streaming
- **Naming**: `video.mp4`

## 📝 How to Add New 360° Media

### Step 1: Prepare Your Media
1. Capture 360° photos/videos using a 360° camera
2. Export in equirectangular format
3. Optimize file sizes for web

### Step 2: Create Location Directory
```powershell
# Create a new directory for your location
New-Item -ItemType Directory -Path "public\360-tours\your-location-name"
```

### Step 3: Add Your Files
Place your files in the location directory:
- `panorama.jpg` - Main 360° image (required)
- `thumbnail.jpg` - Preview image (required)
- `video.mp4` - 360° video (optional)

### Step 4: Update Configuration
Edit `public/360-tours/locations.json` and add your location:

```json
{
  "id": "your-location-name",
  "name": "Display Name",
  "description": "Brief description of the location",
  "imageUrl": "/360-tours/your-location-name/panorama.jpg",
  "videoUrl": "/360-tours/your-location-name/video.mp4",
  "thumbnailUrl": "/360-tours/your-location-name/thumbnail.jpg",
  "hotspots": [
    {
      "pitch": 0,
      "yaw": 45,
      "type": "info",
      "text": "Point of Interest"
    }
  ]
}
```

## 🎯 Hotspot Configuration

Hotspots are interactive markers in the 360° view:

### Hotspot Properties
- **pitch**: Vertical angle (-90 to 90, 0 is horizon)
- **yaw**: Horizontal angle (-180 to 180, 0 is forward)
- **type**: Either `"info"` or `"link"`
- **text**: Display text for the hotspot
- **targetId**: (For type "link") ID of location to navigate to

### Example Hotspots
```json
{
  "pitch": 0,
  "yaw": 45,
  "type": "info",
  "text": "Main Entrance"
}
```

```json
{
  "pitch": -10,
  "yaw": -30,
  "type": "link",
  "text": "Go to Library",
  "targetId": "library"
}
```

## 🔗 Image URL Format

When referencing images in your code, use the following format:

### In React Components
```typescript
imageUrl="/360-tours/main-building/panorama.jpg"
```

### In Configuration Files
```json
"imageUrl": "/360-tours/main-building/panorama.jpg"
```

### Full URL (if needed)
```
http://localhost:3000/360-tours/main-building/panorama.jpg
```

## 🛠️ Tools for Creating 360° Content

### Recommended 360° Cameras
- Insta360 ONE X2
- Ricoh Theta Z1
- GoPro MAX

### Image Processing
- **PTGui** - Stitching multiple photos
- **Hugin** - Free panorama stitching
- **Adobe Photoshop** - Editing equirectangular images

### Optimization Tools
- **ImageOptim** - Compress images without quality loss
- **TinyPNG** - Online image compression
- **HandBrake** - Video compression

## 📊 Performance Tips

1. **Optimize Images**: Keep panorama images under 5MB
2. **Use Progressive JPEGs**: Better loading experience
3. **Lazy Load**: Videos should only load when selected
4. **CDN**: Consider using a CDN for production
5. **Responsive Images**: Provide multiple resolutions if needed

## 🔒 Security Notes

- All media files are publicly accessible via the `/360-tours/` URL path
- Do not store sensitive information in filenames or metadata
- The ScreenProtection component prevents screenshots and screen recording
- Watermarks are automatically applied during viewing

## 🚀 Usage in Code

### Loading from Configuration
```typescript
import locationsData from '@/public/360-tours/locations.json';

const locations = locationsData.locations;
```

### Using in PanoramaViewer
```tsx
<PanoramaViewer
  imageUrl="/360-tours/main-building/panorama.jpg"
  hotspots={location.hotspots}
  autoRotate={true}
/>
```

## 📞 Support

For questions or issues with 360° media setup, contact the development team.
