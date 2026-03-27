#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Building Frontend ---"
cd frontend
npm install
npm run build
cd ..

echo "--- Installing Backend Dependencies ---"
# Use pip/uv to install requirements
pip install -r requirements.txt

echo "--- Running Migrations ---"
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
echo "--- Build Complete ---"
