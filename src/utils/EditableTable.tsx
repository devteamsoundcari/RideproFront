import React, { createRef } from "react";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import ContentEditable from "react-contenteditable";

interface Error {
  id: number;
  column: string;
}

interface InsertionRowError {
  column: string;
}

class EditableTable extends React.Component<
  {
    dataSet: any[];
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

    let rowKeys = props.fields.map((field: any) => field.basename);
    let insertionRow = new Map<string, string>();

    rowKeys = Array.from(new Set(rowKeys));
    rowKeys
      .filter((field: string) => field !== "id")
      .forEach((key: string) => insertionRow.set(key, ""));

    let headings = new Map<string, boolean>();
    props.fields.forEach((field: any) => headings.set(field.name, false));

    let dataSet = [...props.dataSet];
    for (let i = 0; dataSet[i]; i++) {
      dataSet[i].id = i;
    }

    this.state = {
      dataSet: dataSet,
      errors: [],
      insertionRow: insertionRow,
      insertionRowErrors: [],
      displayErrors: headings,
    };

    this.firstRow = createRef();
  }

  validate(data: any, fieldName: string) {
    const field = this.props.fields.find(
      (field: any) => field.basename === fieldName
    );
    const regex = field.regex;
    let idx: number;

    if (!data[fieldName].match(regex)) {
      let err: Error;

      idx = this.state.errors.findIndex((e: Error) => e.id === data.id);
      if (idx < 0) {
        err = {
          id: data.id,
          column: fieldName,
        };
        this.state.errors.push(err);
      }
    } else {
      idx = this.state.errors.findIndex((e: Error) => e.id === data.id);
      if (idx >= 0) {
        this.state.errors.splice(idx);
      }
    }

    this.showErrors();
    this.props.onValidate(this.state.errors.length <= 0 ? true : false);
  }

  showErrors() {
    this.state.displayErrors.forEach(
      (value: boolean, key: string, map: Map<string, boolean>) =>
        map.set(key, false)
    );

    for (let err of this.state.errors) {
      let field = this.props.fields.find(
        (field: any) => field.basename === err.column
      );

      this.state.displayErrors.set(field.name, true);
    }
  }

  validateInsertionRow() {
    const { insertionRow, insertionRowErrors } = this.state;

    for (let key of Array.from(insertionRow.keys())) {
      const field = this.props.fields.find(
        (field: any) => field.basename === key
      );
      const regex = field.regex;
      if (regex === null) {
        continue;
      }

      let idx: number;

      if (
        !insertionRow.get(key)?.match(regex) &&
        insertionRow.get(key) !== ""
      ) {
        let err: InsertionRowError;

        idx = insertionRowErrors.findIndex(
          (e: InsertionRowError) => e.column === key
        );
        if (idx < 0) {
          err = {
            column: key,
          };
          insertionRowErrors.push(err);
        }
      } else {
        idx = insertionRowErrors.findIndex(
          (e: InsertionRowError) => e.column === key
        );
        if (idx >= 0) {
          insertionRowErrors.splice(idx);
        }
      }
    }

    this.showInsertionRowErrors();
  }

  showInsertionRowErrors() {
    let ins = this.state.displayErrors;

    ins.forEach((value: boolean, key: string, map: Map<string, boolean>) =>
      map.set(key, false)
    );

    for (let err of this.state.insertionRowErrors) {
      let field = this.props.fields.find(
        (field: any) => field.basename === err.column
      );

      ins.set(field.name, true);
    }

    this.setState((current) => ({
      ...current,
      displayErrors: ins,
    }));
  }

  deleteRow(id: number) {
    this.setState(
      (current) => ({
        ...current,
        dataSet: this.state.dataSet.filter((item: any) => id !== item.id),
      }),
      () => {
        this.props.onUpdate(this.state.dataSet);
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

    const data = prevDataSet.find((item: any) => item.id === parseInt(id));
    data[column] = value;

    this.setState(
      (current) => ({
        ...current,
        dataSet: prevDataSet,
      }),
      () => {
        this.props.onUpdate(this.state.dataSet);
      }
    );

    this.validate(data, column);
    console.log("QUE PASAAA");
    this.props.onUpdate(this.state.dataSet);
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

  addRow() {
    const { dataSet } = this.state;
    let row = Array.from(this.state.insertionRow).reduce(
      (obj: any, [key, value]) => {
        obj[key] = this.trimSpaces(value);
        return obj;
      },
      {}
    );

    this.setState(
      (current) => ({
        ...current,
        dataSet: [...dataSet, { ...row, id: dataSet.length + 1 }],
      }),
      () => {
        this.props.onUpdate(this.state.dataSet);
      }
    );

    this.state.insertionRow.forEach(
      (value: string, key: string, map: Map<string, string>) => map.set(key, "")
    );
    this.firstRow.current!.focus();
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

  componentWillReceiveProps(nextProps) {
    console.log("willreceiveprops", nextProps.dataSet === this.state.dataSet);
    let x = nextProps.dataSet;
    if (x !== this.state.dataSet) {
      for (let i = 0; x[i]; i++) {
        x[i].id = i;
      }
      // console.log("x: ", X);
      this.setState((current) => ({
        ...current,
        dataSet: x,
      }));
    }
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            {this.props.fields.map((field: any, i: number) => {
              return (
                <th key={field.name}>
                  {field.name}
                  {this.state.displayErrors.get(field.name) === true && (
                    <React.Fragment>
                      <br />
                      <small className="error-msg">{field.errorMsg}</small>
                    </React.Fragment>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Array.from(this.state.insertionRow.keys()).map((k, i) => {
              let props: any = {
                innerRef: this.firstRow,
              };
              if (i !== 0) props = {};
              return (
                <td
                  key={k}
                  className={
                    this.isInsertionFieldIncorrect(k) ? "incorrect" : ""
                  }
                >
                  <ContentEditable
                    {...props}
                    html={this.state.insertionRow.get(k)!}
                    data-column={k}
                    className="new-row"
                    onChange={this.handleNewRow.bind(this)}
                    onPaste={this.pasteAsPlainText}
                    onKeyPress={this.disableNewlines}
                    onFocus={this.highlightAll}
                  />
                </td>
              );
            })}
            <td>
              <Button
                variant="link"
                onClick={() => this.addRow()}
                disabled={
                  this.isInsertionRowIncorrect() || this.isInsertionRowEmpty()
                }
              >
                <FaPlus />
              </Button>
            </td>
          </tr>

          {this.state.dataSet.map((row: any) => {
            return (
              <tr key={row.id}>
                {Object.keys(row)
                  .filter((field: any) => field !== "id")
                  .map((k) => {
                    return (
                      <td
                        key={k}
                        className={
                          this.isIncorrect(row.id, k) ? "incorrect" : ""
                        }
                      >
                        <ContentEditable
                          html={String(row[k])}
                          className="content-editable"
                          data-column={k}
                          data-id={row.id}
                          onChange={this.handleRow.bind(this)}
                          onPaste={this.pasteAsPlainText}
                          onKeyPress={this.disableNewlines}
                          onFocus={this.highlightAll}
                        />
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
          })}
        </tbody>
      </Table>
    );
  }
}

export default EditableTable;
