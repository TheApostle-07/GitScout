# GitScout

## 🚀 Overview
GitScout is an AI-powered recruiting tool that analyzes GitHub contributions, repository metadata, and commit history to evaluate developers and match them against an ideal candidate profile using **vector embeddings** and **cosine similarity**. This system provides recruiters with data-driven insights to make informed hiring decisions.

## 🌍 Live Demo & Deployment
- **Frontend:** [Deployed Link](#) *(Insert deployment URL)*
- **Backend API:** [Deployed API Docs](#) *(Insert API docs URL)*
- **GitHub Repository:** [GitScout on GitHub](#) *(Insert repository link)*

## 📌 Features
### ✅ Recruiters & Companies
- Fetch **GitHub user data** (repos, commits, languages, contributions).
- **Compare candidates** using AI embeddings and cosine similarity.
- **Generate insights** on developer activity & coding expertise.
- **Rank candidates** based on predefined ideal profiles.

### ✅ Developers & Candidates
- **Analyze personal GitHub data** and **improve profiles**.
- **Understand ranking scores** based on contributions.
- **Optimize repository structure** for better job visibility.

## ⚡ Tech Stack
### 📌 **Frontend**
- **React.js** (UI Framework)
- **Axios** (API Requests)
- **Tailwind CSS** (Styling)
- **React Router** (Routing)

### 📌 **Backend**
- **FastAPI** (API Framework)
- **Uvicorn** (ASGI Server)
- **Pydantic** (Data Validation)
- **httpx** (GitHub API Requests)
- **Sentence Transformers** (Embeddings)
- **NumPy & SciPy** (Cosine Similarity)
- **Redis** (Caching)
- **PostgreSQL** (Database)
- **Docker & Docker Compose** (Containerization)

### 📌 **DevOps & Security**
- **GitHub Actions** (CI/CD)
- **Docker & Docker Compose** (Deployment)
- **Fine-Grained GitHub PATs** (Secure API Access)
- **JWT Authentication** (User Security)

## 📂 Folder Structure
```bash
GitScout/
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── candidate.py
│   │   │   └── github.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── decision.py
│   │   │   ├── embedding.py
│   │   │   └── github_fetcher.py
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── caching.py
│   │   │   ├── logger.py
│   ├── requirements.txt
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_routes.py
│   │   ├── test_services.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── CandidateForm.jsx
│   │   │   ├── ResultDashboard.jsx
│   │   ├── index.js
│   │   ├── services/api.js
│   ├── tests/
│   │   ├── App.test.js
└── docker-compose.yml
```

## 🔧 Installation & Setup
### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **Docker & Docker Compose**

### 🚀 Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 🚀 Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 🚀 Docker Setup (Full System)
```bash
docker-compose up --build
```

## 📡 API Endpoints
### 🔹 Candidate Analysis
```http
POST /candidate/ideal-candidate
```
**Request Body**
```json
{
  "languages": ["Python", "JavaScript"],
  "min_commits": 50,
  "min_stars": 100
}
```
**Response**
```json
[
  {"username": "dev123", "similarity": 0.92},
  {"username": "coderXYZ", "similarity": 0.85}
]
```

### 🔹 GitHub Data Fetching
```http
GET /github/user/{username}
GET /github/repos/{username}
```

## 🔍 How It Works
1. **Recruiters enter GitHub usernames or criteria** (languages, commits, stars).
2. **System fetches GitHub data** (repos, commits, activity trends).
3. **AI model converts data into vector embeddings**.
4. **Cosine similarity ranks candidates** against the ideal profile.
5. **Recruiters see ranked results** with detailed insights.

## 🛡️ Security Measures
- **Fine-Grained GitHub API Tokens** (PATs) for secure data access.
- **JWT Authentication** (if user authentication is required).
- **Rate-Limiting & Caching** (Redis to handle GitHub API limits).
- **Secure Deployment** (CI/CD pipelines, Dockerized builds).

## 📈 Future Enhancements
✅ **Better ML Embeddings**: Train on open-source data for smarter analysis.
✅ **Commit Sentiment Analysis**: Detect productive vs. experimental commits.
✅ **Automated Notifications**: Alert recruiters when a perfect candidate appears.
✅ **User Feedback Integration**: Allow recruiters to refine AI ranking models.

## 💡 Contributing
Want to contribute? Follow these steps:
```bash
git clone https://github.com/your-repo/GitScout.git
cd GitScout
# Create a new branch
git checkout -b feature-branch
# Make changes & commit
git commit -m "Your awesome feature"
git push origin feature-branch
```

## 📝 License
This project is licensed under the **MIT License**.

---
### 🎯 **GitScout - The AI-Powered GitHub Recruiter** 🚀
Your one-stop solution for intelligent, data-driven hiring decisions!
