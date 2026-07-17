Stage 0:
In this stage I built a simple server to print a hello serve.
 1. First setup the enviornment:
 Initialize node:
 `npm init`
 Install express:
 `npm install express`

2. Write the code (index.js)
    1. Initialize an app and set the port in the main file (index.js)
    2. Set the app to return "Hello World" message when it receives a get request to the root page (/)
    3. Set the app to listen on the specified port and print a message on the terminal "App listening on port" when the app is run.

3. Test
    1. Run `node index.js` on the terminal inside the project folder where the index.js file is
    2. Check if "App is listening on port:3000" prints on the terminal
    3. Visit localhost:3000 

    Test on terminal:
    `curl -i http://localhost:3000`
    use the following inn windows to use curl
    `Remove-Item alias:curl`
    `curl -i http://localhost:3000`
    Check the output for HTTP response code (response = 200 OK)
    ![alt text](uploads/image.png)

4. Push to github
    1. Create a new empty repository on github
    2. In you local projects folder run `git init` to initialize git locally
    3. Point remote git to the github repository `git remote add origin "your repository link"`
    4. Run `git add .` to add all changes to git
    5. Run `git commit -m "Your commit message"`
    6. Run `git push origin main` to push your local git to github.