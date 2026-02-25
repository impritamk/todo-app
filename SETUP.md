# Todo App - Setup Guide

## Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Start the Backend Server** (in a terminal)
```bash
node improved_server.js
```
You should see: `✅ Server running on http://localhost:3002`

### 3. **Start the Frontend** (in another terminal)
```bash
npm run dev
```
The app will open at `http://localhost:5173`

---

## File Structure

```
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── index.html            # HTML entry point
├── main.jsx              # React entry point
├── App.jsx               # Main Todo component
├── improved_server.js    # Express backend
└── README.md            # This file
```

---

## What's Improved

### Frontend (App.jsx)
✨ Modern dark theme with blue/purple gradients  
✨ Smooth animations and transitions  
✨ Filter todos by status (All, Active, Completed)  
✨ Task statistics dashboard  
✨ Better icons with lucide-react  
✨ Responsive mobile design  
✨ Empty state messaging  
✨ Loading states  
✨ Accessibility features (aria-labels)  

### Backend (improved_server.js)
✅ Proper HTTP status codes  
✅ Input validation  
✅ Better error handling  
✅ Clean error messages  
✅ Timestamps for todos  

---

## API Endpoints

### GET /todos
Returns all todos

### POST /todos
Create a new todo
```json
{
  "title": "My task"
}
```

### PUT /todos/:id
Toggle todo completion status

### DELETE /todos/:id
Delete a todo

---

## Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Filter by status
- ✅ View statistics
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Modern UI

---

## Troubleshooting

**Port 3002 already in use?**
```bash
# Change port in improved_server.js line 6
const PORT = process.env.PORT || 3003;
```

**Port 5173 already in use?**
```bash
# Change in vite.config.js
port: 5174,
```

**Module not found errors?**
```bash
npm install
```

---

Enjoy your new todo app! 🚀
