const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addPoints, isAdmin } = require('../utils/pointsManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addpoint')
    .setDescription('Tambah poin untuk user (Admin only)')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User yang akan ditambah poinnya')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Jumlah poin yang ditambah')
        .setMinValue(1)
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

    const newPoints = addPoints(targetUser.id, amount);

    const embed = new EmbedBuilder()
      .setColor('#95E1D3')
      .setTitle('✅ Poin Ditambah')
      .setDescription(`Poin ${targetUser.username} ditambah **${amount}** poin`)
      .addFields({ 
        name: 'Total Poin Sekarang', 
        value: `${newPoints}`,
        inline: true
      })
      .setFooter({ text: `Ditambah oleh ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
