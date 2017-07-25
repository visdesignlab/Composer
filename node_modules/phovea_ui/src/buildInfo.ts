/**
 * Created by Samuel Gratzl on 21.11.2016.
 */

export class BuildInfo {
  constructor(private buildInfo: any) {

  }

  toString() {
    return 'BuildInfo';
  }

  private buildBuildInfo() {
    const build = this.buildInfo;
    return `<table class="table table-bordered table-condensed">
            <tbody>
              <tr><th>Application</th><td>${build.name}</td></tr>
              <tr><th>Version</th><td>${build.version}</td></tr>
              <tr><th>Url</th><td><code>${location.pathname}${location.hash}</code></td></tr>
              <tr><th>UserAgent</th><td>${navigator.userAgent}</td></tr>
              <tr><th>GitHub</th><td><a href="${build.resolved.replace(/\.git.*/, '/issues/new')}" target="_blank">Submit Issue (include the build details below)</a></td></tr>
            </tbody>
            </table>`;
  }

  private buildIssuesContent() {
    // don't use location.href, since I don't wanna expose server names
    return `
Key | Value
--- | -----
Application | ${this.buildInfo.name}
Version | [${this.buildInfo.version}](${this.buildInfo.resolved.replace('.git#','/commit/')})
Url | \`${location.pathname}${location.hash}\`
UserAgent | ${navigator.userAgent}
Platform | ${navigator.platform}
Screen Size | ${screen.width} x ${screen.height}
Window Size | ${window.innerWidth} x ${window.innerHeight}
      
~~~json\n${JSON.stringify(this.buildInfo, null, ' ')}\n~~~`;
  }

  toHTML() {
    return `
      <h4>Build Info</h4>
      ${this.buildBuildInfo()}
      <h4>Build Details</h4>
      <textarea readonly="readonly">${this.buildIssuesContent()}</textarea>
    `;
  }
}

export default function build(): Promise<BuildInfo> {
  return (<any>self).fetch('./buildInfo.json').then((response) => response.json()).then((result: any) => new BuildInfo(result));
}
