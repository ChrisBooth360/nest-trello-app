# Nest Trello Application
This is the README for the Nest.js-based Trello application. This application allows you to interact with Trello boards and manage tasks within them. It provides API endpoints to fetch tasks from a Trello board, save them to a local database, and retrieve saved tasks. Additionally, there is an HTML interface provided to view and refresh the saved tasks.

## Prerequisites
Before you begin, ensure you have the following installed:

* Node.js and yarn (or npm)
* SQLite (for local development)
* Trello API credentials (API Key and API Token)
* Git (optional)

## Installation
1. Clone the repository (or download the code):

`git clone <repository-url>`

2. Navigate to the project directory:

`cd nest-trello-app`

3. Install dependencies using yarn (this application uses yarn):

`yarn install`

## Configuration
1. Create a `.env` file in the root of your project and add your Trello API credentials:

`TRELLO_API_KEY="your-trello-api-key"`
`TRELLO_API_TOKEN="your-trello-api-token"`

Replace "your-trello-api-key" and "your-trello-api-token" with your actual Trello API credentials. The application makes use of configServices to retrieve the tokens from the .env file:

`this.apiKey = this.configService.get<string>('TRELLO_API_KEY');`
`this.apiToken = this.configService.get<string>('TRELLO_API_TOKEN');`

2. Configure the `ormconfig.json file if needed. By default, it uses an SQLite database. Make sure the database configuration matches your environment.

## Usage
1. Start the application in development mode:

`yarn start:dev`

2. Start the server

`http-server`

2. Open a web browser and navigate to http://localhost:3000.

3. Enter the URL of the Trello board you want to manage, e.g., https://trello.com/b/boardId/boardName.

4. Click the "Submit" button to fetch and display the tasks from the Trello board.

## File Structure
The application is organized into several files and directories:

* public/index.html: The HTML file for the front-end user interface.
* src/trello/trello.controller.ts: The NestJS controller for managing Trello tasks.
* src/trello/trello.entity.ts: The Entity representing Trello tasks in the database.
* src/trello/trello.module.ts: The NestJS module for Trello-related components.
* src/trello/trello.service.ts: The service that interacts with the Trello API and manages tasks.
* src/app.module.ts: The main application module, where other modules are imported.
* src/main.ts: The entry point for the application.

## Tests
The application includes unit tests for the TrelloService. You can run the tests with the following command:

`yarn test`

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow the standard GitHub Fork and Pull Request workflow.

## License
This project is licensed under the UNLICENSED License - see the LICENSE file for details.




