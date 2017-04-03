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

    let query_box = queryBox.create(main.node(), 'Demo');

    main.append("h3").text("Demo");
    let table1 = main.append("div");
    main.append("h3").text("PRO");
    let table2 = main.append("div");
    main.append("h3").text("PT");
    let table3 = main.append("div");
    main.append("h3").text("VAS");
    let table4 = main.append("div");

    let svg_table1 = svgTable.create(table1.node());
    let svg_table2 = svgTable.create(table2.node());
    let svg_table3 = svgTable.create(table3.node());
    let svg_table4 = svgTable.create(table4.node());

    // TODO: replace with events.fire and .on
    query_box.set_svg_table(svg_table1, svg_table2, svg_table3, svg_table4);

    await svg_table1.drawTable('Demo');
    await svg_table2.drawTable('PRO');
    await svg_table3.drawTable('PT');
    await svg_table4.drawTable('VAS');

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
