# Systems-Network-Monitor
Dashboard Monitor for Monitoring the Health, Functions, &amp; Stability of Complex/Interconnected Systems and their Structures/Networks
# Systems Network Monitor (SNM)

[![License: PolyForm Shield 1.0.0](https://img.shields.io/badge/License-PolyForm%20Shield-blue.svg)](LICENSE-SHIELD.md)
[![License: PolyForm Noncommercial 1.0.0](https://img.shields.io/badge/License-PolyForm%20Noncommercial-blue.svg)](LICENSE-NONCOMMERCIAL.md)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green.svg)]()

**Real-time monitoring and management platform for complex networked ecosystems**

Systems Network Monitor (SNM) is a comprehensive web-based application designed to help human operators manage the overwhelming complexity of large-scale supply chain networks and Air Traffic Control (ATC) systems. By combining real-time monitoring, intelligent alerting, and advanced visualization (including COFM - Complexly Organized Flexibly Manageable graphs), SNM provides operators with actionable insights for maintaining system health and coordinating emergency responses.

![SNM Dashboard](docs/images/snm-dashboard-preview.png)

## 🎯 Key Features

### **Dual Ecosystem Support**

- **Supply Chain Networks**: Monitor suppliers, manufacturers, distributors, warehouses, and retail endpoints
- **Air Traffic Control**: Track tower controls, TRACONs, and center facilities with real-time flight data

### **Core Capabilities**

- 🔴 **Real-Time Monitoring**: Live status tracking with health indicators (Healthy/Warning/Critical)
- 📊 **Multiple View Modes**: Topology, List, and Metrics visualizations
- 🎨 **COFM Visualization**: Unified WBS+PERT+Gantt+Scatterplot graph for project management
- ⚠️ **Intelligent Alerting**: Severity-based alerts with actionable responses
- 🔧 **Maintenance Management**: Schedule and track system maintenance windows
- 🤖 **AI-Powered Recommendations**: Load balancing and route optimization suggestions
- 🔍 **Search & Filter**: Real-time node filtering by status and location
- 📈 **Performance Analytics**: Uptime tracking, throughput analysis, and trend visualization

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher (or yarn 1.22.x)
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/systems-network-monitor.git
cd systems-network-monitor

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

### Production Build

```bash
# Create optimized production build
npm run build

# Serve production build locally
npm run serve
```

## 📖 Documentation

- [**Whitepaper**](docs/WHITEPAPER.md) - Technical architecture and design philosophy
- [**Entity Relationship Diagram**](docs/ERD.md) - Data model and relationships
- [**User Guide**](docs/USER_GUIDE.md) - Comprehensive usage instructions
- [**API Documentation**](docs/API.md) - Integration and extension guide
- [**COFM Specification**](docs/COFM.md) - Detailed COFM graph methodology

## 🏗️ Repository Structure

```
systems-network-monitor/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard/       # Dashboard view components
│   │   ├── Topology/        # Network topology visualization
│   │   ├── COFM/           # COFM graph components
│   │   ├── Alerts/         # Alert panel and management
│   │   └── NodeDetails/    # Node detail panels
│   ├── data/               # Sample data and schemas
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── App.jsx             # Main application component
├── public/                 # Static assets
├── docs/                   # Documentation
│   ├── images/            # Screenshots and diagrams
│   ├── WHITEPAPER.md      # Technical whitepaper
│   ├── ERD.md             # Entity Relationship Diagram
│   └── USER_GUIDE.md      # User documentation
├── tests/                  # Test suites
├── LICENSE-SHIELD.md       # PolyForm Shield License
├── LICENSE-NONCOMMERCIAL.md # PolyForm Noncommercial License
├── package.json
└── README.md
```

## 🎨 COFM Visualization

SNM includes an innovative **COFM (Complexly Organized Flexibly Manageable)** graph that compresses four traditional project management methodologies into a single unified visualization:

- **WBS (Work Breakdown Structure)** - Hierarchy as Z-axis/node size
- **PERT (Program Evaluation Review Technique)** - Critical path as red lines
- **Gantt Chart** - Timeline as X-axis
- **Scatterplot** - Resources as Y-axis

This compression allows operators to extract multiple insights from a single view while maintaining clarity and actionability.

## 🔐 Use Cases

### Supply Chain Management

- Monitor end-to-end supply chain visibility
- Track shipments across multiple nodes
- Identify bottlenecks and optimize routing
- Coordinate maintenance across distributed facilities
- Generate compliance and performance reports

### Air Traffic Control

- Real-time airspace management
- Monitor tower, TRACON, and center facilities
- Track flight handoffs and communications
- Coordinate emergency responses
- Weather impact assessment

## 📊 System Requirements

### Minimum Requirements

- 4GB RAM
- Modern browser with JavaScript enabled
- 1280x720 display resolution
- Stable internet connection (for real-time updates)

### Recommended Requirements

- 8GB+ RAM
- 1920x1080+ display resolution
- Dedicated GPU for complex visualizations
- Low-latency network connection

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code style and standards
- Pull request process
- Issue reporting
- Development setup

## 📄 Licensing

This project is dual-licensed:

1. **[PolyForm Shield License 1.0.0](LICENSE-SHIELD.md)** - Allows use and modification with restrictions on competing uses
1. **[PolyForm Noncommercial License 1.0.0](LICENSE-NONCOMMERCIAL.md)** - Allows noncommercial use and modification

**For commercial licensing inquiries**, please contact: [licensing@yourcompany.com](mailto:licensing@yourcompany.com)

## 🙏 Acknowledgments

- React team for the excellent framework
- Lucide for the icon library
- Contributors and beta testers
- Systems engineering community for feedback

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/systems-network-monitor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/systems-network-monitor/discussions)
- **Email**: support@yourcompany.com
- **Documentation**: [docs.yourcompany.com](https://docs.yourcompany.com)

## 🗺️ Roadmap

### Version 2.0 (Q2 2025)

- [ ] Real-time WebSocket integration
- [ ] Multi-user collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (iOS/Android)
- [ ] Machine learning predictive maintenance

### Version 3.0 (Q4 2025)

- [ ] Enterprise SSO integration
- [ ] Custom plugin system
- [ ] Multi-tenant architecture
- [ ] Advanced COFM customization
- [ ] Kubernetes deployment support

-----

**Made with ❤️ for systems operators managing complex networks**

*Systems Network Monitor - Making complexity manageable*
