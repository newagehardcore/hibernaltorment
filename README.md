# HibernalTorment

A haunted Winamp-style music player experience using Webamp, featuring a custom skin and ethereal animations. This project creates an immersive, nostalgic music player with modern web technologies.

## 🎵 Features

- **Custom Winamp Interface**: Beautifully styled with a custom skin
- **Haunted Animations**: Optional ethereal floating animations that give the player a ghostly presence
- **Dynamic Backgrounds**: Each track features its own animated background that smoothly transitions
- **Password Protection**: Simple space-key entry system for dramatic effect
- **Responsive Design**: Automatically centers and scales for different screen sizes
- **Track Management**: Locked playlist to maintain the intended experience
- **Modern Browser Support**: Works in all modern browsers

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HibernalTorment.git
cd HibernalTorment
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

5. Press the spacebar to enter the experience

## 🎮 Usage

- **Enter**: Press spacebar at the password screen
- **Play Music**: Double-click tracks in the playlist
- **Toggle Animation**: Click the `~` symbol in the bottom-right corner
- **Window Management**: Drag windows to reposition them
- **Volume Control**: Use the volume slider or scroll on the volume bar

## 🎨 Project Structure

```
HibernalTorment/
├── src/                    # Source files
│   ├── assets/            # Assets directory
│   │   ├── music/        # Music files
│   │   ├── loops/        # Background animations
│   │   └── GKSkin.wsz    # Custom Winamp skin
├── webamp-player.html     # Main application file
├── server.js             # Express server for local development
└── package.json         # Project dependencies and scripts
```

## 🛠️ Development

### Local Development

1. Start the development server:
```bash
npm run dev
```

2. The server will watch for changes and reload automatically

### Building for Production

1. Prepare for production:
```bash
npm run build
```

2. Deploy the contents to your web server

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔑 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Built with [Webamp](https://github.com/captbaritone/webamp) by Jordan Eldredge
- Custom skin: D-A-S-H-a-m-p by Fred Mitchell 