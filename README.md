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



Stage 3: Create a new task


1. Write the code
    1. Add the express.json() middleware so that express can handle the payload inside POST requests.
    2. Create a new varible nextTaskID with a value of 4
    3. Create a new POST endpoinnt (/tasks) 
        1. Validation: Check if the title is missing (!title), not a string (!==string), and empty (title.trim() == '') 
        2. Handle error: create an if conditon where if the title doesnt fulfil the validation rules, a json response is sent with a message "Title is required and must be a non-empty string"
        3. Create a newTask object that assigns a new id (nextTaskId), title, description, and a completion status of "false" by default
        4. Add the new tasks to the tasks array with tasks.push(newTask)
        5. Return the newly created task in JSON format with a 201 status code

2. Test
    1. Run `node index.js` on the terminal inside the project folder where the index.js file is
    2. Check if "App is listening on port:3000" prints on the terminal

    curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\`"title\`":\`"Task4\`"}" 
    Check the output for HTTP response code (response = 201 Created) and a message "{"id":4,"title":"Task4","description":"","completed":false}"

    `curl -i http://localhost:3000/tasks/4`
    Check the output for HTTP response code (response = 200 OK) and a message "{"id":4,"title":"Task4","description":"","completed":false}"  

    curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\`"title\`":\`"\`"}"   
    Check the output for HTTP response code (response = 400 Bad Request) and a message "{"error":"Title is required and must be a non-empty string"}"

    ![alt text](uploads/image4.png)

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Your commit message"`
    3. Run `git push origin main` to push your local git to github.



Stage 4: Update and delete tasks

1. Write the code
    1. Create a new PUT endpoint (/tasks/:id) to replace or modify an existing task's title and/or completion status
        1. Convert the URL string into an integer parameter using parseInt(req.params.id)
        2. Find the task index inside the array using tasks.findIndex()
        3. Handle error: create an if condition where if the task index doesn't exist (==-1), a json response is sent with a 404 status code and a message "Task not found"
        4. Validation: Check if the request body is empty or missing both updateable properties, and return a 400 status code with a message "Empty or invalid body"
        5. Validation: If a title is provided, ensure it is a non-empty string, otherwise return a 400 status code with an error message
        6. Validation: Normalize incoming done status (accepts either done or completed) and ensure it is a boolean, otherwise return a 400 status code with an error message
        7. Apply the changes directly to the target item inside your array and return the updated task object with a 200 OK status code
    2. Create a new DELETE endpoint (/tasks/:id) to remove a task completely from the array
        1. Convert the URL string into an integer parameter using parseInt(req.params.id)
        2. Find the task index inside the array using tasks.findIndex()
        3. Handle error: create an if condition where if the task index doesn't exist (==-1), a json response is sent with a 404 status code and a message "Task not found"
        4. Remove the task item from the array using the tasks.splice() method
        5. Send back a 204 status code ("No Content") with a completely empty body using res.status(204).send()

2. Test
    1. Run `node index.js` on the terminal inside the project folder where the index.js file is
    2. Check if "App is listening on port:3000" prints on the terminal

    curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\`"title\`":\`"UpdatedTask1\`",\`"done\`":false}"
    Check the output for HTTP response code (response = 200 OK) and a message "{"id":1,"title":"UpdatedTask1","description":"Create a hello world server","completed":false}"

    curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{}"
    Check the output for HTTP response code (response = 400 Bad Request) and a message "{"error":"Empty or invalid body"}"

    curl -i -X PUT http://localhost:3000/tasks/999 -H "Content-Type: application/json" -d "{\`"title\`":\`"Ghost\`",\`"done\`":true}"
    Check the output for HTTP response code (response = 404 Not Found) and a message "{"error":"Task not found"}"

    `curl -i -X DELETE http://localhost:3000/tasks/1`
    Check the output for HTTP response code (response = 204 No Content) and confirm that the response payload body is completely empty

    `curl -i http://localhost:3000/tasks`
    Check the output for HTTP response code (response = 200 OK) and confirm that Task 1 has been completely removed from the printed list
    ![alt text](uploads/image5.png)

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Stage 4: full CRUD"`
    3. Run `git push origin main` to push your local git to github.



Stage 5: Swagger UI

1. Write the code
    1. Install swagger-ui-express by running `npm install swagger-ui-express` in your terminal
    2. Create a new file named `openapi.json` in your root project folder to describe all CRUD endpoints
    3. Update `index.js` to require `swagger-ui-express` and `openapi.json`
    4. Mount the Swagger UI route at `/docs` using `app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))`

