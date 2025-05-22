# 🛠️ Task for Trae – Splash Screen Component Setup

This task defines the implementation steps for rendering the animated splash screen shown in the React component `SplashScreen.jsx`. The goal is to build a loading screen that visually represents "Guru Gyan rAi" using animated CSS without external images or dependencies.

---

## ✅ Component Goal

> Display a glowing "R" that pulses and disappears between frames. The letters "R" and "Ai" together form the name **RAi**, and appear as one animated identity. Below that, show the label `Powered`, and under it, the branding text `Guru Gyan`.

---

## 📁 Folder & File Structure

```
/components
├── SplashScreen.jsx ✅ (Already provided)
├── SplashScreen.css   ⛔ Needs to be created
```

---

## 🧠 Logic to Implement

### SplashScreen.jsx

Already provided:

```jsx
import React from "react";
import "./SplashScreen.css"; // Ensure this file exists

export default function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="glow-wrapper">
        <h1 className="glow-letter">R</h1>
        <h1 className="glow-ai">Ai</h1>
      </div>
      <p className="powered">Powered</p>
      <h2 className="guru-gyan">Guru Gyan</h2>
    </div>
  );
}
```

### SplashScreen.css

Create this file alongside `SplashScreen.jsx` with the following features:

* `R` letter glows with animation (invisible when not glowing)
* `Ai` text aligned tightly to the glowing R
* Background has animated circuit-style effects using gradients & keyframes (no GIF/JPG)
* Text aligned center with neon-blue style theme

Use this animation structure:

* `@keyframes pulse-glow` for glowing effect of R
* `@keyframes glow-lines` for dynamic background flow from all corners to center

---

## 🎨 Preview Target

Once CSS is in place:

1. Import SplashScreen into `App.jsx`
2. Run the project and confirm the splash screen displays
3. `R` should appear glowing for a moment, vanish, repeat (gives ghost-AI effect)
4. Ai should stay visible
5. Background animates continuously

---

## 🔧 Troubleshooting Tips

* If the error `SplashScreen.css not found` appears, ensure file name is exactly correct
* Both files must be in the same folder for the import to resolve
* CSS should not import any external image assets

---

🧠 This splash screen gives the app a sci-fi + intelligent AI experience — visually setting the tone before data loads.
