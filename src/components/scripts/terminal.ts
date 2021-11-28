import $ from 'jquery';
const commands = require('../components/scripts/commands.js').cmdlist;
const {
  promptBox,
  pathBox,
  powerBox,
  span,
  scrollPage,
  scrollToLink,
  siteStringNumber,
  name,
} = require('../components/scripts/util.js');
let {
  inMenu,
  inDatabase,
  inManual,
} = require('../components/scripts/commands/commandUtils.js');

const termwindow = $('#window');
const termwindow_ = document.querySelector('#window')!; // for scrolling to work

let command = '';
const commandHistory = [''];
let historyIndex = 0;
/**
 * Appends a command to the terminal window
 * @param str the command to append
 */
const appendCommand = (str: string) => {
  switch (str) {
    case '<':
      termwindow.append('&lt;');
      break;
    case '>':
      termwindow.append('&gt;');
      break;
    case '&':
      termwindow.append('&amp;');
      break;
    default:
      termwindow.append(str);
      break;
  }
  command += str;
};

/**
 * Erases text from the terminal
 * @param n the number of letters to erase
 */
const erase = (n: number) => {
  command = command.slice(0, -n);
  termwindow.html(termwindow.html().slice(0, -n));
};

function clearCommand() {
  if (command.length > 0) {
    erase(command.length);
  }
}

const prompt_ = promptBox(`@bright`);
let path_ = pathBox('scp.net');
const powerbox_ = powerBox(prompt_, path_);
/**
 * Appends the prompt to the terminal window
 */
const appendPrompt = () => {
  //termwindow.append(`${powerbox_} `);

  //termwindow.append(`┌ root@sudo-user\n`)
  //termwindow.append("└ $ ");
  termwindow.append(`${name}@site-${siteStringNumber}:~$ `);
  //scrollPage();
};

/**
 * Renders login prompt (no functionality yet)
 */
const setLogin = () => {
  termwindow.append(
    'Accessing classified information. Enter login credentials:\n'
  );
  termwindow.append('Please enter Foundation ID:\n > ********** \n');
  termwindow.append('Please enter password:\n > ******************** \n\n');
  termwindow.append('Password accepted. Validating...\n');
  termwindow.append(
    span('status-success', 'Clearance granted. ') +
      'Welcome authorized personnel.\n\n'
  );
};

const processCommand = async () => {
  // Divide the command into the name and its arguments
  const args = command.split(' ');
  const typedCommand = commands.find(
    (cmd: {name: string}) => cmd.name === args[0]
  );
  args.shift();

  // TODO: Get rid of the old manual functionality. I havent figured out a good way to implement it yet
  // Execute the command or return error message. Numbers for menu options do not get processed here.
  if (isNaN(parseInt(command))) {
    if (inDatabase || inManual || inMenu) {
      console.log(command);
      if (command === 'manual') {
        inManual = false;
        inMenu = false;
        inDatabase = false;
        command = '';
        appendPrompt();
        return;
      }
      termwindow.append(
        span(
          'status-fail',
          "Not a supported menu option. To use commands, exit the menu by typing 'manual'\n"
        )
      );
    } else if (typedCommand == null)
      termwindow.append(span('status-fail', `Command not found: ${command}\n`));
    else await typedCommand.function(args);
    if (typedCommand != null) {
      if (typedCommand.name == 'access') {
        scrollToLink();
      } else {
        scrollPage();
      }
    }
  }

  // Clear the command for next input
  commandHistory.splice(1, 0, command);
  command = '';
  historyIndex = 0;
  commandHistory[0] = '';
  appendPrompt();
};

/**
 * Renders things to the terminal on startup
 */
const startTerminal = () => {
  termwindow.append(
    `SCiPnet Data Network [version 0.0.1] ${span(
      'status-success',
      'active'
    )}\n\n`
  );
  termwindow.append(
    span(
      'status-red-alert',
      'WARNING. THE SCP FOUNDATION DATABASE IS CLASSIFIED! ACCESS BY UNAUTHORIZED PERSONNEL IS STRICTLY PROHIBITED. PERPETRATORS WILL BE TRACKED, LOCATED, AND DETAINED.\n\n'
    )
  );

  setLogin();

  termwindow.append(
    "Welcome to SCiPnet v0.0.1. For commands, type 'help'. To exit, type 'exit'. For more info, type 'manual'.\n"
  );
  appendPrompt();
};

// Allows typing
document.addEventListener('keypress', async e => {
  const key = e.which;
  switch (key) {
    case 13: // enter
      termwindow.append('\n');
      if (command.trim().length !== 0) {
        processCommand();
      } else {
        appendPrompt();
        scrollPage();
      }
      break;
    default:
      e.preventDefault();
      appendCommand(String.fromCharCode(key));
      scrollPage();
  }
});

document.addEventListener('keydown', e => {
  // Allows backspacing
  const key = e.which;
  if (key == 8) {
    // backspace
    e.preventDefault();
    if (command !== '' && command !== '\n') {
      erase(1);
    }
    scrollPage();
  }
  // Allows moving through command history
  if (key === 38 || key === 40) {
    e.preventDefault();

    // Up key
    if (key === 38) {
      if (historyIndex < commandHistory.length - 1) historyIndex++;
    }
    // Down key
    else if (key === 40) {
      if (historyIndex > 0) historyIndex--;
    }

    // Get command and append it to the terminal
    const cmd = historyIndex >= 0 ? commandHistory[historyIndex] : '';
    if (cmd != undefined) {
      clearCommand();
      appendCommand(cmd);
    }
    scrollPage();
  }
});

// Cursor handling
document.addEventListener('keydown', e => {
  termwindow_.classList.add('pause-cursor');
});
document.addEventListener('keyup', e => {
  termwindow_.classList.remove('pause-cursor');
});

startTerminal();
