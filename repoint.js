const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { removePoints, isAdmin } = require('../utils/pointsManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repoint')
    .setDescription('Reset/kurangi poin user (Admin only)')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User yang akan dikurangi/direset poinnya')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Jumlah poin yang dikurangi (0 untuk reset semua)')
        .setMinValue(0)
        .setRequired(true)
    ),
  
  async execute(interaction) {
    // Check admin
    if (!isAdmin(interaction.member)) {
      return await interaction.reply({
        content: '❌ Hanya admin yang bisa menggunakan command ini!',
        ephemeral: true,
      });
    }

    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const newPoints = removePoints(targetUser.id, amount);

    const action = amount === 0 ? 'direset menjadi 0' : `dikurangi ${amount}`;
    
    const embed = new EmbedBuilder()
      .setColor('#F38181')
      .setTitle('✅ Poin Diubah')
      .setDescription(`Poin ${targetUser.username} ${action}`)
      .addFields({ 
        name: 'Total Poin Sekarang', 
        value: `${newPoints}`,
        inline: true
      })
      .setFooter({ text: `Diubah oleh ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
