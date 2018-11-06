# Decorasaurus


## Todos
- Fusion Remix
    - Seems a bit delayed with populating the poster preview. Maybe try a subscription
    - Seems like it prefers making a square, but you can stretch it back to its desired orientation and it seems like it doesn't stretch too bad
    - Keeping it 600px for now, but takes a while. Consider making it work server side for mobile devices? Try smaller and see if it still looks okay
    - Need to work on getting the dimensions right depending on what orientation we are using
    - Add to cart was jacked up
- On add to cart work
    - Custom product thoughts https://forum.moltin.com/t/raise-the-maximum-limit-of-child-products-number/618/5
    - To send back the poster probably need to package it up as a png so we can include custom background and all and send back as a blob. Can use domtoimage to create a blob then send on back. - check
        - Need to make sure the size is okay. Maybe need to blow up size of svg in a hidden way then run the domtoimg. Should scale okay - check
    - Create thumbnails
        - Moltin uses 220 x 330 jpg (depends orientation)
        - Should hopefully be able to create file and overwrite main_image
    - Create pdf of print, upload to s3, and add to custom field / flow on product
- Finish order flow
    - Payment id didn't work
    - Need to grab customer email at some point to refer to them on stripe
    - Adding a card on checkout does not save it to the Stripe account
    - Tweak validation for submission
    - Mobile tweaking for payment on checkout
    - Take to order page after successfull submission and reset cart
    - Add / See addresses
    - Display orders on account page
    - Account page similar to S&C with addresses / customer info / etc
- Moltin Wiring
    - Need add / save / fetch addresses for signed in users
    - Stripe integration - check
    - Paypal Integration
        - https://forum.moltin.com/t/can-we-get-demo-app-on-nextjs-with-moltin-if-yes-then-how-can-you-please-help-me/809/7
    - Can grab a user token for accessing addresses and what not and it correctly locks you out from other user's info
- Ionic -> Material transformation - 1 day 1/1
    - Integrate material components for buttons and inputs and use going forward
    - Fix modals / tooltips / popovers
- Splash page -1 day
- Wire in Moltin API and see what's left for needs with our own db - 2 day
- Cart Reference Id:
    - When user logging in (or starts adding first product to cart) I generate a uuid on client side and I store it in a cookie
    - I create a cart with this uuid (via the carts/{uuid}) endpoint or with the Moltin.Cart({uuid}) JS method
    - I use this cart until the user is logged in and I delete the cart on logout with the Moltin.Cart({uuid}).Delete() (or I keep it, depends…)
- Poster generator for maps + custom trace pics. - 6 days - spent 3/6
    - Recommended min size requirements from walgreens
        - 12x18 : 2682x1788
        - 20x30 : 4470x2980
        - 11x14 : 1008x792
    - Patent:
        - Create modal to enlarge images / select
            - Bug with closing modal programmatically https://github.com/ionic-team/ionic/issues/15349
        - Decide what if anything on customize page
        - Make mobile friendly
            - Touch issues with ionic 4 https://github.com/ionic-team/ionic/issues/14883
        - Try adding to cart
        - Trigger auto retrace when change trace color
    - Map
    - Remix
        - Bug when uploading an image with two iterations of file input on the dom. Doesn't fire change event
        - Trigger auto retrace when change trace color
        - Style up the crop buttons
        - Look at tensorflor styling https://reiinakano.github.io/fast-style-transfer-deeplearnjs/
- Patents after launch - 2 days
- Find a poster producer... - ???
- Cart + checkout page - 2 days
  - Moltin has some companies that use them listed. Check their UI
  - Can't figure out fucking confirm pw - https://angular-templates.io/tutorials/about/angular-forms-and-validations
- FAQ page - .5 day
- About page - .5 day
- Digital ocean setup - 3 days
  - Nginx
  - Connect with cloudlare
  - Load balancing
    - Decide how many servers needed and how powerful
  - Custom email
  - domain name
- Site branding / design - 3 days
- Tracking - 1 day
- SEO / Marketing shit
- Business stuff - 3 days
  - LLC
  - w/e
- Setup language selection .5 day

### Name Ideas
- ornat.us (purchased -- because cheap. Ornatus in Latin means furnish / adorn. Bit tough to remember. No SEO competition. No trademarks)

- decorasaurus.com (purchased -- an actual .com with fun logo potential with no SEO competition and easy to remember and no trademarks)
    - Also decorasaur.us & decorasaur.com

