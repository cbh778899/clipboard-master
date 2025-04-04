# Clipboard Master
Help you to share screenshots on multiple devices through LAN.

## Build & Run

### Install dependencies
Run following commands to install dependencies for both backend and frontend:

```sh
pnpm run install
```

### Secure Connection
To make sure this app works properly on LAN, it requires SSL certificate.  
To create a self-signed certificate, run
```sh
pnpm run cert
```
This will create a directory called `cert` and have certification generated inside.
> [!NOTE]  
> Please make sure you have openssl installed.  
> If you are using Windows and have `git` installed, you should can find it in `<your-git-install-path>\mingw64\bin`.  
> Add this path to your `PATH` environment variable to make sure the command works normally.

> [!WARNING]  
> Self-signed certificate will not be recognized by browsers by default, please choose to still access according what browser you are using. If you are just using it in LAN, the certificate can be considered secure. The author won't be responsible for any security issues caused by using this application.

### Development
```sh
pnpm run dev
```

And follow the frontend side instruction to open the url in your browser ([http://localhost:5173](http://localhost:5173) by default.)

> [!WARNING]  
> As development environment are not under https, some functions will only work for your development device.  
> Please see `Production` section to host it on your LAN.

> [!NOTE]  
> When running `dev` command, browsers might refuse to establish secure connection because of the self-signed certificate.  
> To allow connection, you might want to `build` and `start` and access the backend route (default [https://localhost:3000](https://localhost:3000)),  
> This will prompt you to choose still access it or not. Allow it and start `dev` again and you are all set.  

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

### Basic
There are mainly ways to upload an item:
1. Use keyboard shortcut for pasting: `CTRL+V` on Windows machines or `CMD+V` on MacOS machines. This will upload the images and texts in your clipboard.
2. Drag and drop your image / file to the multi-function button in the front of the page to upload.
3. Click the multi-function button and follow your browser's instruction for pasting, this will also read the images and texts from your clipboard.
  
To copy an item, simply click the one you want, the item will automatically paste into your clipboard.  
To delete an item, drag it on the page and drop it in the multi-function button, the deletion can be seen on every device.

### Updates
* Directly paste can now upload text & image.
* Drag and drop can now upload images and files.
* Click on the multi-function button now support upload text & image.
* If you uploaded a file, click it will start download instead of copy.
* Click on a GIF will download it instead of copy.

## Data storage
All data will be stored at `uploads/` folder in root, but you can change it by editing `FILE_SAVE_PATH` in [/backend/.env](/backend/.env)

## Connection Retry
Some devices might disconnect when browser switched to backend, therefore retry connection is required. The max retries by default is 3 times and interval is at 100ms, which is enough to determin whether it's the problem of client itself or server (e.g. the server closed). If you want to change this behaviour, change the `VITE_MAX_WEBSOCKET_RETRY` and/or `VITE_WEBSOCKET_RETRY_INTERVAL` entries in [/frontend/.env](/frontend/.env). Deleteing `VITE_MAX_WEBSOCKET_RETRY` will allow infinite retry.

## Routes
Frontend will connect to `https://localhost:3000/api` under development environment and `/api` for production (i.e. after run command `pnpm run build`), but you can change this behaviour by editing `VITE_DEV_BASE_ROUTE` and `VITE_PROD_BASE_ROUTE` entries in [/frontend/.env](/frontend/.env) file.