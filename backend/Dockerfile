# ================== BASE ==================
FROM python:3.11-slim

# ================== ENV ==================
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ================== WORKDIR ==================
WORKDIR /app

# ================== SYSTEM DEP ==================
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ================== COPY REQUIREMENTS ==================
COPY requirements.txt .

# ================== INSTALL PYTHON LIB ==================
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# ================== COPY PROJECT ==================
COPY . .

# ================== COLLECT STATIC ==================
RUN python manage.py collectstatic --noinput

# ================== PORT ==================
EXPOSE 8059

# ================== RUN ==================
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8059", "--workers", "3"]