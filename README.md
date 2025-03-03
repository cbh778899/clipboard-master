# Clipboard Master
Help you to share screenshots on multiple devices through LAN.

## Build & Run

### install dependencies
Run following commands to install dependencies for both backend and frontend:

```sh
pnpm run install
cd frontend
pnpm run install
```

### Development
Open 2 terminals and run following commands seprately:
```sh
# For Backend
pnpm run dev
```

```sh
# For Frontend
cd frontend
pnpm run dev
```

And follow the frontend side instruction to open the url in your browser ([http://localhost:5173](http://localhost:5173) by default.)

### Production
Run following commands to install dependencies, build and run app:
```sh
pnpm run build
pnpm run start
```

And open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]  
> If you've changed PORT and/or HOST in `.env` file, please go to corresponding URL instead.

## Usage

Make sure your app is running, open corresponding URL in your browser and Simply paste (`CTRL + V` on Windows/Linux or `COMMAND + V` on MacOS) your screenshot inside browser page to see the shared screenshots. All devices connected to the URL can those screenshots. 

Simply click on the image you want to copy it.

Max 30 latest images are listed on page by default, but you can change this behaviour by changing `LIST_LIMIT` in [.env](./.env) file.

> More ways of pasting are coming.

## Data storage
All data stores in `files.db` and all images stores in `uploads/` by default, but you can change this behaviour by editing [.env](./.env) file.

## Routes
Frontend will connect to `http://localhost:3000/api` under development environment and `/api` for production (i.e. after run command `pnpm run build`), but you can change this behaviour by editing [frontend/.env](./frontend/.env) file.

## Future works
* Add button to paste
* Copy/Paste texts
* Delete an item