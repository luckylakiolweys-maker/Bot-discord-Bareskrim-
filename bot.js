const { Client, GatewayIntentBits, Collection, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ADMIN_ROLE_ID = '1547367417481789531';
const POINTS_FILE = './points.json';

// Inisialisasi data poin
function loadPoints() {
  if (fs.existsSync(POINTS_FILE)) {
    return JSON.parse(fs.readFileSync(POINTS_FILE, 'utf8'));
  }
  return {};
}

function savePoints(data) {
  fs.writeFileSync(POINTS_FILE, JSON.stringify(data, null, 2));
}

let points = loadPoints();

// Slash Commands
const commands = [
  {
    name: 'cekkhodam',
    description: 'Cek khodam kamu',
  },
  {
    name: 'cekpoint',
    description: 'Cek poin kamu saat ini',
  },
  {
    name: 'addpoint',
    description: 'Tambah poin untuk user (Admin only)',
    options: [
      {
        name: 'user',
        description: 'User yang akan ditambah poinnya',
        type: 9, // USER type
        required: true,
      },
      {
        name: 'amount',
        description: 'Jumlah poin yang ditambah',
        type: 4, // INTEGER type
        required: true,
      },
    ],
  },
  {
    name: 'repoint',
    description: 'Reset/kurangi poin user (Admin only)',
    options: [
      {
        name: 'user',
        description: 'User yang akan dikurangi/direset poinnya',
        type: 9, // USER type
        required: true,
      },
      {
        name: 'amount',
        description: 'Jumlah poin yang dikurangi (0 untuk reset)',
        type: 4, // INTEGER type
        required: true,
      },
    ],
  },
  {
    name: 'leaderboard',
    description: 'Lihat leaderboard poin',
  },
  {
    name: 'pengumuman',
    description: 'Buat pengumuman (Admin only)',
    options: [
      {
        name: 'pesan',
        description: 'Isi pesan pengumuman',
        type: 3, // STRING type
        required: true,
      },
    ],
  },
];

// Register Commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {
  try {
    console.log('Mulai register slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands berhasil di-register');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

// Fungsi helper check admin
function isAdmin(member) {
  return member.roles.cache.has(ADMIN_ROLE_ID);
}

// Khodam list
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
];

client.on('ready', () => {
  console.log(`✅ Bot online sebagai ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    // CEKKHODAM Command
    if (commandName === 'cekkhodam') {
      const khodam = khodamList[Math.floor(Math.random() * khodamList.length)];
      const embed = new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('✨ Hasil Cek Khodam ✨')
        .setDescription(`Khodam kamu adalah: **${khodam}**`)
        .setFooter({ text: `Khodam milik ${interaction.user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    // CEKPOINT Command
    else if (commandName === 'cekpoint') {
      const userId = interaction.user.id;
      const userPoints = points[userId] || 0;

      const embed = new EmbedBuilder()
        .setColor('#4ECDC4')
        .setTitle('📊 Poin Kamu')
        .setDescription(`Kamu saat ini memiliki **${userPoints}** poin`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    // ADDPOINT Command
    else if (commandName === 'addpoint') {
      if (!isAdmin(interaction.member)) {
        return await interaction.reply({
          content: '❌ Hanya admin yang bisa menggunakan command ini!',
          ephemeral: true,
        });
      }

      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      if (amount < 1) {
        return await interaction.reply({
          content: '❌ Jumlah poin harus lebih dari 0!',
          ephemeral: true,
        });
      }

      points[targetUser.id] = (points[targetUser.id] || 0) + amount;
      savePoints(points);

      const embed = new EmbedBuilder()
        .setColor('#95E1D3')
        .setTitle('✅ Poin Ditambah')
        .setDescription(`Poin ${targetUser.username} ditambah **${amount}** poin`)
        .addFields({ name: 'Total Poin', value: `${points[targetUser.id]}` })
        .setFooter({ text: `Ditambah oleh ${interaction.user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    // REPOINT Command
    else if (commandName === 'repoint') {
      if (!isAdmin(interaction.member)) {
        return await interaction.reply({
          content: '❌ Hanya admin yang bisa menggunakan command ini!',
          ephemeral: true,
        });
      }

      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      if (amount === 0) {
        points[targetUser.id] = 0;
      } else {
        points[targetUser.id] = Math.max((points[targetUser.id] || 0) - amount, 0);
      }

      savePoints(points);

      const action = amount === 0 ? 'direset' : `dikurangi ${amount}`;
      const embed = new EmbedBuilder()
        .setColor('#F38181')
        .setTitle('✅ Poin Diubah')
        .setDescription(`Poin ${targetUser.username} ${action}`)
        .addFields({ name: 'Total Poin', value: `${points[targetUser.id]}` })
        .setFooter({ text: `Diubah oleh ${interaction.user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    // LEADERBOARD Command
    else if (commandName === 'leaderboard') {
      const sortedPoints = Object.entries(points)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      if (sortedPoints.length === 0) {
        return await interaction.reply({
          content: '📊 Belum ada data poin',
          ephemeral: true,
        });
      }

      let leaderboardText = '';
      for (let i = 0; i < sortedPoints.length; i++) {
        const [userId, userPoints] = sortedPoints[i];
        const user = await client.users.fetch(userId).catch(() => null);
        const username = user ? user.username : 'Unknown User';
        const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;

        leaderboardText += `${medal} **${username}** - ${userPoints} poin\n`;
      }

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🏆 Leaderboard Poin')
        .setDescription(leaderboardText)
        .setFooter({ text: 'Top 10 pengguna dengan poin tertinggi' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }

    // PENGUMUMAN Command
    else if (commandName === 'pengumuman') {
      if (!isAdmin(interaction.member)) {
        return await interaction.reply({
          content: '❌ Hanya admin yang bisa menggunakan command ini!',
          ephemeral: true,
        });
      }

      const pesan = interaction.options.getString('pesan');

      const embed = new EmbedBuilder()
        .setColor('#FF1493')
        .setTitle('📢 PENGUMUMAN')
        .setDescription(pesan)
        .setFooter({ text: `Dari: ${interaction.user.username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Error handling command:', error);
    await interaction.reply({
      content: '❌ Ada error saat menjalankan command',
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);

// Register commands saat bot start
setTimeout(() => registerCommands(), 1000);
