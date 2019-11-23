import { css } from 'lit-element'

export const dataReportBodyStyle = css`
  :host {
    display: grid;
    grid-template-columns: var(--report-template-columns);
    grid-auto-rows: var(--report-record-height, min-content);

    overflow: auto;
    outline: none;
  }

  :host > [focused] {
    border: var(--report-record-focused-border);
  }

  :host > [focused-row] {
    background-color: var(--report-record-focused-background-color);
    color: var(--report-record-focused-color);
  }

  :host > [totalized] {
    background-color: lightgray;
  }

  @media print {
    :host {
      grid-template-columns: var(--report-template-print-columns);
    }
    :host > [focused] {
      border: none;
    }

    :host > [focused-row] {
      background-color: transparent;
      color: initial;
    }
  }
`
