const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const khodamList = [
  'Setan cantik',
  'Bidadari',
  'Macan putih',
  'Naga emas',
  'Burung phoenix',
  'Harimau hitam',
  'Putri duyung',
  'Siluman buaya',
  'Peri cahaya',
  'Raja iblis',
  'Roh penolak bala',
  'Ular nagasari',
  'Kembar maknawi',
  'Iblis penjaga',
  'Malaikat penjaga',
  'Gajah putih',
  'Monyet emas',
  'Serigala merah',
  'Elang rajawali',
  'Ikan mas raksasa',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cekkhodam')
    .setDescription('Cek khodam kamu'),
  
  async execute(interaction) {
    const khodam = khodamList[Math.floor(Math.random() * khodamList.length)];
    
    const embed = new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle('✨ Hasil Cek Khodam ✨')
      .setDescription(`Khodam kamu adalah: **${khodam}**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: `Khodam milik ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
