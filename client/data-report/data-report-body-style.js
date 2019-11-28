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
    background-color: rgba(115, 188, 28, 0.1);
    font-weight: 700;
    color: var(--report-totalized-color);
  }

  :host > [grouped] {
    background-color: #607d8bbf;
    color: #fff;
    border-right: 1px solid rgba(0, 0, 0, 0.3);
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
