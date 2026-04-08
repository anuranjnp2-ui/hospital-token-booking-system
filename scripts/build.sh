#!/usr/bin/env bash
# exit on error
set -o errexit

# Use pip/uv to install requirements
pip install -r backend/requirements.txt

echo "--- Running Migrations ---"
cd backend
python manage.py collectstatic --noinput
python manage.py migrate --noinput
python manage.py shell -c "import seeds; seeds.create_seeds()"
echo "--- Build Complete ---"
