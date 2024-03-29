/**
 * Script for creating and managing a Discord bot that registers and handles slash commands.
 * Utilizes the discord.js library along with discord-api-types and @discordjs/builders for easy integration with Discord's API.
 */

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, GatewayIntentBits } = require('discord.js');
const interactionCreateHandler = require('./handlers/interactionCreateHandler');
const { token, clientId, guildId } = require('./config');

require('dotenv').config();

/**
 * Creates a new client instance with specific intents to receive guild and message events.
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

/**
 * Constructs slash commands using SlashCommandBuilder.
 * Each command is configured with a name, description, and specific options.
 */
const commands = [
  new SlashCommandBuilder()
    .setName('search')
    .setDescription('Tell me what you are looking for')
    .addStringOption(option =>
      option.setName('what-are-you-asking-for')
        .setDescription('What exactly do you want to find?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('from-which-publisher')
        .setDescription('Publisher')
        .setRequired(true)
        .addChoices(
          { name: 'Nowa Era', value: 'Nowa Era' },
          { name: 'WSiP', value: 'WSiP' },
          { name: 'GWO', value: 'GWO' }))
    .addStringOption(option =>
      option.setName('basic-or-extension')
        .setDescription('Basic or extension')
        .setRequired(true)
        .addChoices(
          { name: 'Basic', value: 'basic' },
          { name: 'Extension', value: 'extended' })),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

/**
 * Once the client is ready, it registers the slash commands with the Discord API.
 * This event only triggers once after logging in.
 */
client.once('ready', async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  console.log('Bot is ready');
});

/**
 * Handles 'messageCreate' and 'interactionCreate' events.
 * Uses external handler functions defined in 'interactionCreateHandler'.
 */
client.on('messageCreate', interactionCreateHandler.messageCreate);
client.on('interactionCreate', interactionCreateHandler.interactionCreate);

/**
 * Logs in to Discord with the bot's token.
 * The token is securely loaded from environment variables.
 */
client.login(process.env.TOKEN);
