# Clipboard Master
Help you to share screenshots on multiple devices through LAN.

## Build & Run

### Install dependencies
Run following commands to install dependencies for both backend and frontend:

```sh
pnpm run install
cd frontend
pnpm run install
```

### Secure Connection
To make sure this app works properly on LAN, it requires SSL certificate.  
To create a self-signed certificate, run `generate-cert.sh`, it will generate private key and certificate files in `cert` folder.

> [!WARN]  
> Self-signed certificate will not be recognized by browsers by default, please choose to still access according what browser you are using. If you are just using it in LAN, the certificate can be considered secure. The author won't be responsible for any security issues caused by using this application.

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

> [!WARN]  
> As development environment are not under https, some functions will only work for your development device. Please see `Production` section to host it on your LAN.

### Production
Run following commands to build and run the application:
```sh
pnpm run build
pnpm run start
```

And open [https://localhost:3000](https://localhost:3000) in your browser (If you haven't done generate certificates, please go to [http://localhost:3000](http://localhost:3000), and this application will only particially works on your LAN).

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
Frontend will connect to `https://localhost:3000/api` under development environment and `/api` for production (i.e. after run command `pnpm run build`), but you can change this behaviour by editing [frontend/.env](./frontend/.env) file.

## Future works
* Add button to paste
* Copy/Paste texts
* Delete an item