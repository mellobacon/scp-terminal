import {checkOptions, error, getHelp, helpflag} from './commandUtils';
import {getRandomInt, listItem, pageData, scrollToLink, span} from '../util';
import {ipcRenderer, shell} from 'electron';

import $ from 'jquery';
import axios from 'axios';
import cheerio from 'cheerio';

const termwindow = $('#window');
const scphistory = $('#scp-list ul');

const access = async (args: any[]) => {
  checkOptions(args, null, 1);
  if (helpflag) {
    getHelp('access');
    return;
  }
  if (!error) {
    if (!args[0]) {
      termwindow.append(
        span(
          'status-fail',
          "Error: Invalid format. Type 'access -help' for help.\n"
        )
      );
      return;
    }
    termwindow.append('Loading...\n');
    let url = '';
    let scp = args[0];
    if (!args[0].toUpperCase().startsWith('SCP-')) {
      if (args[0] === 'random') {
        // Get a random scp link
        const num = getRandomInt(0, 6999);
        const scpnum = new Intl.NumberFormat('en-US', {minimumIntegerDigits: 3})
          .format(num)
          .toString()
          .replace(',', '');
        url = `http://scp-wiki.wikidot.com/scp-${scpnum}`;
        scp = `scp-${scpnum}`;
      } else {
        termwindow.append(
          span(
            'status-fail',
            "Error: Invalid format. Type 'access -help' for help.\n"
          )
        );
        return;
      }
    } else {
      url = `http://scp-wiki.wikidot.com/${args[0]}`;
    }
    await getUrl(url, scp);
    termwindow.append('Loading complete\n');
  }
};

const handleClick = async () => {
  // recursion is dumb and everything is dumb
  document.querySelectorAll('.page-data a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      accessLink(link);
    });
  });

  function accessLink(link: Element) {
    if (link.hasAttribute('href')) {
      let scp = link.getAttribute('href')?.replace(/^\//gm, '')!;
      ipcRenderer.send('execute', scp);
      ipcRenderer.once('view', (_, output) => {
        let status = output[0];
        let url = output[1];

        // TODO: Fix recursion issue
        if (status == 200) {
          // if the link isnt part of the scp wiki domain its an external link which i will handle later
          let wiki = /(^(https)|(http)):\/\/((scp-wiki)|(www\.scp-wiki))/gm;
          if (!wiki.test(url)) {
            termwindow.append('\nOpened external site\n');
            getUrl(url, scp, false).then(() => {
              termwindow.append('root@user:~$ ');
              return;
            });
          } else {
            getUrl(url, scp).then(() => {
              termwindow.append('root@user:~$ ');
              scrollToLink();
              return;
            });
          }
        }
      });
    }
  }

  $('.collapsible-block').each((_, block) => {
    let foldedblock = $(block).children()[0];
    let unfoldedblock = $(block).children()[1];

    foldedblock.addEventListener('click', () => {
      foldedblock.style.display = 'none';
      unfoldedblock.style.display = 'block';
    });
    unfoldedblock.addEventListener('click', () => {
      unfoldedblock.style.display = 'none';
      foldedblock.style.display = 'block';
    });
  });
};

const getUrl = async (url: string, scp: string, valid: boolean = true) => {
  if (!valid) {
    shell.openExternal(url);
    return;
  }
  const a = axios.create();
  await a
    .get(url)
    .then((html: {data: any}) => {
      // get the page
      const data = html.data;
      const content = cheerio.load(data);
      const scp_page = content('#page-content');

      // remove unneeded content
      const rating = content('.page-rate-widget-box');
      const footer = content('.footer-wikiwalk-nav');
      const license = content('.licensebox');
      const mobileexit = content('.mobile-exit');
      const info = content('.info-container');
      rating.remove();
      footer.remove();
      license.remove();
      mobileexit.remove();
      info.remove();
      content('.collapsible-block-link').removeAttr('href');

      // append the data to the terminal
      termwindow.append(pageData(scp_page.html()?.trim()));
      scphistory.append(listItem(scp.toUpperCase()));
    })
    .catch(e => {
      console.log(e);
      termwindow.append(span('status-fail', `${scp} not available.\n`));
      return;
    });

  // just a placeholder until iframes get fixed somehow. its wonky in electron.
  $('iframe').replaceWith(
    `<div class="error-placeholder"><h4>Error loading data</h4></div>`
  );
  // gonna add a loading thingy later
  $('.page-data').addClass('loaded');
  handleClick();
};

export {access};
