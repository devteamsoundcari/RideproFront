import React, { createRef } from "react";
import { Table, Button, OverlayTrigger, Popover } from "react-bootstrap";
import { FaTimes, FaPlus } from "react-icons/fa";
import ContentEditable from "react-contenteditable";

interface Error {
  id: number;
  column: string;
  type: string;
}

interface InsertionRowError {
  column: string;
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
      headings.set(props.fields[field].name, false);
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

    this.showErrors();
    this.props.onValidate(this.state.errors.length <= 0 ? true : false);
  }

  checkDuplicates(row: any, fieldName: string) {
    let idx: number;

    console.log(row);
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
          type: 'unique',
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

  showErrors() {
    this.state.displayErrors.forEach(
      (value: boolean, key: string, map: Map<string, boolean>) =>
        map.set(key, false)
    );

    for (let err of this.state.errors) {
      let field = this.props.fields[err.column];
      this.state.displayErrors.set(field.name, true);
    }
  }

  getErrors(id: number, field: string) {
    const errors = this.state.errors.filter(
      (err: Error) => err.id === id && err.column === field);

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
      let field = this.props.fields[err.column];

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

    console.log("prevDataSet: ", prevDataSet);
    this.setState(
      (current) => ({
        ...current,
        dataSet: prevDataSet,
      }),
      () => {
        console.log(this.state.dataSet);
        this.validate(row, column);
        if (this.props.fields[column].unique === true) {
          this.checkDuplicates(row, column);
        }
        this.updateDataSetProp();
      }
    );
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
      }
    ));

    this.setState(
      (current) => ({
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

  componentDidUpdate(nextProps: any, nextState: any) {
    console.log(nextProps);
    console.log(nextState);
    console.log(this.state.errors);
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            {Object.keys(this.props.fields).map((name: string) => {
              return (
                <th key={name}>
                  {this.props.fields[name].name}
                  {this.state.displayErrors.get(name) === true && (
                    <div className="error-msg">
                      {this.props.fields[name].errorMessages.regex}
                    </div>
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
                <FaPlus/>
              </Button>
            </td>
          </tr>
          {this.state.dataSet.map((row: any) => {
            return (
              <tr key={row.id}>
                {Object.keys(row.data)
                  .filter((field: any) => field !== "id")
                  .map((k) => {
                    return (
                      <td
                        key={k}
                        className={
                          this.isIncorrect(row.id, k) ? "incorrect" : ""
                        }
                      >
                        {this.getErrors(row.id, k).length ? (
                          <>
                            <OverlayTrigger
                              trigger="focus"
                              key={row.id}
                              placement="top"
                              overlay={
                                <Popover id="tooltip-error">
                                  <Popover.Title as="h3">
                                    {"Error"}
                                  </Popover.Title>
                                  <Popover.Content>
                                    {this.getErrors(row.id, k).map(
                                      (err: Error) => {
                                        return (
                                          <strong>
                                            {
                                              this.props.fields[err.column]
                                                .errorMessages[err.type]
                                            }
                                          </strong>
                                        );
                                      }
                                    )}
                                  </Popover.Content>
                                </Popover>
                              }
                            >
                              <ContentEditable
                                html={String(row.data[k])}
                                className="content-editable"
                                data-column={k}
                                data-id={row.id}
                                onChange={this.handleRow.bind(this)}
                                onPaste={this.pasteAsPlainText}
                                onKeyPress={this.disableNewlines}
                                onFocus={this.highlightAll}
                              />
                            </OverlayTrigger>
                          </>
                        ) :
                        <>
                              <ContentEditable
                                html={String(row.data[k])}
                                className="content-editable"
                                data-column={k}
                                data-id={row.id}
                                onChange={this.handleRow.bind(this)}
                                onPaste={this.pasteAsPlainText}
                                onKeyPress={this.disableNewlines}
                                onFocus={this.highlightAll}
                              />
                        </>}
                      </td>
                    );
                  })}
                <td>
                  <Button variant="link" onClick={() => this.deleteRow(row.id)}>
                    <FaTimes/>
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
