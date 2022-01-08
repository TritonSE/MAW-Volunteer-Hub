# Make-A-Wish San Diego Volunteer Hub
This project is being completed for the San Diego chapter of the Make-a-Wish Foundation. It will be used to coordinate volunteer events, materials, and contact information.

---
## Project Setup

Requires:
- NodeJS
- NPM
  
Recommended:
- MongoDB Compass


First, you need to install the frontend packages. Go into the frontend directory by typing

```cd frontend```

Then, install the packages by typing

```npm install```

Lastly, run the frontend by typing 

```npm start```



Then, you need to install the backend packages. Go into the backend directory by typing

```cd backend```

Then, install the packages by typing

```npm install```

Lastly, start the backend by typing 

```node index.js```


## Development Process

#### Making a new branch
1. Checkout the development branch by typing ```git checkout development```
2. Make sure the development branch is up to date by typing ```git pull```
3. Checkout your new branch by running ```git checkout -b [BRANCH-NAME]```
   1. Note, the branch name should follow the format ```[type]/[GitHub username]/[description]```
        Example: ```feature/kunalb123/i-am-awesometool```
4. Make changes, add files, commit, push, etc.
5. When you are ready to make a PR, make sure your branch is up to date with development. Do this by typing:
   1. ```git fetch```
   2. ```git merge origin/development```
   3. Handle merge conflicts accordingly
6. Now, you are ready to make a PR! Follow the PR Template that is automatically populated.
