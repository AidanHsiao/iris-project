const Discord = require("discord.js")
const cron = require("cron")
const client = new Discord.Client()
const token = process.env.TOKEN
let user

const queue = []

const job = new cron.CronJob("0 17 * * *", 
function () {
  sendQueue(queue)
});
job.start()

client.on('ready', async () => {
  aidan = await client.users.fetch("302942608676880385")
})

function queueEmbed(msg, time) {
  const queueText = queue.map((item) => `\`${item}\``).join("\n")
  time.hour = time.hour + 8
  if (time.hour >= 24) {
    time.hour -= 24
  }
  const leftoverText = `${24 - time.hour}:${60 - time.minute}:${60 - time.second}`
  const queueEmbed = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setTitle("Successfully queued message").setDescription(`You queued the following message:\n\`${msg}\`\n\nThe queue is now:\n${queueText}`)
    .setFooter(`Queue will be reset in: ${leftoverText}`)
  return queueEmbed;
}

function textEmbed(msg) {
  const textEmbed = new Discord.MessageEmbed()
  .setColor("#0099ff")
  .setTitle("Aidan texted you:")
  .setDescription(msg)
  .setFooter("Replying to this bot will send the message directly to Aidan.")
  return textEmbed
}

async function sendQueue(queue) {
  user = await client.users.fetch("563144287269945344")
  groupQueue = []
  let inQueue = true
  while (inQueue) {
    const tempQueue = []
    for (let i = 0; i < 8; i++) {
      tempQueue.push(queue[0])
      queue.splice(0, 1)
      if (queue.length <= 0) {
        inQueue = false
        break;
      }
    }
    groupQueue.push(tempQueue.join("\n"))
  }
  groupQueue.map(t => user.send(textEmbed(t)))
}

client.on('message', async (msg) => { 
  const d1 = new Date()
  const date = {
    hour: d1.getHours(),
    minute: d1.getMinutes(),
    second: d1.getSeconds()
  }
  if (msg.author.bot || msg.guild) return;
  if (msg.author.id !== "302942608676880385") {
    aidan.send(`<@${msg.author.id}> sent: \`${msg.content}\``)
    return;
  }
  const command = msg.content.split(" ").shift().slice(1)
  const text = msg.content.split(" ").slice(1).join(" ")
  switch (command.toLowerCase()) {
    case "queue": {
      if (text.length > 200) {
        msg.channel.send("Request too long.")
        return;
      }
      queue.push(text)
      msg.author.send(queueEmbed(text, date))
      break;
    }  
    case "forcesend": {
      sendQueue(queue)
      break;
    }
    case "clearqueue": {
      queue.splice(0, queue.length)
      msg.author.send("Queue cleared.")
      break;
    }
  }
})

client.login(token)

