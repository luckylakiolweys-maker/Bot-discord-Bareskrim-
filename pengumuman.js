const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isAdmin } = require('../utils/pointsManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pengumuman')
    .setDescription('Buat pengumuman (Admin only)')
    .addStringOption(option =>
      option
        .setName('pesan')
        .setDescription('Isi pesan pengumuman')
        .setRequired(true)
        .setMaxLength(2000)
    ),
  
  async execute(interaction) {
    // Check admin
    if (!isAdmin(interaction.member)) {
      return await interaction.reply({
        content: '❌ Hanya admin yang bisa menggunakan command ini!',
        ephemeral: true,
      });
    }

    const pesan = interaction.options.getString('pesan');

    const embed = new EmbedBuilder()
      .setColor('#FF1493')
      .setTitle('📢 PENGUMUMAN PENTING')
      .setDescription(pesan)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields({
        name: 'Dari',
        value: `${interaction.user.username}`,
        inline: true,
      })
      .setFooter({ text: 'Pengumuman resmi dari admin' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
