import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { setFuzzySearch } from "./searchSettingsSlice";
import Table from "react-bootstrap/Table";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// @ts-ignore  // TODO: https://github.com/arnthor3/react-bootstrap-toggle/issues/21
import Toggle from "react-bootstrap-toggle";

export function SearchSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const [show, setShow] = useState(false);

  const fuzzySearch = useSelector(
    (state: RootState) => state.searchSettings.fuzzySearch
  );
  const [localFuzzySearch, setLocalFuzzySearch] = useState(fuzzySearch);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setLocalFuzzySearch(fuzzySearch);
    setShow(true);
  };
  const handleSave = () => {
    dispatch(setFuzzySearch(localFuzzySearch));
    handleClose();
  };

  const [sourceOrder, setSourceOrder] = useState([]);
  const maybeSourceDocuments = useSelector(
    (state: RootState) => state.sourceDocuments.sourceDocuments
  );
  useEffect(
    () => setSourceOrder(Object.keys(maybeSourceDocuments ?? {})),
    [maybeSourceDocuments]
  );
  const onDragEnd = (result: any) => {
    // TODO: looks like the table is resizing when we drag/drop items - ideally its height should be fixed
    // TODO: review this bit of code (copied from drag/drop sandbox example) and see if it can be improved
    const reorderedSourceOrder = [...sourceOrder];
    const [removed] = reorderedSourceOrder.splice(result.source.index, 1);
    reorderedSourceOrder.splice(result.destination.index, 0, removed);
    setSourceOrder(reorderedSourceOrder);
  };

  let sourceTable = (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="spinner-border"
        style={{ width: 4 + "em", height: 4 + "em" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  if (maybeSourceDocuments != null) {
    const sourceRows: Array<ReactNode> = sourceOrder.map((sourceKey, index) => (
      <Draggable key={sourceKey} draggableId={sourceKey} index={index}>
        {(provided, snapshot) => (
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <td style={{ verticalAlign: "middle", width: 20 + "%" }}>
              <Toggle
                on="On"
                onClassName="flex-centre prevent-select"
                off="Off"
                offClassName="flex-centre prevent-select"
                onstyle="primary"
                offstyle="primary"
                size="md"
                height={38 + "px"}
              />
            </td>
            <td style={{ verticalAlign: "middle", width: 40 + "%" }}>
              {maybeSourceDocuments[sourceKey].external_link != null ? (
                <a
                  className="prevent-select"
                  href={maybeSourceDocuments[sourceKey].external_link}
                  target="_blank"
                >
                  {maybeSourceDocuments[sourceKey].name}
                </a>
              ) : (
                <a className="prevent-select">
                  {maybeSourceDocuments[sourceKey].name}
                </a>
              )}
            </td>
            <td
              className="prevent-select"
              style={{ verticalAlign: "middle", width: 30 + "%" }}
            >
              {maybeSourceDocuments[sourceKey].source_type}
            </td>
            <td
              style={{
                verticalAlign: "middle",
                width: 10 + "%",
                textAlign: "center",
              }}
            >
              <i
                className="bi bi-grip-horizontal"
                style={{ fontSize: 2 + "em" }}
              />
            </td>
          </tr>
        )}
      </Draggable>
    ));
    sourceTable = (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="source-order">
          {(provided, snapshot) => (
            <Table ref={provided.innerRef} style={{ tableLayout: "auto" }}>
              <thead>
                <tr>
                  <th className="prevent-select">Enabled</th>
                  <th className="prevent-select">Source Name</th>
                  <th className="prevent-select">Source Type</th>
                  <th />
                </tr>
              </thead>
              <tbody>{sourceRows}</tbody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
  return (
    <div className="d-grid gap-0">
      <Button variant="primary" onClick={handleShow}>
        <i className="bi bi-gear" style={{ paddingRight: 0.5 + "em" }} />
        Search Settings
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select the sources you'd like to search, and drag & drop them to
          change the order images are shown in.
          <br />
          Click the table header to enable or disable all sources.
          <br />
          <br />
          <Toggle
            onClick={() => setLocalFuzzySearch(!localFuzzySearch)}
            on="Fuzzy Search"
            onClassName="flex-centre"
            off="Precise Search"
            offClassName="flex-centre"
            onstyle="success"
            offstyle="info"
            width={100 + "%"}
            size="md"
            height={38 + "px"}
            active={localFuzzySearch}
          />
          <br />
          <br />
          {sourceTable}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
