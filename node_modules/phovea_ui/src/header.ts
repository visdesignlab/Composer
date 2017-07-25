/**
 * Created by Samuel Gratzl on 24.11.2014.
 */

import './_bootstrap';
import './_font-awesome';
import './style.scss';
import * as template from 'html-loader!./_header.html';

import {getAPIJSON} from 'phovea_core/src/ajax';
import {mixin} from 'phovea_core/src/index';
import * as $ from 'jquery';
import buildBuildInfo from './buildInfo';

/**
 * Defines a header link
 */
export interface IHeaderLink {
  /**
   * Text of the link
   */
  name: string;

  /**
   * Action that should be performed on click (instead of href)
   */
  action: () => any;

  /**
   * The href of the link
   */
  href: string;
}

/**
 * Header link extends the header link with a  flag for disabling the logo
 */
export class AppHeaderLink implements IHeaderLink {
  public name: string = 'Caleydo Web';
  public action: () => any = () => false;
  public href: string = '#';
  public addLogo: boolean = true;

  constructor(name?, action?, href?, addLogo?) {
    if (name) {
      this.name = name;
    }

    if (action) {
      this.action = action;
    }

    if (href) {
      this.href = href;
    }

    if (addLogo) {
      this.addLogo = addLogo;
    }
  }
}

/**
 * Helper function to create a list item for the header menus
 * @param name
 * @param action
 * @param href
 * @returns {HTMLElement}
 */
function createLi(name: string, action: () => any, href: string = '#') {
  const li = <HTMLElement>document.createElement('li');
  li.innerHTML = `<a href="${href}">${name}</a>`;
  if (action) {
    (<HTMLElement>li.querySelector('a')).onclick = action;
  }
  return li;
}

export interface IAppHeaderOptions {
  /**
   * insert as first-child or append as child node to the given parent node
   * default: true
   */
  prepend?: boolean;

  /**
   * color scheme: bright (= false) or dark (= true)
   * default: false
   */
  inverse?: boolean;

  /**
   * the app link with the app name
   */
  appLink?: AppHeaderLink;

  /**
   * a list of links that should be shown in the main menu
   */
  mainMenu?: IHeaderLink[];

  /**
   * a list of links that should be shown in the right menu
   */
  rightMenu?: IHeaderLink[];

  /**
   * show/hide the options link
   * default: false
   */
  showOptionsLink?: boolean;

  /**
   * show/hide the bug report link
   * default: true
   */
  showReportBugLink?: boolean;
}

/**
 * The Caleydo App Header provides an app name and customizable menus
 */
export class AppHeader {

  /**
   * Default options that can be overridden in the constructor
   * @private
   */
  private options: IAppHeaderOptions = {
    /**
     * insert as first-child or append as child node to the given parent node
     */
    prepend: true,

    /**
     * color scheme: bright (= false) or dark (= true)
     */
    inverse: false,

    /**
     * @DEPRECATED use `appLink.name` instead
     */
    //app: 'Caleydo Web',

    /**
     * @DEPRECATED use `appLink.addLogo` instead
     */
    //addLogo: true,

    /**
     * the app link with the app name
     */
    appLink: new AppHeaderLink(),

    /**
     * a list of links that should be shown in the main menu
     */
    mainMenu: <IHeaderLink[]>[],

    /**
     * a list of links that should be shown in the right menu
     */
    rightMenu: <IHeaderLink[]>[],

    /**
     * show/hide the options link
     */
    showOptionsLink: false,

    /**
     * show/hide the bug report link
     */
    showReportBugLink: true
  };

  /**
   * Main menu is positioned next to the app name
   */
  mainMenu: HTMLElement;

  /**
   * Right menu is positioned to the right of the document
   */
  rightMenu: HTMLElement;

  /**
   * About dialog
   */
  aboutDialog: HTMLElement;

  /**
   * Options dialog
   */
  optionsDialog: HTMLElement;

  /**
   * Constructor overrides the default options with the given options
   * @param parent
   * @param options
   */
  constructor(private parent: HTMLElement, options: IAppHeaderOptions = {}) {
    mixin(this.options, options);
    this.build();
  }

