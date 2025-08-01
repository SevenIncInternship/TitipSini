declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: any;
    jsPDF?: any;
    pagebreak?: any;
  }

  interface Html2PdfInstance {
    from(element: HTMLElement | string): this;
    set(options: Html2PdfOptions): this;
    save(): Promise<void>;
    outputPdf(type?: string): any;
  }

  export default function html2pdf(): Html2PdfInstance;
}
