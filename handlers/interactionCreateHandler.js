const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createChannel, deleteChannel } = require('../utils/channelManager');

/**
 * Sends a set of interactive buttons to a specified channel.
 * These buttons are labeled for different classes, allowing users to interact with them.
 * 
 * @param {Channel} channel The Discord channel to send the buttons to.
 */
const sendButtons = async (channel) => {
    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('create-ticket-4-sp').setLabel('Klasa 4 SP').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('create-ticket-5-sp').setLabel('Klasa 5 SP').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('create-ticket-6-sp').setLabel('Klasa 6 SP').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('create-ticket-7-sp').setLabel('Klasa 7 SP').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('create-ticket-8-sp').setLabel('Klasa 8 SP').setStyle(ButtonStyle.Primary),
        );

    const buttons2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('create-ticket-1-lo').setLabel('Klasa 1 LO').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('create-ticket-2-lo').setLabel('Klasa 2 LO').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('create-ticket-3-lo').setLabel('Klasa 3 LO').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('create-ticket-4-lo').setLabel('Klasa 4 LO').setStyle(ButtonStyle.Primary),
        );

    await channel.send({
        content: 'Aby rozpocząć, wybierz klasę.',
        components: [buttons, buttons2]
    });
};

/**
 * Handles the '/buttons' command. Sends buttons to the specified channel if the user has the required role.
 * 
 * @param {Message} message The message instance that triggered the command.
 */
const messageCreate = async (message) => {
    if (message.content === '/buttons') {
        if (message.member.roles.cache.has(process.env.REQUIRED_ROLE_ID)) {
            const channel = await message.client.channels.fetch(process.env.CHANNEL_ID);
            sendButtons(channel);
        }
    }
};

/**
 * Handles interactions with the buttons, creating or deleting channels based on the button pressed.
 * 
 * @param {Interaction} interaction The interaction instance that includes the button press.
 */
const handleButtonInteraction = async (interaction) => {
    if (interaction.customId.startsWith('create-ticket')) {
        const name = interaction.customId.split('-').slice(2).join('-');
        createChannel(interaction, process.env.CATEGORY_ID, name);
    } else if (interaction.customId === 'delete-channel') {
        deleteChannel(interaction.channel);
    }
};

/**
 * Handles command interactions, such as searching for a book based on given criteria.
 * 
 * @param {Interaction} interaction The interaction instance that includes the command invocation.
 */
const handleCommandInteraction = async (interaction) => {
    const bookName = interaction.options.getString('o-co-prosisz');
    const publisher = interaction.options.getString('z-jakiego-wydawnictwa');
    const level = interaction.options.getString('podstawa-czy-rozszerzenie');

    await interaction.reply(`Szukam "${bookName}" wydawnictwa ${publisher}. Poziom ${level}.`);
};

/**
 * Main handler for all interactions, delegating to specific functions based on the type of interaction.
 * 
 * @param {Interaction} interaction The interaction instance to be handled.
 */
const interactionCreate = async (interaction) => {
    if (interaction.isButton()) {
        handleButtonInteraction(interaction);
    } else if (interaction.isCommand()) {
        handleCommandInteraction(interaction);
    }
};

module.exports = {
    messageCreate,
    interactionCreate,
};
