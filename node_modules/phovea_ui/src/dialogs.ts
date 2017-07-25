/**
 * Created by Samuel Gratzl on 19.11.2015.
 */

import './_bootstrap';
import * as $ from 'jquery';
import {mixin} from 'phovea_core/src';

export function generateDialog(title: string, primaryBtnText='OK') {
  const dialog = document.createElement('div');
  dialog.setAttribute('role','dialog');
  dialog.classList.add('modal','fade');
  dialog.innerHTML = `
     <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title">${title}</h4>
        </div>
        <div class="modal-body">

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default btn-primary">${primaryBtnText}</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(dialog);
  const $dialog = $(dialog);
  const r = {
    _restoreKeyDownListener: null, // temporal for restoring an old keydown listener
    show: () => {
      r._restoreKeyDownListener = document.onkeydown;
      document.onkeydown = (evt) => {
        evt = evt || <KeyboardEvent>window.event;
        if (evt.keyCode === 27) { // 27 === ESC key
          r.hide();
        }
      };
      return (<any>$dialog).modal('show');
    },
    hide: () => {
      document.onkeydown = r._restoreKeyDownListener;
      return (<any>$dialog).modal('hide');
    },
    body: <HTMLElement>dialog.querySelector('.modal-body'),
    footer: <HTMLElement>dialog.querySelector('.modal-footer'),
    onHide: (callback: ()=>void) => $dialog.on('hidden.bs.modal', callback),
    onSubmit: (callback: ()=>void) => (<HTMLElement>dialog.querySelector('.modal-footer > button')).onclick = callback,
    destroy: () => $dialog.remove()
  };
  return r;
}

export function msg(text: string, category='info'): Promise<void> {
  return new Promise<void>((resolve) => {
    const div = $(`<div class="alert alert-${category} alert-dismissible fade in" role="alert">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
        ${text}
    </div>`).appendTo('body');
    div.on('closed.bs.alert', () => resolve);
    (<any>div).alert();
  });
}

/**
 * simple prompt dialog
 * @param text
 * @param options
 * @returns {Promise}
 */
export function prompt(text:string,  options :any = {}):Promise<string> {
  var o = {
    title: 'Input',
    placeholder: 'Enter...',
    multiline: false
  };
  if (typeof options === 'string') {
    options = { title: options};
  }
  mixin(o, options);
  return new Promise((resolve) => {
    var dialog = generateDialog(o.title);
    if (o.multiline) {
      dialog.body.innerHTML = `<form><textarea class="form-control" rows="5" placeholder="${o.placeholder}" autofocus="autofocus">${text}</textarea></form>`;
    } else {
      dialog.body.innerHTML = `<form><input type="text" class="form-control" value="${text}" autofocus="autofocus" placeholder="${o.placeholder}"></form>`;
    }
    (<HTMLFormElement>dialog.body.querySelector('form')).onsubmit = () => {
      dialog.hide();
      return false;
    };
    dialog.onHide(() => {
      resolve((<HTMLInputElement>dialog.body.querySelector('input, textarea')).value);
      dialog.destroy();
    });
    dialog.show();
  });
}

/**
 * simple choose dialog
 * @param items
 * @param options
 * @returns {Promise}
 */
export function choose(items:string[], options :any = {}):Promise<string> {
  var o = {
    title :  'Choose',
    placeholder: 'Enter...',
    editable: false
  };
  if (typeof options === 'string') {
    options = { title: options};
  }
  mixin(o, options);

  return new Promise((resolve) => {
    var dialog = generateDialog(o.title);
    const option = items.map((d) =>`<option value="${d}">${d}</option>`).join('\n');
    if (o.editable) {
      dialog.body.innerHTML = `<form><input type="text" list="chooseList" class="form-control" autofocus="autofocus" placeholder="${o.placeholder}">
        <datalist id="chooseList">${option}</datalist>
      </form>`;
    } else {
      dialog.body.innerHTML = `<form><select class="form-control">${option}</select></form>`;
    }

    (<HTMLFormElement>dialog.body.querySelector('form')).onsubmit = () => {
      dialog.hide();
      return false;
    };
    dialog.onHide(() => {
      if (options.editable) {
        resolve((<HTMLInputElement>dialog.body.querySelector('input')).value);
      } else {
        resolve(items[(<HTMLSelectElement>dialog.body.querySelector('select')).selectedIndex]);
      }
      dialog.destroy();
    });
    dialog.show();
  });
}

export function areyousure(msg: string = '', options :any = {}):Promise<boolean> {
  var o = {
    title : 'Are you sure?',
    button: `<i class="fa fa-trash" aria-hidden="true"></i> Delete`
  };
  if (typeof options === 'string') {
    options = { title: options};
  }
  mixin(o, options);

  return new Promise((resolve) => {
    var dialog = generateDialog(o.title, 'Cancel');
    dialog.body.innerHTML = msg;
    $(`<button class="btn btn-danger">${o.button}</button>`).appendTo(dialog.footer);
    var clicked = false;
    $(dialog.footer).find('button.btn-primary').on('click', function() {
      dialog.hide();
    });
    $(dialog.footer).find('button.btn-danger').on('click', function() {
      clicked = true;
      dialog.hide();
    });
    dialog.onHide(() => {
      dialog.destroy();
      resolve(clicked);
    });
    dialog.show();
  });
}
