const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPoints } = require('../utils/pointsManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cekpoint')
    .setDescription('Cek poin kamu saat ini'),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const userPoints = getPoints(userId);

    const embed = new EmbedBuilder()
      .setColor('#4ECDC4')
      .setTitle('📊 Poin Kamu')
      .setDescription(`Kamu saat ini memiliki **${userPoints}** poin`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
