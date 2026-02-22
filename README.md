 # CollabFlow 🚀

CollabFlow is a SaaS workspace collaboration platform built with:

- Django + DRF (Backend)
- PostgreSQL/ sqlite3
- React + TypeScript (Frontend)
- JWT Authentication
- Role-based access (Owner / Member / Viewer)

## Project Structure

backend/ - Django API
frontend/ - React Application

## Setup

### Backend
cd backend
python -m venv venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend
cd frontend
npm install
npm run dev