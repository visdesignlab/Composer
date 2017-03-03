# dataExploration

### Installing 

 1. Install [Docker](https://www.docker.com/).
 2. `cd dataExploration`
 3. `yo phovea:clone phovea_server` (consent to `SSH clone`, `Resolve`, `Update Workspace`)
 4. `npm install`
 5. `docker-compose build`

### Launching

Keep Docker running.

1. `docker-compose up -d`
2. `npm run start:client_app`

Now in the browser check adress `http://localhost:8080/`.
