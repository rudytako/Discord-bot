# Discord Bot Project

Here is a discord bot that I was asked to make. It is coded with discord.js library. I've also used jsdoc library to make complete documentation. You can find it in /docs directory.
The bot has been added to a server that brings together students so they can share completed tests with each other. The bot is designed to assist the administration in finding tests for students, using the /szukaj command.

## Features

- **Slash Commands**: Users can input commands prefixed with `/` to initiate bot actions.
- **Interactive Buttons**: Custom buttons for creating ticket channels based on user roles.
- **Role-Based Access**: Restricts certain commands to users with specific roles.
- **Environment Variables**: Uses `.env` for secure and flexible configuration.

## Commands

- `/szukaj`: Searches for an item with options for the search query, publisher, and level of detail.
- `/buttons`: Sends a message with interactive buttons to the channel.

## Button Interactions

- **Create Ticket**: When a user clicks a "Create Ticket" button, the bot will create a new text channel under a specified category with permissions set so only the user and specific roles can view it.
- **Delete Channel**: Allows users to delete the ticket channel they are in.

## Event Handlers

- `messageCreate`: Listens for messages in the server to trigger actions.
- `interactionCreate`: Handles interactions from slash commands and buttons.

