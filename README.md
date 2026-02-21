# Virtual Campus Companion

A comprehensive web-based virtual guide for the University of Bohol campus featuring 360° tours, interactive mapping, intelligent routing, and robust security measures.

## Features

### 🏛️ 360° Virtual Tours
- Immersive panoramic views of campus buildings
- Interactive hotspots for navigation
- Smooth transitions between locations
- Support for both 360° photos and videos

### 🗺️ Interactive Campus Map
- Real-time interactive map with building markers
- Visual path status indicators (open, construction, closed)
- Click-to-navigate building selection
- Responsive map controls

### 🧭 Smart Routing
- Dijkstra's algorithm for optimal pathfinding
- Dynamic route recalculation based on path availability
- Accessibility-aware routing options
- Real-time distance and time estimates

### 📚 Resource Directory
- Searchable campus facilities and services
- Department and office locations
- Contact information and operating hours
- Categorized resource browsing

### 🔒 Security Features
- Screenshot prevention with watermarking
- Screen recording detection
- Activity logging and monitoring
- Suspicious behavior alerts
- Multi-tier access control (public, student, staff, admin)
- Selective information disclosure for sensitive areas

### 👨‍💼 Admin Dashboard
- Real-time path status management
- Construction/closure flagging system
- Automatic route recalculation
- Usage analytics and statistics
- Security monitoring and logs
- Building and resource management

## Getting Started

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet.js with React-Leaflet
- **360° Viewer**: Pannellum
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Database**: MongoDB (ready for integration)

## Project Structure

```
VCC/
├── app/
│   ├── page.tsx              # Landing page
│   ├── tour/                 # Virtual tour pages
│   ├── map/                  # Interactive map pages
│   ├── admin/                # Admin dashboard
│   └── api/                  # API routes
├── components/
│   ├── VirtualTour/          # 360° viewer components
│   ├── Map/                  # Map components
│   └── Security/             # Security components
├── lib/
│   ├── types.ts              # TypeScript definitions
│   ├── pathfinding.ts        # Routing algorithms
│   └── db/                   # Database models
└── public/                   # Static assets
```

## Security Considerations

### Anti-Terrorism Measures
1. **Access Control Tiers**: Public users see limited information; authenticated users access detailed data
2. **Information Filtering**: Sensitive infrastructure automatically hidden
3. **Activity Monitoring**: All sessions logged with IP tracking
4. **Rate Limiting**: Prevents bulk data extraction
5. **Watermarking**: Session-based watermarks on sensitive views

### Screenshot Protection
- Right-click disabled
- Keyboard shortcuts blocked (Print Screen, F12, etc.)
- Screen recording detection
- Dynamic watermarks with session IDs
- Blur on window focus loss

**Note**: These measures deter casual users but cannot prevent determined attackers with external cameras or virtual machines.

## Admin Features

### Path Management
- Flag paths as open, under construction, or closed
- Set closure reasons and estimated reopening dates
- System automatically recalculates affected routes
- Real-time updates to active users

### Analytics
- Total visitor count
- Active user sessions
- Popular routes and destinations
- Search query analytics

### Security Monitoring
- Suspicious activity alerts
- Session logs with IP addresses
- Screen capture attempt detection
- Unusual access pattern identification

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AR navigation overlays
- [ ] Voice-guided tours
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Integration with university calendar
- [ ] Emergency alert system
- [ ] Accessibility improvements (screen readers, high contrast)

## Contributing

This is a thesis project for the University of Bohol. For questions or contributions, please contact the development team.

## License

© 2026 University of Bohol. For educational and navigational purposes only.
