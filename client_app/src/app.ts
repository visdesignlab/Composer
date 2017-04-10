/**
 * Created by Caleydo Team on 31.08.2016.
 */

import {select} from 'd3-selection';
//import * as drawPlots from './drawPlots'
import * as printLogs from './printLogs'
import * as svgTable from './svgTable';
import * as queryBox from './queryBox'
import * as sideBar from './sideBar';

/**
 * The main class for the App app
 */
export class App {

  private $node;

  constructor(parent: Element) {
    this.$node = select(parent);
  }

  /**
   * Initialize the view and return a promise
   * that is resolved as soon the view is completely initialized.
   * @returns {Promise<App>}
   */
  init() {
    return this.build();
  }

  /**
   * Load and initialize all necessary views
   * @returns {Promise<App>}
   */
  private async build() {

    //let dp = drawPlots.create(this.$node.node());
    //await dp.run();

    //let pl = printLogs.create('Demo');
    //await pl.runLogs();
    //await pl.runDemo();
    //await pl.runRemove("clinical_2");  // Not Working!
    //await pl.showInfo();

    this.$node.select('h3').remove();

    let sideBarDiv = this.$node.append("div").classed("sideBar", true);
    let side = sideBar.create(sideBarDiv.node());
    await side.init();

    let main = this.$node.append("div").classed("main", true);

    queryBox.create(main.node(), 'Demo');

    main.append("h3").text("Demo");
    let table_demo = main.append("div");
    main.append("h3").text("PRO");
    let table_pro = main.append("div");
    main.append("h3").text("PT");
    let table_pt = main.append("div");
    main.append("h3").text("VAS");
    let table_vas = main.append("div");
    main.append("h3").text("CCI");
    let table_cci = main.append("div");
    main.append("h3").text("Codes");
    let table_codes = main.append("div");
    main.append("h3").text("Orders");
    let table_orders = main.append("div");

    let svg_table_demo = svgTable.create(table_demo.node());
    let svg_table_pro = svgTable.create(table_pro.node());
    let svg_table_pt = svgTable.create(table_pt.node());
    let svg_table_vas = svgTable.create(table_vas.node());
    let svg_table_cci = svgTable.create(table_cci.node());
    let svg_table_codes = svgTable.create(table_codes.node());
    let svg_table_orders = svgTable.create(table_orders.node());


    await svg_table_demo.drawTable('Demo');
    await svg_table_pro.drawTable('PRO');
    await svg_table_pt.drawTable('PT');
    await svg_table_vas.drawTable('VAS');
    await svg_table_cci.drawTable('CCI');
    await svg_table_codes.drawTable('Codes');
    await svg_table_orders.drawTable('Orders');

    this.setBusy(false);
  }

  /**
   * Show or hide the application loading indicator
   * @param isBusy
   */
  setBusy(isBusy: boolean) {
    this.$node.select('.busy').classed('hidden', !isBusy);
  }

}

/**
 * Factory method to create a new app instance
 * @param parent
 * @returns {App}
 */
export function create(parent:Element) {
  return new App(parent);
}
