const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getTopPoints } = require('../utils/pointsManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Lihat leaderboard poin'),
  
  async execute(interaction, client) {
    const topPoints = getTopPoints(10);

    if (topPoints.length === 0) {
      return await interaction.reply({
        content: '📊 Belum ada data poin di server ini',
        ephemeral: true,
      });
    }

    let leaderboardText = '';
    
    for (let i = 0; i < topPoints.length; i++) {
      const [userId, userPoints] = topPoints[i];
      
      try {
        const user = await client.users.fetch(userId);
        const username = user.username;
        const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
        leaderboardText += `${medal} **${username}** - ${userPoints} poin\n`;
      } catch (error) {
        const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
        leaderboardText += `${medal} **Unknown User** - ${userPoints} poin\n`;
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 Leaderboard Poin')
      .setDescription(leaderboardText || 'Tidak ada data')
      .setFooter({ text: 'Top 10 pengguna dengan poin tertinggi' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
