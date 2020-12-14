const open = require("open");
const promptly = require("promptly");
const puppeteer = require("puppeteer");
const choice = ("");  // Define variable for non-interactive startup. (disc or digital)
const alarm = ("");  // Define variable for non-interactive startup. (Y or N)

const {checkForPlaystationDirectRedirect, playAlarm} = require("./utils");

/** Constants */
const playstationType = {
    disc: {
        id: 3005816,
        url: "https://direct-queue.playstation.com/?c=sonyied&e=psdirectprodku1&t=https%3A%2F%2Fdirect.playstation.com%2Fen-us%2Fconsoles%2Fconsole%2Fplaystation5-console.3005816&cv=1089561812&cid=en-US",
    },
    digital: {
        id: 3005817,
        url: "https://direct-queue.playstation.com/?c=sonyied&e=psdirectprodku1&t=https%3A%2F%2Fdirect.playstation.com%2Fen-us%2Fconsoles%2Fconsole%2Fplaystation5-digital-edition-console.3005817&cid=en-US",
    }
};

/** Let's do this */
(async function() {
    if (choice == "") choice = await promptly.choose("Which version would you like? (disc or digital)", ["disc", "digital"]);
    if (alarm == "") alarm = await promptly.choose("Would you like to hear a loud, annoying alarm when we find your PS5? (Y or N)", ["Y", "N"])
    console.log(`Searching for PlayStation 5 ${choice} edition...`);
    
    const onSuccess = () => {
        console.log("Found it! Opening queue now...");
        open(playstationType[choice].url);
        if (alarm.toUpperCase() === "Y") {
            playAlarm();
        }
    };
    checkForPlaystationDirectRedirect(5000, onSuccess, playstationType[choice].id, await puppeteer.launch());
})();

// Gracefully exit
process.on('SIGINT', () => {
    process.exit();
});
