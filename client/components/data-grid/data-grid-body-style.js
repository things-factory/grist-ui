import { css } from 'lit-element'

export const dataGridBodyStyle = css`
  :host {
    display: grid;
    grid-template-columns: var(--grid-template-columns);
    grid-auto-rows: var(--grid-record-height, min-content);

    overflow: auto;
    outline: none;
  }

  :host > [odd] {
    background-color: var(--grid-record-odd-background-color, #eee);
  }

  :host > [focused] {
    border: 1px dotted rgba(0, 0, 0, 0.5);
  }

  :host > [selected-row] {
    background-color: var(--grid-record-selected-background-color, orange);
  }

  :host > [focused-row] {
    background-color: var(--grid-record-focused-background-color, tomato);
  }

  :host > [editing] {
    background-color: var(--grid-record-editor-background-color, transparent);
  }
`
