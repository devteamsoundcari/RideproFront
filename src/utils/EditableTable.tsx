import React, { createRef } from "react";
import {
  Table,
  Button,
  Overlay,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import ContentEditable from "react-contenteditable";

interface Error {
  id: number;
  column: string;
  type: string;
  message: string;
}

interface InsertionRowError {
  column: string;
  type: string;
  message: string;
}

export class EditableTable extends React.Component<
  {
    dataSet: any[];
    forbidden: any[];
    fields: any;
    onValidate: Function;
    onUpdate: Function;
  },
  {
    dataSet: any[];
    errors: Error[];
    insertionRow: Map<string, string>;
    insertionRowErrors: InsertionRowError[];
    displayErrors: Map<string, boolean>;
  }
> {
  private firstRow: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);

    let rowKeys = Object.keys(props.fields);
    let insertionRow = new Map<string, string>();
    let headings = new Map<string, boolean>();
    rowKeys.forEach((field: any) => {
      headings.set(field, false);
    });
    rowKeys.forEach((field: any) => {
      insertionRow.set(field, "");
    });

    let dataSet = [...props.dataSet].map((record: any, index: number) => {
      for (let key in record) {
        record[key] = String(record[key]);
      }
      return { id: index, readOnly: false, data: record };
    });

    this.state = {
      dataSet: dataSet,
      errors: [],
      insertionRow: insertionRow,
      insertionRowErrors: [],
      displayErrors: headings,
    };

    this.firstRow = createRef();
  }

  validate(row: any, fieldName: string) {
    const field = this.props.fields[fieldName];
    const regex = field.regex;
    let idx: number;

    if (
      regex !== null &&
      row.data[fieldName] !== "" &&
      !row.data[fieldName].match(regex)
    ) {
      let err: Error;

      idx = this.state.errors.findIndex(
        (e: Error) => e.id === row.id && e.type === "regex"
      );
      if (idx < 0) {
        err = {
          id: row.id,
          column: fieldName,
          type: "regex",
          message: this.props.fields[fieldName].errorMessages.regex,
        };
        this.state.errors.push(err);
      }
    } else {
      idx = this.state.errors.findIndex(
        (e: Error) => e.id === row.id && e.type === "regex"
      );
      if (idx >= 0) {
        this.state.errors.splice(idx);
      }
    }
    this.props.onValidate(this.state.errors.length <= 0 ? true : false);
  }

  checkDuplicates(row: any, fieldName: string) {
    let idx: number;

    if (
      this.state.dataSet.find(
        (r: any) => r.id !== row.id && r.data[fieldName] === row.data[fieldName]
      )
    ) {
      let err: Error;

      idx = this.state.errors.findIndex(
        (e: Error) => e.id === row.id && e.type === "unique"
      );
      if (idx < 0) {
        err = {
          id: row.id,
          column: fieldName,
          type: "unique",
          message: this.props.fields[fieldName].errorMessages.unique,
        };
        this.state.errors.push(err);
      }
    } else {
      idx = this.state.errors.findIndex(
        (e: Error) => e.id === row.id && e.type === "unique"
      );
      if (idx >= 0) {
        this.state.errors.splice(idx);
      }
    }

    this.props.onValidate(this.state.errors.length <= 0 ? true : false);
  }

  getErrors(id: number, field: string) {
    const errors = this.state.errors.filter(
      (err: Error) => err.id === id && err.column === field
    );

    return errors;
  }

  validateInsertionRow() {
    const { insertionRow, insertionRowErrors } = this.state;

    for (let key of Array.from(insertionRow.keys())) {
      const field = this.props.fields[key];
      const regex = field.regex;
      if (regex === null) {
        continue;
      }

      let idx: number;

      if (
        regex !== null &&
        insertionRow.get(key) !== "" &&
        !insertionRow.get(key)?.match(regex)
      ) {
        let err: InsertionRowError;

        idx = insertionRowErrors.findIndex(
          (e: InsertionRowError) => e.column === key && e.type === "regex"
        );
        if (idx < 0) {
          err = {
            column: key,
            type: "regex",
            message: this.props.fields[key].errorMessages.regex,
          };
          insertionRowErrors.push(err);
        }
      } else {
        idx = insertionRowErrors.findIndex(
          (e: InsertionRowError) => e.column === key && e.type === "regex"
        );
        if (idx >= 0) {
          insertionRowErrors.splice(idx);
        }
      }
    }

    this.showInsertionRowErrors();
  }

  checkInsertionRowDuplicates() {
    const { insertionRow, insertionRowErrors } = this.state;

    for (let field of Array.from(insertionRow.keys())) {
      let idx: number;

      if (insertionRow.get(field) !== "") {
        if (
          this.state.dataSet.find(
            (r: any) => r.data[field] === insertionRow.get(field)
          )
        ) {
          let err: InsertionRowError;

          idx = insertionRowErrors.findIndex(
            (e: InsertionRowError) => e.column === field && e.type === "unique"
          );
          if (idx < 0) {
            err = {
              column: field,
              type: "unique",
              message: this.props.fields[field].errorMessages.unique,
            };
            insertionRowErrors.push(err);
          }
        } else {
          idx = insertionRowErrors.findIndex(
            (e: InsertionRowError) => e.column === field && e.type === "unique"
          );
          if (idx >= 0) {
            insertionRowErrors.splice(idx);
          }
        }
      }
    }
  }

  showInsertionRowErrors() {
    let ins = this.state.displayErrors;

    ins.forEach((value: boolean, key: string, map: Map<string, boolean>) =>
      map.set(key, false)
    );

    for (let err of this.state.insertionRowErrors) {
      ins.set(err.column, true);
    }

    this.setState((current) => ({
      ...current,
      displayErrors: ins,
    }));
  }

  getInsertionRowErrors(field: string) {
    const errors = this.state.insertionRowErrors.filter(
      (err: InsertionRowError) => err.column === field
    );

    return errors;
  }

  deleteRow(id: number) {
    this.setState(
      (current) => ({
        ...current,
        dataSet: this.state.dataSet.filter((item: any) => id !== item.id),
      }),
      () => {
        this.updateDataSetProp();
      }
    );
  }

  handleNewRow(event: any) {
    const {
      currentTarget: {
        dataset: { column },
      },
      target: { value },
    } = event;

    this.state.insertionRow.set(column, value);

    this.validateInsertionRow();
  }

  handleRow(event: any) {
    const { dataSet } = this.state;
    const {
      currentTarget: {
        dataset: { column },
        dataset: { id },
      },
      target: { value },
    } = event;
    const prevDataSet = [...dataSet];

    const row = prevDataSet.find((item: any) => item.id === parseInt(id));
    row.data[column] = value;

    this.setState(
      (current) => ({
        ...current,
        dataSet: prevDataSet,
      }),
      () => {
        this.validate(row, column);
        if (this.props.fields[column].unique === true) {
          this.checkDuplicates(row, column);
        }
        this.updateDataSetProp();
      }
    );
  }

  handleClickOnInsertionRow(event: any) {
    const {
      currentTarget: {
        dataset: { column },
      },
      target: { value },
    } = event;

    return this.isInsertionFieldIncorrect(column);
  }

  isIncorrect(row: number, field: any) {
    let err = this.state.errors.find(
      (e: Error) => e.id === row && e.column === field
    );

    return err ? true : false;
  }

  isInsertionFieldIncorrect(field: any) {
    let err = this.state.insertionRowErrors.find(
      (e: InsertionRowError) => e.column === field
    );

    return err ? true : false;
  }

  isInsertionRowIncorrect() {
    return this.state.insertionRowErrors.length === 0 ? false : true;
  }

  isInsertionRowEmpty() {
    let isEmpty: boolean = true;

    this.state.insertionRow.forEach(
      (value: string, key: string, map: Map<string, string>) =>
        (isEmpty = map.get(key) === "")
    );

    return isEmpty;
  }

  addRow() {
    const dataSet = [...this.state.dataSet];
    let data = Array.from(this.state.insertionRow).reduce(
      (obj: any, [key, value]) => {
        obj[key] = this.trimSpaces(value);
        return obj;
      },
      {}
    );
    dataSet.unshift({
      id: dataSet.length + 1,
      readOnly: false,
      data: data,
    });

    this.setState(
      (current) => ({
        ...current,
        dataSet: dataSet,
      }),
      () => {
        this.updateDataSetProp();
      }
    );

    this.state.insertionRow.forEach(
      (value: string, key: string, map: Map<string, string>) => map.set(key, "")
    );

    this.firstRow.current!.focus();
  }

  updateDataSetProp() {
    const dataSet = JSON.parse(JSON.stringify(this.state.dataSet));

    this.props.onUpdate(
      this.state.dataSet.map((record) => {
        for (let field in record.data) {
          switch (this.props.fields[field].format) {
            case "string":
              break;
            case "number":
              record.data[field] = parseInt(record.data[field]);
              break;
            default:
              break;
          }
        }
        return record.data;
      })
    );

    this.setState((current) => ({
      ...current,
      dataSet: dataSet,
    }));
  }

  pasteAsPlainText(event: any) {
    event.preventDefault();

    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }

  trimSpaces(str: string) {
    return str
      .replace(/&nbsp;/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<");
  }

  disableNewlines(event: any) {
    const keyCode = event.keyCode || event.which;

    if (keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) event.preventDefault();
    }
  }

  highlightAll(event: any) {
    const keyCode = event.keyCode || event.which || event.char;

    if (keyCode === 9) {
      setTimeout(() => {
        document.execCommand("selectAll", false, null!);
      }, 0);
    }
  }

  render() {
    let ConditionalWrapper = ({ condition, wrapper, children }) =>
      condition ? wrapper(children) : children;

    let headers = Object.keys(this.props.fields).map((name: string) => {
      return <th key={name}>{this.props.fields[name].name}</th>;
    });

    let InsertButton = (props: any) => {
      return (
        <Button
          variant="link"
          onClick={() => this.addRow()}
          disabled={
            this.isInsertionRowIncorrect() || this.isInsertionRowEmpty()
          }
        >
          <FaPlus />
        </Button>
      );
    };

    let insertionRow = Array.from(this.state.insertionRow.keys()).map(
      (field, index) => {
        let props: any = {
          innerRef: this.firstRow,
        };

        if (index !== 0) {
          props = {};
        }

        return (
          <td
            key={field}
            className={this.isInsertionFieldIncorrect(field) ? "incorrect" : ""}
          >
            <ContentEditable
              data-tip
              data-for={`ir-${field}`}
              data-event="focus keyup"
              data-event-off="blur"
              {...props}
              html={this.state.insertionRow.get(field)!}
              data-column={field}
              className="new-row"
              onChange={this.handleNewRow.bind(this)}
              onPaste={this.pasteAsPlainText}
              onKeyPress={this.disableNewlines}
              onFocus={this.highlightAll}
            />
            {this.isInsertionFieldIncorrect(field) && (
              <ReactTooltip id={`ir-${field}`} type="error" effect="solid">
                <h6>Error</h6>
                {this.getInsertionRowErrors(field).map(
                  (e: InsertionRowError) => {
                    return e.message;
                  }
                )}
              </ReactTooltip>
            )}
          </td>
        );
      }
    );

    let insertedRows = this.state.dataSet.map((row: any) => {
      return (
        <tr key={row.id}>
          {Object.keys(row.data)
            .filter((field: any) => field !== "id")
            .map((field) => {
              return (
                <td
                  key={field}
                  className={this.isIncorrect(row.id, field) ? "incorrect" : ""}
                >
                  <ContentEditable
                    data-tip
                    data-for={`row-${row.id}-${field}`}
                    data-event="focus keyup"
                    data-event-off="blur"
                    html={String(row.data[field])}
                    className="content-editable"
                    data-column={field}
                    data-id={row.id}
                    onChange={this.handleRow.bind(this)}
                    onPaste={this.pasteAsPlainText}
                    onKeyPress={this.disableNewlines}
                    onFocus={this.highlightAll}
                  />
                  {this.isIncorrect(row.id, field) && (
                    <ReactTooltip
                      id={`row-${row.id}-${field}`}
                      type="error"
                      effect="solid"
                    >
                      <h6>Error</h6>
                      {this.getErrors(row.id, field).map((e: Error) => {
                        return e.message;
                      })}
                    </ReactTooltip>
                  )}
                </td>
              );
            })}
          <td>
            <Button variant="link" onClick={() => this.deleteRow(row.id)}>
              <FaTimes />
            </Button>
          </td>
        </tr>
      );
    });

    return (
      <Table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          <tr>
            {insertionRow}
            <InsertButton />
          </tr>
          {insertedRows}
        </tbody>
      </Table>
    );
  }
}
