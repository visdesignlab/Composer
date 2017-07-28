# dataExploration

### Installing 

 1. Install [Docker](https://www.docker.com/).
 2. `cd dataExploration`
 3. We need the `develop` branch from `phovea_server`. There are two ways:
   * `yo phovea:clone phovea_server` (consent to `SSH clone`, `Resolve`, `Update Workspace`). 
   Then `git fetch` and `git checkout develop`
   * `git clone -b develop https://github.com/phovea/phovea_server.git`.
 4. `yo phovea:clone phovea_core` (consent to `SSH clone`, `Resolve`, `Update Workspace`). 
 5. `yo phovea:clone phovea_ui` (consent to `SSH clone`, `Resolve`, `Update Workspace`). 
 6. `npm install`
 7. `docker-compose build`

### Launching

Keep Docker running.

1. `docker-compose up -d`
2. `npm run start:client_app`

Now in the browser check adress `http://localhost:8080/`.
