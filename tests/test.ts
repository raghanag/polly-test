import * as path from 'path';
import { Polly } from '@pollyjs/core';
import { setupMocha as setupPolly } from '@pollyjs/core';
import PuppeteerAdapter from '@pollyjs/adapter-puppeteer';
import FSPersister from '@pollyjs/persister-fs';
import puppeteer from 'puppeteer';

import { expect } from 'chai';

Polly.register(PuppeteerAdapter);
Polly.register(FSPersister);
let browser:any;
let page:any;
let context:any;
describe('Puppeteer Suite', async () => {
  
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    context = setupPolly({
      adapters: ['puppeteer'],
      mode: 'record',
      adapterOptions: { puppeteer: { page } },
      persister: 'fs',
      persisterOptions: {
        fs: {
          recordingsDir: path.resolve(__dirname, '../__recordings__')
        }
      },
      matchRequestsBy: {
        headers: {
          exclude: ['user-agent']
        }
      }
    });
    // await page.setRequestInterception(true);

    // const { server } = context.polly;

    // server.host('http://localhost:3000', () => {
    //   server.get('/sockjs-node/*').intercept((_:any, res:any) => res.sendStatus(200));
    // });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  });

    afterEach(async () => {
      await browser.close();
    });

    it('should be able to navigate to all routes', async () => {
      const header = await page.$eval('h2', (element:any) => {
        return element.innerText;
      });
  
      // await expect(page).toMatchElement('tbody > tr', { timeout: 5000 });
      expect(header).to.equal('Posts');
  
      // await expect(page).toClick('a', { text: 'Todos' });
      // await expect(page).toMatchElement('tbody > tr', { timeout: 5000 });
      // await expect(header).toMatch('Todos');
  
      // await expect(page).toClick('a', { text: 'Users' });
      // await expect(page).toMatchElement('tbody > tr', { timeout: 5000 });
      // await expect(header).toMatch('Users');
  
      // Wait for all requests to resolve, this can also be replaced with
      await context.polly.flush();
    });
});