require("dotenv").config({ path: "./dev.env" });
const Discord = require("discord.js");
const fetch = require("node-fetch");
const Filter = require("bad-words");
const filter = new Filter();
const client = new Discord.Client({
  partials: ["MESSAGE", "REACTION", "CHANNEL"],
});

//
const sadWords = ["sad", "depressed", "unhappy", "angry", "miserable"];

//
const encouragements = [
  "Cheer up!",
  "Hang in there.",
  "You are a great person / bot!",
];

//
const warnMessages = [
  "You will be kicked from the server if you continue",
  "Ban is coming",
  "Please shut up",
];

//
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.author.bot) return;

  //console.log(filter.isProfane(msg.content));

  if (msg.content === "ping") {
    msg.reply("pong");
  }

  if (sadWords.some((word) => msg.content.includes(word))) {
    const encouragement =
      encouragements[Math.floor(Math.random() * encouragements.length)];
    msg.reply(encouragement);
  }

  if (filter.isProfane(msg.content)) {
    msg.reply(warnMessages[Math.floor(Math.random() * warnMessages.length)]);
  }

  if (msg.content === "$inspire") {
    getQuote().then((quote) => msg.channel.send(quote));
  }
});

// Adding reaction roles
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;

  if (reaction.message.channel.id == "820324480617414657") {
    if (reaction.emoji.name === "🧝‍♂️") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add("820330451553746944");
    }
    if (reaction.emoji.name === "🔥") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add("820330710803152896");
    }
    if (reaction.emoji.name === "👨") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add("820330794530111578");
    }
  } else return;
});

// Removing reaction roles
client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.channel.id == "820324480617414657") {
    if (reaction.emoji.name === "🧝‍♂️") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove("820330451553746944");
    }
    if (reaction.emoji.name === "🔥") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove("820330710803152896");
    }
    if (reaction.emoji.name === "👨") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove("820330794530111578");
    }
  } else return;
});

client.login(process.env.TOKEN);
