/**
 * Script for creating and managing a Discord bot that registers and handles slash commands.
 * Utilizes the discord.js library along with discord-api-types and @discordjs/builders for easy integration with Discord's API.
 */

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, GatewayIntentBits } = require('discord.js');
const interactionCreateHandler = require('./handlers/interactionCreateHandler');

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
    .setName('szukaj')
    .setDescription('Powiedz nam czego szukasz')
    .addStringOption(option =>
      option.setName('o-co-prosisz')
        .setDescription('Co chcesz znaleźć?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('z-jakiego-wydawnictwa')
        .setDescription('Wydawnictwo')
        .setRequired(true)
        .addChoices(
          { name: 'Nowa Era', value: 'Nowa Era' },
          { name: 'WSiP', value: 'WSiP' },
          { name: 'GWO', value: 'GWO' }))
    .addStringOption(option =>
      option.setName('podstawa-czy-rozszerzenie')
        .setDescription('Podstawa czy rozszerzenie')
        .setRequired(true)
        .addChoices(
          { name: 'Podstawa', value: 'podstawowy' },
          { name: 'Rozszerzenie', value: 'rozszerzony' })),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

/**
 * Once the client is ready, it registers the slash commands with the Discord API.
 * This event only triggers once after logging in.
 */
client.once('ready', async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
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
