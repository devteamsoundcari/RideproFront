import React, { createRef } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import ReactTooltip from "react-tooltip";

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
    size: string;
    dataSet: any[];
    fields: any;
    readOnly: boolean;
    readOnlyIf: Function;
    onValidate: Function;
    onUpdate: Function;
    recordToAdd: any[];
    recordsForReplacing: any[];
  },
  {
    dataSet: any[];
    errors: Error[];
    insertionRow: Map<string, string>;
    insertionRowErrors: InsertionRowError[];
    displayErrors: Map<string, boolean>;
    autoIncrement: number;
  }
> {
  private firstRow: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);

    let rowKeys = Object.keys(props.fields);
    let insertionRow = new Map<string, string>();
    let headings = new Map<string, boolean>();
    rowKeys.forEach((field: any) => {
      if (field in this.props.fields) {
        if (!this.props.fields[field].hidden) {
          headings.set(field, false);
          insertionRow.set(field, "");
        }
      }
    });

    let dataSet = [...props.dataSet].map((record: any, index: number) => {
      let newRecord: any = {};

      for (let key in record) {
        if (key in this.props.fields) {
          newRecord[key] = String(record[key]);
        }
      }
      return {
        id: index,
        readOnly: this.props.readOnly || false,
        data: newRecord,
      };
    });

    this.state = {
      dataSet: dataSet,
      errors: [],
      insertionRow: insertionRow,
      insertionRowErrors: [],
      displayErrors: headings,
      autoIncrement: dataSet.length + 1,
    };

    this.firstRow = createRef();
  }

  validate(row: any, fieldName: string) {
    let errors = [...this.state.errors];

    this.checkRegex(row, fieldName, errors);
    this.checkEmptyValues(row, fieldName, errors);
    if (this.props.fields[fieldName].unique) {
      this.checkDuplicates(row, fieldName, errors);
      this.clearDuplicates(fieldName, errors);
    }

    this.setState(
      (current) => ({
        ...current,
        errors: errors,
      }),
      () => {
        this.props.onValidate(this.state.errors.length <= 0 ? true : false);
      }
    );
  }

  checkRegex(row: any, fieldName: string, errors: Array<Error>) {
    const field = this.props.fields[fieldName];
    const regex = field.regex;
    let idx: number;

    if (
      regex !== null &&
      row.data[fieldName] !== "" &&
      !row.data[fieldName].match(regex)
    ) {
      let err: Error;

      idx = errors.findIndex(
        (e: Error) =>
          e.id === row.id && e.type === "regex" && e.column === fieldName
      );
      if (idx < 0) {
        err = {
          id: row.id,
          column: fieldName,
          type: "regex",
          message: this.props.fields[fieldName].errorMessages.regex,
        };
        errors.push(err);
      }
    } else {
      idx = errors.findIndex(
        (e: Error) =>
          e.id === row.id && e.type === "regex" && e.column === fieldName
      );
      if (idx >= 0) {
        errors.splice(idx, 1);
      }
    }
  }

  checkEmptyValues(row: any, fieldName: string, errors: Array<Error>) {
    let idx: number;

    if (row.data[fieldName] === "") {
      let err: Error;

      idx = errors.findIndex(
        (e: Error) =>
          e.id === row.id && e.type === "empty" && e.column === fieldName
      );
      if (idx < 0) {
        err = {
          id: row.id,
          column: fieldName,
          type: "empty",
          message: "Este valor no debe ser vacío.",
        };
        errors.push(err);
      }
    } else {
      idx = errors.findIndex(
        (e: Error) =>
          e.id === row.id && e.type === "empty" && e.column === fieldName
      );
      if (idx >= 0) {
        errors.splice(idx, 1);
      }
    }
  }

  checkDuplicates(row: any, fieldName: string, errors: Array<Error>) {
    let idx: number;

    if (
      this.state.dataSet.find(
        (r: any) =>
          r.id !== row.id &&
          r.data[fieldName] === row.data[fieldName] &&
          r.data[fieldName] !== ""
      )
    ) {
      let err: Error;

      idx = errors.findIndex(
        (e: Error) => e.id === row.id && e.type === "unique"
      );
      if (idx < 0) {
        err = {
          id: row.id,
          column: fieldName,
          type: "unique",
          message: this.props.fields[fieldName].errorMessages.unique,
        };
        errors.push(err);
      }
    } else {
      idx = errors.findIndex(
        (e: Error) => e.id === row.id && e.type === "unique"
      );
      if (idx >= 0) {
        errors.splice(idx, 1);
      }
    }
  }

  clearDuplicates(fieldName: string, errors: Array<Error>) {
    let dataSet = [...this.state.dataSet];
    for (let record of dataSet) {
      let filtered = dataSet.filter(
        (r: any) => r.data[fieldName] === record.data[fieldName]
      );
      if (filtered.length === 1) {
        let errorIndex = errors.findIndex(
          (e: Error) => e.id === record.id && e.type === "unique"
        );
        if (errorIndex >= 0) {
          errors.splice(errorIndex, 1);
        }
      }
    }
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

  checkInsertionRowDuplicates(field: string) {
    const { insertionRow, insertionRowErrors } = this.state;

    let idx: number;

    if (
      insertionRow.get(field) !== "" &&
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

  removeErrors(id: number) {
    this.setState(
      (current) => ({
        ...current,
        errors: this.state.errors.filter((err: Error) => id !== err.id),
      }),
      () => {
        this.onDataSetValidation();
      }
    );
  }

  deleteRow(id: number) {
    this.setState(
      (current) => ({
        ...current,
        dataSet: this.state.dataSet.filter((item: any) => id !== item.id),
      }),
      () => {
        this.onDataSetUpdate();
        this.removeErrors(id);
      }
    );
  }

  handleNewRow(event: any) {
    let ir = new Map(this.state.insertionRow);
    const {
      currentTarget: {
        dataset: { column },
      },
      target: { value },
    } = event;

    ir.set(column, value);

    this.setState(
      (current) => ({
        ...current,
        insertionRow: ir,
      }),
      () => {
        this.validateInsertionRow();
        if (this.props.fields[column].unique === true) {
          this.checkInsertionRowDuplicates(column);
        }
      }
    );
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
        this.onDataSetUpdate();
        this.onDataSetValidation();
      }
    );
  }

  handleClickOnInsertionRow(event: any) {
    const {
      currentTarget: {
        dataset: { column },
      },
      // eslint-disable-next-line
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
    let isEmpty: boolean = false;

    for (let value of Array.from(this.state.insertionRow.values())) {
      if (value !== "") {
        continue;
      } else {
        isEmpty = true;
        break;
      }
    }

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

    for (let field in this.props.fields) {
      if (this.props.fields[field].hidden) {
        if (!(field in data)) {
          data[field] = this.props.fields[field].default;
        }
      }
    }
    dataSet.unshift({
      id: this.state.autoIncrement,
      readOnly: false,
      data: data,
    });

    this.setState(
      (current) => ({
        ...current,
        dataSet: dataSet,
        autoIncrement: this.state.autoIncrement + 1,
      }),
      () => {
        this.onDataSetUpdate();
        this.onDataSetValidation();
      }
    );

    this.state.insertionRow.forEach(
      (value: string, key: string, map: Map<string, string>) => map.set(key, "")
    );

    this.firstRow.current!.focus();
  }

  onDataSetUpdate() {
    const dataSet = JSON.parse(JSON.stringify(this.state.dataSet));

    this.props.onUpdate(
      dataSet.map((record) => {
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
  }

  onDataSetValidation() {
    this.props.onValidate(this.state.errors.length <= 0 ? true : false);
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
      .replace(/&lt;/g, "<")
      .replace(/<br>;/g, "");
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

  areDataSetsEqual(a: any, b: any) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (let key of aKeys) {
      if (a[key] !== b[key]) {
        return false;
      }
    }

    return true;
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.recordToAdd !== this.props.recordToAdd) {
      let newRow: any = {};
      let filtered: any = {};
      for (let key in this.props.recordToAdd) {
        if (key in this.props.fields) {
          filtered[key] = String(this.props.recordToAdd[key]);
        }
      }
      if (this.props.readOnlyIf(filtered)) {
        newRow.readOnly = true;
      }
      newRow.data = filtered;
      newRow.id = this.state.autoIncrement;
      for (let field in this.props.fields) {
        if (this.props.fields[field].hidden) {
          if (!(field in newRow)) {
            newRow[field] = this.props.fields[field].default;
          }
        }
      }
      this.setState(
        (current) => ({
          ...current,
          dataSet: [newRow, ...this.state.dataSet],
          autoIncrement: this.state.autoIncrement + 1,
        }),
        () => {
          this.state.dataSet.forEach((row: any) => {
            for (const field in row.data) {
              if (this.props.fields[field].format !== "boolean") {
                this.validate(row, field);
              }
            }
          });
          this.setState(this.state);
          this.onDataSetUpdate();
          this.onDataSetValidation();
        }
      );
    } else if (
      prevProps.recordsForReplacing !== this.props.recordsForReplacing
    ) {
      let newRecords = this.props.recordsForReplacing.map(
        (record: any, index: number) => {
          let filtered: any = {};
          for (let field in record) {
            if (field in this.props.fields) {
              filtered[field] = String(record[field]);
            }
          }
          for (let field in this.props.fields) {
            if (this.props.fields[field].hidden) {
              if (!(field in filtered)) {
                filtered[field] = this.props.fields[field].default;
              }
            }
          }
          return {
            id: index,
            readOnly: this.props.readOnlyIf(filtered),
            data: filtered,
          };
        }
      );

      this.setState(
        (current) => ({
          ...current,
          dataSet: newRecords,
          autoIncrement: newRecords.length + 1,
        }),
        () => {
          this.state.dataSet.forEach((row: any) => {
            for (const field in row.data) {
              if (this.props.fields[field].format !== "boolean") {
                this.validate(row, field);
              }
            }
          });
          this.setState(this.state);
          this.onDataSetUpdate();
          this.onDataSetValidation();
        }
      );
    }
  }

  render() {
    let headers = Object.keys(this.props.fields).map(
      (name: string, index: number) => {
        if (!this.props.fields[name].hidden) {
          return <th key={index}>{this.props.fields[name].name}</th>;
        }
        return null;
      }
    );

    let InsertButton = () => {
      return (
        <td>
          <div className="cell-button">
            <Button
              variant="link"
              onClick={() => this.addRow()}
              disabled={
                this.isInsertionRowIncorrect() || this.isInsertionRowEmpty()
              }
            >
              <FaPlus />
            </Button>
          </div>
        </td>
      );
    };

    let insertionRow = Array.from(this.state.insertionRow.keys()).map(
      (field, index) => {
        let props: any = {
          ref: this.firstRow,
        };

        if (index !== 0) {
          props.ref = null;
        }

        if (this.isInsertionFieldIncorrect(field)) {
          props["data-tip"] = true;
          props["data-for"] = `ir-${field}`;
          props["data-event"] = "focus keyup";
          props["data-event-off"] = "blur";
          props["data-multiline"] = true;
        }

        return (
          <td
            className={this.isInsertionFieldIncorrect(field) ? "incorrect" : ""}
          >
            <Form.Control
              type="text"
              value={this.state.insertionRow.get(field)}
              onChange={this.handleNewRow.bind(this)}
              data-column={field}
              {...props}
              key={index}
            />
            {this.isInsertionFieldIncorrect(field) && (
              <ReactTooltip id={`ir-${field}`} type="error" effect="solid">
                <h6>Error</h6>
                {this.getInsertionRowErrors(field).map(
                  (e: InsertionRowError) => {
                    return (
                      <>
                        {e.message}
                        <br />
                      </>
                    );
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
          {Object.keys(row.data).map((field) => {
            let props: any = {
              readOnly: true,
            };

            let cls: string = "";

            if (row.readOnly === false) {
              props.readOnly = false;
            } else {
              cls += "read-only";
            }

            if (this.isIncorrect(row.id, field)) {
              props["data-tip"] = true;
              props["data-for"] = `row-${row.id}-${field}`;
              props["data-event"] = "focus keyup";
              props["data-event-off"] = "blur";
              props["data-multiline"] = true;
              if (cls !== "") {
                cls += " incorrect";
              } else {
                cls = "incorrect";
              }
            }

            if (!this.props.fields[field].hidden) {
              return (
                <td key={field} className={cls}>
                  <Form.Control
                    type="text"
                    value={String(row.data[field])}
                    className="content-editable"
                    data-column={field}
                    data-id={row.id}
                    onChange={this.handleRow.bind(this)}
                    onPaste={this.pasteAsPlainText}
                    onKeyPress={this.disableNewlines}
                    onFocus={this.highlightAll}
                    {...props}
                  />
                  {this.isIncorrect(row.id, field) && (
                    <ReactTooltip
                      id={`row-${row.id}-${field}`}
                      type="error"
                      effect="solid"
                    >
                      <h6>Error</h6>
                      {this.getErrors(row.id, field).map((e: Error) => {
                        return (
                          <>
                            {e.message}
                            <br />
                          </>
                        );
                      })}
                    </ReactTooltip>
                  )}
                </td>
              );
            } else {
              return null;
            }
          })}
          <td>
            <div className="cell-button">
              <Button variant="link" onClick={() => this.deleteRow(row.id)}>
                <FaTimes />
              </Button>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <>
        <Table size={this.props.size} responsive>
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
      </>
    );
  }
}
