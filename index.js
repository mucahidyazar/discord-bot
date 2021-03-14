require("dotenv").config({ path: "./config/env/dev.env" });
const { badWordDisabler } = require("./config/mock/save");
const turkishBadSentences = require("./kufurler.json");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const Filter = require("bad-words");
const filter = new Filter();
const client = new Discord.Client({
  partials: ["MESSAGE", "REACTION", "CHANNEL"],
});

badWordDisabler().then(() => {
  const sadWords = ["sad", "depressed", "unhappy", "angry", "miserable"];
  const encouragements = [
    "Cheer up!",
    "Hang in there.",
    "You are a great person / bot!",
  ];

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

    console.log(filter.isProfane(msg.content));
    if (filter.isProfane(msg.content)) {
      msg.reply(
        turkishBadSentences[
          Math.floor(Math.random() * turkishBadSentences.length)
        ]
      );
    }

    if (msg.content === "ping") {
      msg.reply("pong");
    }

    if (msg.content === "$inspire") {
      getQuote().then((quote) => msg.channel.send(quote));
    }

    if (sadWords.some((word) => msg.content.includes(word))) {
      const encouragement =
        encouragements[Math.floor(Math.random() * encouragements.length)];
      msg.reply(encouragement);
    }
  });

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
});
