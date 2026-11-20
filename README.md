# E-commerce application

A React frontend, Django REST API, and PostgreSQL database, deployed locally to Kubernetes with Minikube.

## Requirements

- Docker Desktop running with the Linux container engine
- Minikube
- kubectl
- Node.js and npm (only needed for frontend development outside Kubernetes)

## Run using docker

```powershell
docker compose up
```

## Run in Minikube

Run these commands from the repository root in PowerShell.

### 1. Start Minikube

```powershell
minikube start
```

### 2. Create local Kubernetes Secrets

The manifests expect these Secrets in the `default` namespace. Create them locally;

```powershell
$dbPassword = Read-Host "PostgreSQL password"
$djangoSecret = Read-Host "Django SECRET_KEY"

kubectl create secret generic db-password `
  --from-literal=password=$dbPassword `
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic django `
  --from-literal=secret=$djangoSecret `
  --dry-run=client -o yaml | kubectl apply -f -

Remove-Variable dbPassword, djangoSecret
```

### 3. Build the application images into Minikube

The image tags must match the tags in `deploy/frontend.yaml` and `deploy/django.yaml` (`v3` in this repository).

```powershell
minikube image build -t django-app:v3 ./ecom
minikube image build -t react-app:v3 ./frontend
```

### 4. Deploy the Kubernetes resources

```powershell
kubectl kustomize deploy
kubectl apply -k deploy
kubectl get pods
```

Wait until the PostgreSQL, Django, and React pods show `Running` and their `READY` column shows `1/1`.

### 5. Apply Django database migrations

Run this after PostgreSQL and Django are running. Repeat it after adding new Django migrations.

```powershell
kubectl exec deployment/django -- python manage.py migrate
```

### 6. Open the app locally

Open two additional PowerShell windows from the repository root and leave both commands running:

```powershell
kubectl port-forward service/react 5173:5173
```

```powershell
kubectl port-forward service/django 8000:8000
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The frontend's `VITE_API_URL` in `frontend/.env` should point to `http://localhost:8000` for this port-forward setup.

## Update the application

When changing frontend or backend code, use a new image tag so Kubernetes can unambiguously use the rebuilt image. For example, change the image tags in `deploy/frontend.yaml` and `deploy/django.yaml` from `v3` to `v4`, then run:

```powershell
minikube image build -t django-app:v4 ./ecom
minikube image build -t react-app:v4 ./frontend
kubectl apply -k deploy
kubectl rollout status deployment/django
kubectl rollout status deployment/react
```

If a code change adds database migrations, apply them after the deployment:

```powershell
kubectl exec deployment/django -- python manage.py migrate
```

Hard-refresh the browser with **Ctrl+F5** after updating the frontend.

## Useful troubleshooting commands

```powershell
kubectl get pods
kubectl get services
kubectl get ingress
kubectl logs deployment/django --tail=100
kubectl logs deployment/react --tail=100
kubectl describe pod <pod-name>
```

## Data and local development notes

- PostgreSQL data is stored in the `django-postgres-pvc` PersistentVolumeClaim.
- Uploaded product images are stored in the `django-app-pvc` PersistentVolumeClaim, mounted at Django's `/app/media` directory.
- Keep the port-forward terminals open while using the local browser URL.
- Kubernetes Secret values are stored in your local cluster and are not managed by the manifests. Every person deploying a fresh cluster must create their own Secrets using the commands above.
- Kubernetes Secrets are base64-encoded in the cluster by default, not encrypted just because they are Secrets. Use a secret manager or encryption at rest for shared or public deployments.
- For local frontend development outside Kubernetes, start the API and frontend separately. The repository's `docker-compose.yml` is also available for development, but the Minikube steps above are the Kubernetes run path.
