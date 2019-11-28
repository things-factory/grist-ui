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
  }

  :host > [totalized] {
    background-color: var(--report-totalized-background-color);
    border-bottom: var(--report-totalized-border-bottom);
    color: var(--report-totalized-color);

    font-weight: 700;
  }

  :host > [grouped] {
    background-color: #607d8bbf;
    border-right: var(--report-grouped-border);
    border-bottom: var(--report-grouped-border);
    color: var(--report-grouped-color);

    font-weight: 600;
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
