# Systems Network Monitor

[![License: PolyForm Shield 1.0.0](https://img.shields.io/badge/License-PolyForm%20Shield-blue.svg)](LICENSE-SHIELD.md)
[![License: PolyForm Noncommercial 1.0.0](https://img.shields.io/badge/License-PolyForm%20Noncommercial-blue.svg)](LICENSE-NONCOMMERCIAL.md)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-MVP%20Development-yellow.svg)]()

Real-time monitoring platform for managing complex networked systems including supply chains and Air Traffic Control facilities.

## Overview

Systems Network Monitor helps operators manage large-scale networked systems through real-time monitoring, intelligent alerting, and advanced visualization. The platform supports two primary ecosystems:

- **Supply Chain Networks** - Suppliers, manufacturers, distributors, warehouses, and retail endpoints
- **Air Traffic Control** - Tower controls, TRACONs, and center facilities

Core capabilities include live status tracking, topology visualization, severity-based alerting, maintenance management, AI recommendations, and performance analytics. For complete technical details, see [WHITEPAPER.md](WHITEPAPER.md).

## Quick Start

### Prerequisites

- Node.js 16+ and npm 8+ (or yarn 1.22+)
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation

Clone the repository, install dependencies, and start the development server:

```bash
git clone https://github.com/rsl37/Systems-Network-Monitor.git
cd Systems-Network-Monitor
npm install
npm start
```

Application opens at `http://localhost:3000`

**Note**: Current implementation is an MVP with core features. See [IMPLEMENTATION.md](IMPLEMENTATION.md) for details on what's implemented and what's still in progress.

### Production Build

```bash
npm run build    # Create optimized build
npm run serve    # Serve locally
```

### System Requirements

**Minimum**: 4GB RAM, 1280x720 display, stable internet  
**Recommended**: 8GB RAM, 1920x1080 display, dedicated GPU, low-latency network

## Documentation

- **[WHITEPAPER.md](WHITEPAPER.md)** - Complete technical architecture, COFM methodology, design philosophy, and use cases
- **[ERD.md](ERD.md)** - Data model schemas and entity relationships
- **[GLOSSARY.md](GLOSSARY.md)** - Canonical definitions for all technical terms
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Current implementation status, what's built, and what's pending
- **[CRITICAL_REVIEW.md](CRITICAL_REVIEW.md)** - Comprehensive code review identifying gaps and issues

## Repository Structure

Source code is organized into React components, data schemas, utilities, and type definitions. See WHITEPAPER.md for the complete component architecture diagram.

## Use Cases

**Supply Chain Management**: End-to-end visibility, shipment tracking, bottleneck identification, distributed maintenance coordination

**Air Traffic Control**: Airspace management, facility monitoring, flight handoff coordination, emergency response, weather impact assessment

For detailed scenarios with operator workflows and response times, see WHITEPAPER.md section 8.

## Contributing

Contributions are welcome. Please follow the existing code style, write tests where applicable, open a pull request with a clear description, and use GitHub Issues to report bugs or request features.

## Licensing

This project is dual-licensed:

1. **[PolyForm Shield License 1.0.0](LICENSE-SHIELD.md)** - Use and modification with restrictions on competing uses
2. **[PolyForm Noncommercial License 1.0.0](LICENSE-NONCOMMERCIAL.md)** - Noncommercial use and modification

For commercial licensing: licensing@yourcompany.com

## Contact

- Issues and discussions: GitHub Issues and Discussions
- Email: support@yourcompany.com
- Documentation: docs.yourcompany.com

## Roadmap

### Version 2.0 (Q2 2025)
Real-time WebSocket integration, multi-user collaboration, advanced analytics, mobile apps, ML predictive maintenance

### Version 3.0 (Q4 2025)
Enterprise SSO, custom plugins, multi-tenant architecture, advanced COFM customization, Kubernetes deployment

For detailed information on institutional technologies (smart contracts, tokenized incentives, soulbound credentials, polycentric governance), see the institutional technologies discussion in WHITEPAPER.md (Future Directions section).

-----

Made with care for systems operators managing complex networks
