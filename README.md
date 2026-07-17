Stage 0: Hello server

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
    use the following in windows to use curl
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


Stage 1: Root and health endpoints

1. Write the code (index.js)
    1. Edit the previous root endpoint(/) to print a json response with name versions, and endpoints.
    2. Add a new endpoint (/health) that returns a json with the status message and timestamp

2. Test
    1. Run `node index.js` on the terminal inside the project folder where the index.js file is
    2. Check if "App is listening on port:3000" prints on the terminal
    3. Visit localhost:3000 
    4. Visit localhost:3000/health

    Test on terminal:

    `curl -i http://localhost:3000`
    Check the output for HTTP response code (response = 200 OK) and a message "{"name":"Task API","version":"1.0","endpoints":["/tasks"]}"

    `curl -i http://localhost:3000/health`
    Check the output for HTTP response code (response = 200 OK) and a message "{"status":"OK","timestamp":"2026-07-17T05:57:21.855Z"}"  
    ![alt text](uploads/image1.png)

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Your commit message"`
    3. Run `git push origin main` to push your local git to github.



Stage 2: Create tasks endpoint with in memory array as database

1. Write the code
    1. Create an arrray (tasks) with three values each having an id, title, description, and completion status
    2. Create a new endpoint (/tasks) that sends a json response of the (tasks) array
    3. Create another endpoint (/tasks/:id) that sends a json response of the specific task id
        1. Convert the URL string into a parameter using parseInt(req.params.id)
        2. Handle error: create an if conditon where if the task id doesnt exist (!task), a json response is sent with a message "Task not found"
        3. Send a json response with the task if the id exists

2. Test
    1. Run `node index.js` on the terminal inside the project folder where the index.js file is
    2. Check if "App is listening on port:3000" prints on the terminal
    3. Visit localhost:3000/tasks 
    4. Visit localhost:3000/tasks/1
    5. Visit localhost:3000/tasks/100

    Test on terminal:

    `curl -i http://localhost:3000/tasks`
    Check the output for HTTP response code (response = 200 OK) and a message "[{"id":1,"title":"Task 1","description":"Create a hello world server","completed":true},{"id":2,"title":"Task 2","description":"Create root and health endpoints ","completed":true},{"id":3,"title":"Task 3","description":"Implement task CRUD operations","completed":false}]"

    `curl -i http://localhost:3000/tasks/1`
    Check the output for HTTP response code (response = 200 OK) and a message "{"id":1,"title":"Task 1","description":"Create a hello world server","completed":true}"  

    `curl -i http://localhost:3000/tasks/100`
    Check the output for HTTP response code (response = 404 Not Found) and a message "{"error":"Task not found"}"
    ![alt text](uploads/image3.png)

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Your commit message"`
    3. Run `git push origin main` to push your local git to github.