  private build() {
    // legacy support
    if ((<any>this.options).app !== undefined && this.options.appLink === undefined) {
      this.options.appLink.name = (<any>this.options).app;
    }
    if ((<any>this.options).addLogo !== undefined && !this.options.appLink === undefined) {
      this.options.appLink.addLogo = (<any>this.options).addLogo;
    }

    // create the content and copy it in the parent
    const helper = document.createElement('div');
    helper.innerHTML = String(template);
    while (helper.lastChild) {
      this.parent.insertBefore(helper.lastChild, this.parent.firstChild);
    }

    // use the inverse color scheme
    if (this.options.inverse) {
      (<HTMLElement>this.parent.querySelector('nav.navbar')).classList.add('navbar-inverse');
    }

    // modify app header link
    const appLink = (<HTMLElement>this.parent.querySelector('*[data-header="appLink"]'));

    appLink.innerHTML = this.options.appLink.name;
    appLink.onclick = this.options.appLink.action;
    appLink.setAttribute('href', this.options.appLink.href);

    if (this.options.appLink.addLogo) {
      appLink.classList.add('caleydo_app');
    }

    this.mainMenu = <HTMLElement>this.parent.querySelector('*[data-header="mainMenu"]');
    this.rightMenu = <HTMLElement>this.parent.querySelector('*[data-header="rightMenu"]');
    this.aboutDialog = <HTMLElement>this.parent.querySelector('*[data-header="about"]');
    this.optionsDialog = <HTMLElement>this.parent.querySelector('*[data-header="options"]');

    // show/hide links
    this.toggleOptionsLink(this.options.showOptionsLink);
    this.toggleAboutLink(true); // always visible
    this.toggleReportBugLink(this.options.showReportBugLink);

    // request last deployment data
    Promise.resolve(getAPIJSON(`/last_deployment`, {})).then((msg) => {
      if (msg.timestamp) {
        this.aboutDialog.querySelector('.lastDeployment span').textContent = new Date(msg.timestamp).toUTCString();
      }
    });

    this.options.mainMenu.forEach((l) => this.addMainMenu(l.name, l.action, l.href));
    this.options.rightMenu.forEach((l) => this.addRightMenu(l.name, l.action, l.href));
  }

  addMainMenu(name: string, action: () => any, href = '#') {
    const li = createLi(name, action, href);
    this.mainMenu.appendChild(li);
    return li;
  }

  addRightMenu(name: string, action: () => any, href = '#') {
    const li = createLi(name, action, href);
    this.rightMenu.insertBefore(li, this.rightMenu.firstChild);
    return li;
  }

  insertCustomMenu(element: Element) {
    this.rightMenu.parentElement.insertBefore(element, this.rightMenu);
  }

  insertCustomRightMenu(element: Element) {
    this.rightMenu.parentElement.appendChild(element);
  }

  wait() {
    AppHeader.setVisibility(<HTMLElement>document.querySelector('#headerWaitingOverlay'), true);
    //$('#headerWaitingOverlay').fadeIn();
  }

  ready() {
    AppHeader.setVisibility(<HTMLElement>document.querySelector('#headerWaitingOverlay'), false);
    //$('#headerWaitingOverlay').fadeOut();
  }

  private static setVisibility(element: HTMLElement, isVisible: boolean) {
    if (isVisible) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }

  toggleOptionsLink(isVisible: boolean) {
    const link = <HTMLElement>this.parent.querySelector('*[data-header="optionsLink"]');
    AppHeader.setVisibility(link, isVisible);
  }

  toggleReportBugLink(isVisible: boolean) {
    const link = <HTMLElement>this.parent.querySelector('*[data-header="bugLink"]');
    AppHeader.setVisibility(link, isVisible);

    // set the URL to GitHub issues dynamically
    if (isVisible) {
      $('#headerReportBugDialog').on('show.bs.modal', () => {
        const content = <HTMLElement>this.parent.querySelector('*[data-header="bug"]');
        content.innerHTML = 'Loading...';
        buildBuildInfo().then((buildInfo) => {
          content.innerHTML = buildInfo.toHTML();
        }).catch((error) => {
          content.innerHTML = error.toString();
        });
      });
    }
  }

  private toggleAboutLink(isVisible: boolean) {
    const link = <HTMLElement>this.parent.querySelector('*[data-header="aboutLink"]');
    AppHeader.setVisibility(link, isVisible);
  }
}

export function create(parent: HTMLElement, options: IAppHeaderOptions = {}) {
  return new AppHeader(parent, options);
}
