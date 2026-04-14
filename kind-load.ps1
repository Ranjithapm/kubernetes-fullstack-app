Write-Host "Building Docker images..."
docker build -t weather-backend:latest ./backend
docker build -t weather-frontend:latest ./frontend

Write-Host "Injecting images directly into the Kubernetes Kind cluster node..."
cmd.exe /c "docker save weather-backend:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -"
cmd.exe /c "docker save weather-frontend:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -"

Write-Host "Deleting old pods to force restart with new images..."
kubectl delete pod -l app=weather-backend
kubectl delete pod -l app=weather-frontend

Write-Host "Done!"
