# Candidate Record Management

## 📌 Project Overview
Candidate Record Management (IIFM Global Verification) is a Vite React-based admin panel designed to manage student records, including candidate details, document uploads, and storage using Firebase.

## 🚀 Features
- 🔐 **Authentication:** Admin login using Firebase Authentication.
- 📄 **Candidate Management:** Add, view, and search candidates.
- 🖼️ **Image Upload & Compression:** Upload ID cards and mark sheets to Firebase Storage, compressed using Compressor.js.
- 📊 **Dashboard:** Admin dashboard for monitoring candidates.
- 🔍 **Search & Filter:** Easily find candidates by name or register number.
- 🌍 **Hosting:** Deployed using Firebase Hosting.

## 📂 Directory Structure
```
/root
├── node_modules/       # Dependencies
├── public/            # Static files
├── src/
│   ├── components/    # Reusable UI components
│   ├── config/        # Firebase configuration
│   ├── features/      # Redux slices
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── App.js         # Main app component
│   ├── main.jsx       # Root file
├── .env               # Environment variables (ignored in Git)
├── package.json       # Dependencies & scripts
├── README.md          # Documentation
```

## 🔧 Installation & Setup

### 1️⃣ Prerequisites
- Install **Node.js** (LTS version)
- Install **Git**
- Install **Firebase CLI** (`npm install -g firebase-tools`)

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/candidate-record-management.git
cd candidate-record-management
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Environment Variables
Create a `.env` file in the root directory with the following:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SECRET_KEY=your_secret_key
VITE_ADMIN_EMAILS=admin@example.com
```
> ⚠️ **Do not commit your `.env` file to GitHub!**

### 5️⃣ Run the Application
```sh
npm run dev
```
- The app will be available at `http://localhost:5173/`

## 🛠️ Routes & Navigation

### **Public Routes**
- `/` → Home Page
- `/login` → Admin Login

### **Protected Admin Routes**
- `/dashboard` → Admin Dashboard
- `/dashboard/manage-candidate` → View & manage candidates
- `/dashboard/add-candidate` → Add new candidate
- `/dashboard/search-candidate` → Search candidates
- `/dashboard/candidate/:candidateId` → Candidate details

### **Redirects**
- Any unknown route redirects to `/`

## 📊 Data Model
Each candidate entry follows this structure:
```json
{
  "id": "AutoID",
  "registerNo": "555900",
  "name": "Vijay",
  "department": "POWER_PLANT",
  "academicYear": "2024-2025",
  "markSheet": "https://storage.firebase.com/...",
  "certficate": "https://storage.firebase.com/...",
  "idCardFront": "https://storage.firebase.com/...",
  "idCardBack": "https://storage.firebase.com/...",
  "createdAt": "8 March 2025 at 09:20:32 UTC+5:30"
}
```

## 📦 Dependencies
- **Frontend:** React (Vite), Redux Toolkit, Material UI
- **Storage & Auth:** Firebase Firestore, Firebase Authentication, Firebase Storage
- **State Management:** Redux Toolkit
- **Other Libraries:**
  - React Hook Form - Form handling
  - React Toastify - Notifications
  - Compressor.js - Image compression

## 🚀 Deployment
To deploy to Firebase Hosting:
```sh
npm run build
firebase deploy
```
Ensure you are logged in to Firebase CLI (`firebase login`).

## 🚀 Future Enhancements
- ✅ Implement role-based authentication
- ✅ Improve UI with Material UI components
- ✅ Add export functionality (CSV/PDF)
- ✅ Advanced search & filters

## 🤝 Contributing
Follow these steps:
1. Fork the repo & clone it.
2. Create a feature branch (`git checkout -b new-feature`).
3. Make your changes & commit (`git commit -m "Added new feature"`).
4. Push changes (`git push origin new-feature`).
5. Create a pull request.

## 📝 License
This project is licensed under the MIT License.

---

🔹 **Developed & Maintained by [Suresh IIFM Web Developer ](https://github.com/suresh475330)** 
