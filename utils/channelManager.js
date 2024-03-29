const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Creates a new text channel in the Discord server with specific permissions.
 * The channel is named after the provided name and the user's username.
 * It sets up permission overwrites to control who can view and interact with the channel.
 * 
 * @param {Interaction} interaction The interaction that triggered the channel creation.
 * @param {string} categoryId The ID of the category under which to create the channel.
 * @param {string} name The base name for the channel, which will be appended with the user's username.
 */
const createChannel = async (interaction, categoryId, name) => {
    const guild = interaction.guild;

    try {
        const channel = await guild.channels.create({
            name: `${name}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: process.env.ROLE_ID_1,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: process.env.ROLE_ID_2,
                    allow: [PermissionFlagsBits.ViewChannel],
                }
            ],
        });

        const deleteButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('delete-channel')
                    .setLabel('Zamknij Ticket')
                    .setStyle(ButtonStyle.Danger),
            );

        await channel.send({
            content: `Witaj, <@${interaction.user.id}>! Aby rozpocząć, użyj komendy /szukaj.`,
            components: [deleteButton]
        });

        await interaction.reply({ content: `Utworzyłem kanał: ${channel.name}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating channel:', error);
        await interaction.reply({ content: 'Nie mogłem utworzyć kanału. Poinformuj administrację.', ephemeral: true });
    }
};

/**
 * Deletes the specified channel from the Discord server.
 * Logs an error message if the deletion fails.
 * 
 * @param {Channel} channel The channel to be deleted.
 */
const deleteChannel = async (channel) => {
    try {
        await channel.delete();
        console.log(`Channel deleted: ${channel.name}`);
    } catch (error) {
        console.error('Error deleting channel:', error);
        await channel.send("Wystąpił problem podczas usuwania kanału.");
    }
};

module.exports = {
    createChannel,
    deleteChannel,
};
