# Smart Forming

## Local Deployment in Docker

_Prerequisites: Docker.app, Docker-Compose are required. Ports 3000, 3001, 3003 should be free._

### 1. Choose which parts to build
Comment or uncomment parts in `docker-compose.yml` to build your desirable website. 

### 2. Build and start the website
```
sudo docker-compose up --build
```

### 3. Stop the app
`crtl` + `C` when you are in the building stage.

### 5. Delete the app
```
sudo docker-compose down
```

### 6. Access to DB
```
sudo docker-compose exec db psql -U pguser -d devdb
```

### 7. Run any command in container:
```
sudo docker-compose exec backend rails db:migrate
```

### 8. Attach to STDIN, STOUD of the container for debug:
```
sudo docker attach smart_forming_backend
```
## Online Deployment in Jenkins

### 1. Choose/update `Jenkins` file
Clone the `DevOps` repo down and can find the `Jenkins` file under jenkinsfile directory. 

### 2. Deploy it on Jenkins by using Blue Ocean
Config and deploy based on the commits and branches. The main branch is Staging.