2. Test
    1. Run `node index.js` on the terminal inside the project folder where the index.js file is
    2. Check if "App listening on port 3000" and "Swagger UI documentation available at http://localhost:3000/docs" prints on the terminal
    3. Visit `localhost:3000/docs` in your browser to view the interactive documentation
    4. Test all CRUD endpoints using the "Try it out" button on the web page

    ![alt text](uploads/image6.png)

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Stage 5: Swagger UI"`
    3. Run `git push origin main` to push your local git to github.




Stage 6: Publish and docs

1. Write the code
    1. Create a `.gitignore` file in your root folder and add `node_modules/` so unnecessary files are ignored by git
    2. Review and format your complete `README.md` file to ensure all setup instructions, endpoint details, and terminal checks from Stage 0 to Stage 6 are cleanly documented

2. Test
    1. Run `git status` on the terminal inside the project folder to make sure your working directory is clean
    2. Run `git log --oneline` on the terminal to verify all stage commits are present and ordered properly
    3. Visit your repository page on GitHub in your browser to verify that all code, images, and README details are rendered correctly

    Test on terminal:

    `git status`
    Check the output for a message "nothing to commit, working tree clean"

    `git log --oneline`
    Check the output to confirm you have at least 7 clean stage commits:
    - Stage 6: publish and docs
    - Stage 5: Swagger UI
    - Stage 4: full CRUD
    - Stage 3: create with validation
    - Stage 2: read endpoints with 404
    - Stage 1: root and health endpoints
    - Stage 0: hello server

    `git remote -v`
    Check the output to verify your remote origin points to your public GitHub repository link

3. Push to github
    1. Run `git add .` to add all final documentation changes to git
    2. Run `git commit -m "Stage 6: publish and docs"`
    3. Run `git push origin main` to push your final code to github.









SQLite Database

Stage 0: Create SQLite database

1. Write the code
    1. Install `better-sqlite3` by running `npm install better-sqlite3` in your terminal
    2. Import `better-sqlite3` in `index.js` and connect to a local database file named `tasks.db`
    3. Execute a SQL query `CREATE TABLE IF NOT EXISTS tasks` with columns `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `title` (TEXT), and `done` (BOOLEAN)
    4. Execute a SQL check `SELECT COUNT(*)` to ensure example tasks are inserted only if the database table is completely empty

2. Test
    1. Run `node index.js` on the terminal inside the project folder
    2. Check if "SQLite database connected (tasks.db)" prints on the terminal
    3. Verify that a file named `tasks.db` is automatically created in your root project folder
    4. Restart your server multiple times using `node index.js` and confirm the seed tasks are not duplicated

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Stage 0: create SQLite database"`
    3. Run `git push origin main` to push your local git to github.




Stage 1: Database read endpoints

1. Write the code
    1. Update `GET /tasks` endpoint to retrieve all records from SQLite using `SELECT id, title, done FROM tasks`
    2. Update `GET /tasks/:id` endpoint to retrieve a single record using `SELECT id, title, done FROM tasks WHERE id = ?`
    3. Handle error: Return a 404 status code with error JSON `{"error":"Task not found"}` if no row matches the given ID

2. Test
    1. Run `node index.js` on the terminal inside the project folder
    2. Check if "App listening on port 3000" prints on the terminal

    Test on terminal:

    `curl -i http://localhost:3000/tasks`
    Check the output for HTTP response code (response = 200 OK) and a message containing tasks from `tasks.db`

    `curl -i http://localhost:3000/tasks/1`
    Check the output for HTTP response code (response = 200 OK) and the single task object

    `curl -i http://localhost:3000/tasks/999`
    Check the output for HTTP response code (response = 404 Not Found) and message `{"error":"Task not found"}`

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Stage 1: database read endpoints"`
    3. Run `git push origin main` to push your local git to github.
   



Stage 2: Insert into database

1. Write the code
    1. Update `POST /tasks` endpoint to insert a new row using `INSERT INTO tasks (title, done) VALUES (?, ?)`
    2. Maintain validation checks: return 400 Bad Request if `title` is missing or empty
    3. Retrieve the generated auto-increment ID using `result.lastInsertRowid` and return the newly created task with a 201 Created status code

2. Test
    1. Run `node index.js` on the terminal inside the project folder

    Test on terminal:

    `curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\`"title\`":\`"Buy milk\`"}"`
    Check the output for HTTP response code (response = 201 Created) and the newly created task with auto-generated database ID

    Restart your server (`Ctrl + C` then `node index.js`) and run:
    `curl -i http://localhost:3000/tasks`
    Verify that "Buy milk" still exists in the database list after server restart

3. Push to github
    1. Run `git add .` to add all changes to git
    2. Run `git commit -m "Stage 2: insert into database"`
    3. Run `git push origin main` to push your local git to github.

