# dataExploration

### Prerequisites 

 1. Install [Docker](https://www.docker.com/).
 2. Install [NPM](https://www.npmjs.com/).

### Installing 

 1. `cd dataExploration`
 2. We need the `develop` branch from `phovea_server`. There are two ways:
   * `yo phovea:clone phovea_server` (consent to `SSH clone`, `Resolve`, `Update Workspace`). 
   Then `git fetch` and `git checkout develop`
   * `git clone -b develop https://github.com/phovea/phovea_server.git`.
 3. `yo phovea:clone phovea_core` (consent to `SSH clone`, `Resolve`, `Update Workspace`). 
 4. `yo phovea:clone phovea_ui` (consent to `SSH clone`, `Resolve`, `Update Workspace`). 
 5. `npm install`
 6. `docker-compose build`

### Launching

Keep Docker running.

1. `docker-compose up -d`
2. `npm run start:client_app`

DataExploration will be running at `http://localhost:8080/`.