craftstud.io (too masculine ?)
decora.pe (unique-ish "decora" would be the name of the site with a cute ape mascot. A little close to deco-rape? Potential trademark issue. Expensive domain $50)
craftwalr.us (meh)
craftrat.io

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Updating Production

- Web app uses a service worked so we need to break the cache when we update. Change the cache version in service-worker.js to do this and prompt users to do the same.
- Run `$ ionic build --prod` to run an AoT build
- Use SFTP (cyber duck) to replace the www folder in /var/www/packonmyback.com/html on the server

#### Analytics

- Wire in Google analytics for page views
- Wire in analytics for events

## Feature Ideas

- Maps of cities
  - Other map visualizations (wind maps, currents, warming) (would need d3 or something)
- Patents. User can enter in patent number and server will hit API, snag PDF images, maybe ask which the user wants, vectorize, add colors and maybe add blueprint background as option. Potentially add patent search too, but API is tricky. Could recommend Google (which doesn't have API)
- User uploaded photos turned into vectors
  - Use pexels to provide a search API for users. Should be catching results as only 200 requests per hour. Probably have popular categories like 'national parks' or 'travel' as easy to navigate to options.
  - Potentially pixel-ified photos
- Cross sell vector images when user is doing a map and vice versa
- Option to have three posters of same photo (side by side)
- Grid a la instagram for single poster
- Day of birth posters
- Star maps for dates (lame but whatever)
- Word clouds (maybe for some bullshit like vows or fav poems or whatever)
- Nasa has a nice, free API for images. Maybe look into landsat type imagery as well.
- Rijk museum API has nice, royalty free imagery
- Vectors of flowers randomly arranged. Would have a list and user can add them to the palette and give them a variety of color. Or in a bouquet
- Abstract designs
  - Powered by AI
- Colorful (expensive?) backgrounds with opaque layer and then transparent vectors over it. Like say a tie dye layer and then a black layer with a vector cut out so you have like a tie dye dog on black. https://pin.it/3ogqja2wugkcpr
- Would be nice to have frame purchase option to upsell. Dunno how it would work.
- Create an app for phone wallpapers that allows users same functionality and then advertise the poster purchase options

## Digital Ocean

### Server Setup

- Linux terminal basics series https://www.digitalocean.com/community/tutorials/an-introduction-to-the-linux-terminal
- Create droplet
- Setup SSH https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-digitalocean-droplets
- Inital server setup (user + firewall) https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04
    - Common firewall rules / commands https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands
- Setup hostname https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean
    - Create 'A' records
    - Point nameservers from registrar to DO https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars#registrar-namecheap
- Install nginx https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
- Create server blocks for multiple domains https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04
- Secure nginx with SSL https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04#step-4-%E2%80%94-obtaining-an-ssl-certificate
    - Issue as of writing https://github.com/certbot/certbot/issues/5405#issuecomment-356498627
    - Webroot aka path is how its set up in nginx. Example would be /var/www/bclynch.com/html
- Get node app rolling https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
    - Install node
    - Setup pm2
    - Setup reverse proxy for nginx
- Setup SFTP https://www.digitalocean.com/community/tutorials/how-to-use-sftp-to-securely-transfer-files-with-a-remote-server
- Setup mail https://www.digitalocean.com/community/tutorials/how-to-set-up-zoho-mail-with-a-custom-domain-managed-by-digitalocean-dns


### Logging Into Server

- SSH into server
    - `$ ssh <user>@<ip_address>`
    - `$ ssh bclynch@138.68.63.87`
- Switch user
    - `$ su - bclynch`
- Go to root
    - `$ exit`

#### Add New Key To Existing Server

- Suppose you have a new computer you want to log in with and need to setup ssh. Our server does not allow for password login so we need a workaround
- Login to digital ocean and head to the access console. Login to root
- `$ sudo nano /etc/ssh/sshd_config`
    - Change the line PasswordAuthentication from no to yes
- Save and exit the file and run `$ sudo systemctl reload sshd.service` and `sudo systemctl reload ssh` for config to take effect
- We can now login to root from our own terminal via password (where copy / paste actually works)
- `$ cd ~/.ssh`
- `$ nano authorized_keys`
- Copy the pub key from the local computer and paste in here
    - `$ cat ~/.ssh/id_rsa.pub` will display the pub key so we can copy
- Now we should be able to access root via ssh. Go ahead and revert the PasswordAuthentication from yes to no
- Save and exit the file and run `$ sudo systemctl reload sshd.service` and `sudo systemctl reload ssh` for config to take effect
- Do the same for any users you have to login as well so we can directly login through them

### Putting code on server

- First we want to build our code to minify and all. With Ionic we can do this with the following command
    - `$ npm run ionic:build --prod`

### Updating Servers

- Server should be updated frequently with the following:
    - `$ apt-get update && apt-get upgrade`

### nginx

- To stop your web server, you can type:
`$ sudo systemctl stop nginx`

- To start the web server when it is stopped, type:
`$ sudo systemctl start nginx`

- To stop and then start the service again, type:
`$ sudo systemctl restart nginx`

- If you are simply making configuration changes, Nginx can often reload without dropping connections. To do this, this command can be used:
`$ sudo systemctl reload nginx`

- By default, Nginx is configured to start automatically when the server boots. If this is not what you want, you can disable this behavior by typing:
`$ sudo systemctl disable nginx`

- To re-enable the service to start up at boot, you can type:
`$ sudo systemctl enable nginx`

### SFTP 

- Login: `$ sftp username@remote_hostname_or_IP`
- Current directory: `$ pwd`
- Get files: `$ get remoteFile`
- Get directory and all its contents: `$ get -r someDirectory`
- Transfer to remote: `$ put localFile`
- Transfer entire directory: `$ put -r localDirectory`
- End session: `$ bye`

Also cyberduck makes this easier.....

### Bash

#### Handy Commands

- Open file in editor
    - `$ sudo nano <path>`
    - ^x to quit then y to save
- Remove folder and all contents
    - `$ rm -rf <name>`
- Create folder
    - `$ mkdir <name>`
- Create file
    - `$ touch <name>`

### PM2

- PM2 provides an easy way to manage and daemonize applications (run them in the background as a service).
- Applications that are running under PM2 will be restarted automatically if the application crashes or is killed, but an additional step needs to be taken to get the application to launch on system startup (boot or reboot).

#### Start App

- `$ pm2 start <file>`

- The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots:

- `$ pm2 startup systemd`

- Run the command that was generated to set PM2 up to start on boot

- This will create a systemd unit which runs pm2 for your user on boot. This pm2 instance, in turn, runs hello.js. You can check the status of the systemd unit with systemctl:

- `$ systemctl status pm2-bclynch`

#### Sub Commands

PM2 provides many subcommands that allow you to manage or look up information about your applications. Note that running pm2 without any arguments will display a help page, including example usage, that covers PM2 usage in more detail than this section of the tutorial.

- Stop an application with this command (specify the PM2 App name or id):

`$ pm2 stop app_name_or_id`

- Restart an application with this command (specify the PM2 App name or id):

`$ pm2 restart app_name_or_id`

- The list of applications currently managed by PM2 can also be looked up with the list subcommand:

`$ pm2 list`

- More information about a specific application can be found by using the info subcommand (specify the PM2 App name or id):

`$ pm2 info example`

- The PM2 process monitor can be pulled up with the monit subcommand. This displays the application status, CPU, and memory usage:

`$ pm2 monit`

- Now that your Node.js application is running, and managed by PM2, let's set up the reverse proxy.

## AWS

*AWS allows multiple schemas whereas Heorku does not!*
### Basic Setup
- Install AWS CLI `$ brew install awscli`
- Launch a new RDS instance from AWS console
- Run `$ aws rds describe-db-instances` to check on your db's info
- Change the parameter group of your instance to force ssl. (set to one)
### Connect to Postgres GUI
- http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html
    - In the SSL tab check 'Use SSL' and require it.
- Can right click on a db and select 'Execute SQL File'. Load up the schema then load up any data.
### Connect to psql
- psql --host=<instance_endpoint> --port=<port_number> --username <username> --password --dbname=<dbname>
- psql --host=laze.c0up3bfsdxiy.us-east-1.rds.amazonaws.com --port=5432 --username bclynch --password --dbname=laze
- Make sure you identify the schema with your query statements + semicolons to get it to work properly.
- Need to change the security group setting to allow inbound traffic from anywhere to avoid 503
### Connect with front end
- Add following lines
``` js
var postgraphql = require('postgraphql').postgraphql;
var app = express();
app.use(postgraphql('postgresql://<username>:<password>@<endpoint>:<port#>/<db_name>?sslmode=require&ssl=1', '<schema_name>', {graphiql: true}));
```
