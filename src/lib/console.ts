export class Console {

  constructor(private textarea: HTMLTextAreaElement) {
    this.textarea = textarea
  }

  log(txt: string, type?: string) {
    if ( type ) this.textarea.value += type + " ";
    this.textarea.value += txt + "\n";
  }
  logN() {
    this.textarea.value +=  "\n";
  }

  logNL() {
    this.textarea.value +=  "\n==============================================\n";
  }

  logJSON(o:any) {
    this.textarea.value += JSON.stringify(o)
  }

  error = function(txt: string) {
    this.log(txt, "ERROR!");
  }

}