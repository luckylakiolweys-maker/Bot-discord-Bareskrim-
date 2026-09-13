const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load commands dari folder commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  // Set nama command dari nama file
  if (!command.data.name) {
    command.data.name = file.replace('.js', '').toLowerCase();
  }
  
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Register commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {
  try {
    console.log(`📝 Mendaftar ${commands.length} slash command...`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands berhasil di-register');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

client.on('ready', () => {
  console.log(`✅ Bot online sebagai ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({
      content: '❌ Ada error saat menjalankan command',
      ephemeral: true,
    }).catch(() => null);
  }
});

client.login(process.env.TOKEN);
setTimeout(() => registerCommands(), 1000);
