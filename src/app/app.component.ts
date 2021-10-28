import { Component, OnInit } from '@angular/core';
import mockApiData from './mock/mock-data';
import { fileDetail, ConnectorElement, Attribute, Connection } from './model/connection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-collab-connector';

  defaultOptions = {
    loop: true,
    autoplay: true,
    renderer: "svg"
  };
  connectionConfigs = {
    fadedStrokeColor: "#CCCCCC",
    activeStrokeColor: "#00857A",
    elementIdentifierPrefix: "element_",
    attributeIdentifierPrefix: "attribute_",
    paddingTopElements: 72,
    paddingTopAttributes: 42,
    connectorPaddingLeft: 8,
    connectorDotRadius: 6,
    fillAndStroke: "fill:none;stroke-width:2"
  };
  overlayDisplay = true; //display the overlay with loader modal
  dataAvailableForLinking = true; // if service get failed; hide the empty div has been displayed
  dataElementSearchKey = "";
  dataAttributeSearchKey = "";
  dataLinkageElements: ConnectorElement[] = [];
  dataLinkageFiles:fileDetail[] = [];
  goldenDataSetName = "";
  noFilterResult = false;
  currentSelectedElementConnector: any = null;
  lastSelectedElementConnector = {}; // the last element that was selected; on page load; before filters/redraw etc
  currentSelectedAttribute: any = {};
  connectionsList: Connection[] = []; // stores current state of all connections; to be used for re-rendering for filtering/search
  visibleConnectionsList: Connection[] = []; // stores latest visible connections ; subset of connectionsList
  fadedConnectionsList: Connection[] = []; // stores active but not fully visible connections as its element/attribute is not visible as per filter/search
  selectedAttribute: any = []; //stores the selected attribute(checkboxes)
  selectedElementId = ""; //stores the selected element Id(checkboxes)
  selectedDataForLinking: any = []; // stores the selected element and attribute data for linking
  savedAgoText = ""; // display the saved ago time
  counter = 0; // set the counter
  // counterData = ""; // clear the counter
  storeLogsID = "";
  storeDataSetName = "";
  storeGoldenDataSetId = "";
  storeDataSetLinkage = "";
  storePhsEntList = "";
  storeOARId = "";
  storeSubmitStatus = "";

  // search filter on element
  get filteredElementsList() {
    let filteredElements;

    if (this.dataElementSearchKey.length === 0) {
      filteredElements = this.dataLinkageElements;
    } else {
      filteredElements = this.dataLinkageElements.filter(element => {
        return element.title
          .toLowerCase()
          .includes(this.dataElementSearchKey.toLowerCase());
      });
    }
    return filteredElements;
  }

  // search filter on attribute
  get filteredAttributeList() {
    const attributeArrValue: any = [];
    let filteredAttributes;

    try {
      if (this.dataAttributeSearchKey.length === 0) {
        filteredAttributes = this.dataLinkageFiles;
      } else {
        filteredAttributes = this.dataLinkageFiles.map( fileObj => {
          return {
            ...fileObj,
            attributes: fileObj.attributes.filter(attributeObj => {
              attributeArrValue.push(
                attributeObj?.attribute_name?.toLowerCase()
                  .includes(this.dataAttributeSearchKey.toLowerCase())
              );
              this.noFilterResult = attributeArrValue.every( (match: boolean) => {
                return match === false;
              });
              return attributeObj?.attribute_name?.toLowerCase().includes(this.dataAttributeSearchKey.toLowerCase());
            })
          };
        });
      }
    } catch (e) {
      this.logErrorsAndExceptions('technicalMapping.filteredAttributeList.error', e);
    }

    return filteredAttributes;
  }

  get connectionsContainer(): Element {
    return document.getElementById("connectionsContainer")!;
  }

  get connectionsContainerWidth() {
    return this.connectionsContainer.getBoundingClientRect().width;
  }

  logErrorsAndExceptions(msg: string, err: any) {
  }

  ngOnInit() {
    try {
        this.getDataForDataLinkage();
        // show initial linkages on page load
        this.drawVisibleConnectors();
        // deactivate all connections and attribute selection by default
        this.deactivateAllConnections();
        // submit button
        // this.visibleConnectionsList && this.visibleConnectionsList.length > 0
        //   ? this.$refs.submitButton.removeAttribute("disabled")
        //   : null;
    } catch (e) {
      this.logErrorsAndExceptions('technicalMapping.created.error', e);
    }
  }

  getDataForDataLinkage() {
    try {
      // const fileId = this.storePhsEntList;
      // const logsId = this.storeLogsID;
      const technicalMappingResponse = mockApiData;

      this.goldenDataSetName = technicalMappingResponse.data.GDSName;
      this.dataLinkageElements = technicalMappingResponse.data.GDSElements;
      this.dataLinkageFiles = technicalMappingResponse.data.Files;

      // draw initial connections
      this.dataLinkageElements.forEach(element => {
        try {
          const attributes: Attribute[] = element.linking.map(linkage => {
            return { id: linkage.data_attr_id };
          });
          attributes.forEach(attribute => {
            this.visibleConnectionsList.push({
              elementId:
                this.connectionConfigs.elementIdentifierPrefix + element.id,
              attributeId:
                this.connectionConfigs.attributeIdentifierPrefix +
                attribute.id
            });
          });
        } catch (e) {
          this.logErrorsAndExceptions('technicalMapping.getDataForDataLinkage.error', e);
        }
      });
      this.overlayDisplay = false;
      return;
    } catch (error) {
      this.overlayDisplay = false;
      this.dataAvailableForLinking = false;
      throw error;
    }
  }

  elementId(id: number) {
    return this.connectionConfigs.elementIdentifierPrefix + id;
  }

  attributeId(id: number) {
    return this.connectionConfigs.attributeIdentifierPrefix + id;
  }

  connectedAttribute(elementObj: ConnectorElement): string  {
    const attributeNameArr: [string] = [''];

    if (elementObj.linking.length > 0) {
      elementObj.linking.forEach(attribute => {
        attributeNameArr.push(attribute.attribute_name!);
      });
      return attributeNameArr.join(", ");
    } else {
      return ''
    }
  }

  // user event handlers
  keySearched(event: any) {
    // this.keyPressed = false;
    // when backspace and no results
    if (event.keyCode === 8 && this.noFilterResult === true) {
      this.noFilterResult = false;
    }
    // handle search at each keystroke inside input fields
    this.handleSearch();
  }

  elementSelected(elementId: number) {
    this.currentSelectedElementConnector = document.querySelector(
      `#${this.connectionConfigs.elementIdentifierPrefix + elementId}`
    )!;

    // deactivate all existing connections
    this.deactivateAllConnections();

    // activate all connections for current element
    this.activateConnectionsForLastSelectedElement();

    // at the End - enabling the all checkbox after selecting an element to allow new connections or remove existing connections
    document
      .querySelectorAll(".adore-attribute-selector")
      .forEach(checkbox => {
        checkbox.removeAttribute("disabled");
      });

    // Enable the submit for review button in case of existing linking
    /*const element = this.filteredElementsList.find(
        element => element.id === elementId
      );
      element && element.linking && element.linking.length > 0
        ? this.$refs.submitButton.removeAttribute("disabled")
        : this.$refs.submitButton.setAttribute("disabled", "disabled");*/
    // commented due to existing linking scenario, need to discuss
  }

  async attributeSelected(attr: Attribute, file: fileDetail) {
    // reset the saved ago text
    this.savedAgoText = "";
    // reset the interval
    // clearInterval(this.counterData);
    const elementId = this.currentSelectedElementConnector
      ? this.currentSelectedElementConnector.getAttribute("id")
      : "";
    const element = this.filteredElementsList.find(
      element =>
        this.connectionConfigs.elementIdentifierPrefix + element.id ===
        elementId
    );
    const linkedAttrs: any = element ? element.linking || [] : [];

    this.selectedAttribute.push(attr.id);
    this.currentSelectedAttribute = document.querySelector(
      `#${this.connectionConfigs.attributeIdentifierPrefix + attr.id}`
    );

    // if Selected, create a new connector
    if (
      this.currentSelectedAttribute &&
      this.currentSelectedAttribute.checked
    ) {
      linkedAttrs.push(attr);
      this.currentSelectedAttribute.classList.add("selected");
      this.createConnector();

      // api call to save linking on checkbox checked
      try {
        this.selectedDataForLinking.push({
          logs_id: parseInt(this.storeLogsID, 10),
          el_id: parseInt(elementId.split("_")[1], 10),
          atr_id: attr.id,
          phy_ent_id: file.id,
          src_sys_name: attr.system,
          physical_src: attr.file,
          attribute_name: attr.attribute_name
        });
        // const linkingResponse = await factory.updateElementAndAttributeLinking(
        //   this.selectedDataForLinking
        // );
        // linkingResponse.data.status === "passed"
        //   ? this.savedAgoSetInterval()
        //   : "";
      } catch (error) {
        this.logErrorsAndExceptions('technicalMapping.attributeSelected.error', error);
      }
    } else {
      // else if Unchecked, remove recently created connection
      linkedAttrs.splice(
        linkedAttrs.findIndex( (attribute: Attribute) => attribute.id === attr.id),
        1
      );
      this.removeConnector(
        elementId,
        this.connectionConfigs.attributeIdentifierPrefix + attr.id,
        true
      );

      // api call to remove linking on checkbox unchecked
      try {
        this.selectedDataForLinking.splice(
          this.selectedDataForLinking.findIndex(
            (attribute: Attribute) => attribute.id === attr.id
          ),
          1
        );
        const removedAttrAndElement = {
          el_id: parseInt(elementId.split("_")[1], 10),
          atr_id: attr.id
        };
        // const removedAttributeResponse = await factory.removeElementAndAttributeLinking(
        //   removedAttrAndElement
        // );
        // removedAttributeResponse.data.status === "passed"
        //   ? this.savedAgoSetInterval()
        //   : "";
      } catch (error) {
        this.logErrorsAndExceptions('technicalMapping.attributeSelected.error', error);
      }
    }
    // this.selectedDataForLinking.length > 0 || element.linking.length > 0
    //   ? this.$refs.submitButton.removeAttribute("disabled")
    //   : this.$refs.submitButton.setAttribute("disabled", "disabled");
  }

  // connector/svg related:
  // initial/draw related
  drawVisibleConnectors() {
    // get relations between Elements and Attributes
    this.visibleConnectionsList.forEach(connection => {
      this.currentSelectedElementConnector = document.getElementById(connection.elementId);
      this.currentSelectedAttribute = document.getElementById(connection.attributeId); // check! this.$refs[connection.attributeId][0]

      // draw connectors for each relation
      this.createConnector();
    });
  }

  createConnector() {
    if (
      !!this.currentSelectedElementConnector &&
      !!this.currentSelectedAttribute
    ) {
      const elementRectangle = this.currentSelectedElementConnector.getBoundingClientRect();
      const x1 = elementRectangle.x;
      const y1 = elementRectangle.y;
      const top1 =
        this.currentSelectedElementConnector.offsetTop +
        this.connectionConfigs.paddingTopElements;

      // using PARENT container as the Checkbox will always give offsetTop = 0 as its hidden due to Emerald styles
      const attributeRectangle = this.currentSelectedAttribute.offsetParent.getBoundingClientRect();
      const x2 = attributeRectangle.x;
      const y2 = attributeRectangle.y;
      const top2 =
        this.currentSelectedAttribute.offsetParent &&
        this.currentSelectedAttribute.offsetParent.offsetTop +
        this.connectionConfigs.paddingTopAttributes;

      const elementId = this.currentSelectedElementConnector.getAttribute(
        "id"
      );
      const attributeId = this.currentSelectedAttribute.getAttribute("id");
      const connectorId = `${elementId}_${attributeId}`;

      // attach the connection to the container
      const connectorSVG = this.drawConnectorPath(
        0,
        top1,
        x2 - x1,
        top2,
        connectorId
      );

      this.connectionsContainer.appendChild(connectorSVG.startDot);
      this.connectionsContainer.appendChild(connectorSVG.path);
      this.connectionsContainer.appendChild(connectorSVG.endDot);

      // save the connection details in state IF not already present
      const connectionExists = this.connectionsList.find(connection => {
        return (
          elementId === connection.elementId &&
          attributeId === connection.attributeId
        );
      });
      if (!connectionExists) {
        this.connectionsList.push({
          coordinates: { top1, top2, x1, y1, x2, y2, connectorId },
          elementId,
          attributeId,
          connectorSVG
        });
      }

      // activate only last selected Element's connections
      this.activateConnectionsForLastSelectedElement();
    }
  }

  drawConnectorPath(startX: number, startY: number, endX: number, endY: number, connectorId: string) {
    // create a new connection and activate it by default

    const connectorHalfWidth = this.connectionsContainerWidth / 2;
    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    const startDot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    const endDot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    const d = `M ${startX +
      this.connectionConfigs.connectorDotRadius +
      this.connectionConfigs.connectorPaddingLeft} ${startY}
                           C ${startX +
      this.connectionConfigs.connectorDotRadius +
      connectorHalfWidth} ${startY},
                             ${startX -
      this.connectionConfigs.connectorDotRadius +
      connectorHalfWidth} ${endY},
                           ${startX -
      this.connectionConfigs.connectorDotRadius +
      this.connectionsContainerWidth -
      this.connectionConfigs
        .connectorPaddingLeft} ${endY}`;

    path.setAttribute("d", d);
    path.setAttribute("style", this.connectionConfigs.fillAndStroke);
    path.setAttribute("stroke", this.connectionConfigs.fadedStrokeColor);
    path.setAttribute("id", `${connectorId}_path`);
    path.setAttribute("class", "connection-path");

    startDot.setAttribute("id", `${connectorId}_start`);
    startDot.setAttribute(
      "cx",
      (startX + this.connectionConfigs.connectorPaddingLeft) + ''
    );
    startDot.setAttribute("cy", '' + startY);
    startDot.setAttribute("r", '' + this.connectionConfigs.connectorDotRadius);
    startDot.setAttribute("style", this.connectionConfigs.fillAndStroke);
    startDot.setAttribute("stroke", this.connectionConfigs.fadedStrokeColor);
    startDot.setAttribute("class", "connection-start");

    endDot.setAttribute("id", `${connectorId}_end`);
    endDot.setAttribute(
      "cx",
      (startX +
      this.connectionsContainerWidth -
      this.connectionConfigs.connectorPaddingLeft) + ''
    );
    endDot.setAttribute("cy", '' + endY);
    endDot.setAttribute("r", '' + this.connectionConfigs.connectorDotRadius);
    endDot.setAttribute("style", this.connectionConfigs.fillAndStroke);
    endDot.setAttribute("stroke", this.connectionConfigs.fadedStrokeColor);
    endDot.setAttribute("class", "connection-end");

    return {
      startDot,
      path,
      endDot
    };
  }

  activateConnectionsForLastSelectedElement() {
    if (this.currentSelectedElementConnector) {
      const elementId = this.currentSelectedElementConnector.getAttribute(
        "id"
      );
      const selectedElement = document.getElementById(elementId);

      // mark selected Element as Active
      try {
        this.currentSelectedElementConnector.classList.add("selected");

        // activate the connections only when Element is visible and not filtered out during search
        if (selectedElement) {
          document
            .querySelectorAll(`#connectionsContainer [id^=${elementId}]`)
            .forEach(svgElement => {
              svgElement.setAttribute(
                "stroke",
                this.connectionConfigs.activeStrokeColor
              ); // mark as active
            });
        }

        // activate all connected attribute-checkboxes
        const connectionsOfSelectedElement = this.connectionsList.filter(
          connection => connection.elementId === elementId
        );
        connectionsOfSelectedElement.forEach(connection => {
          const selectedAttribute = <HTMLInputElement>document.getElementById(
            connection.attributeId
          );
          if (selectedAttribute) {
            selectedAttribute.checked = true;
          }
          selectedAttribute
            ? selectedAttribute.removeAttribute("disabled")
            : null;

          this.selectedElementId = connection.elementId;
        });
      } catch (e) {
        this.logErrorsAndExceptions('technicalMapping.activateConnectionsForLastSelectedElement.error', e);
      }
    }
  }

  deactivateAllConnections() {
    // deactivate all other Elements except current one
    document.querySelectorAll(".element-connector").forEach(element => {
      element.classList.remove("selected");
    });

    // path
    document.querySelectorAll(".connection-path").forEach(connection => {
      const pathStroke = connection.getAttribute("stroke");

      // fade out only if not already Faded, otherwise its required to be shown fully
      if (pathStroke && !!pathStroke.indexOf("url(#fadeFrom")) {
        connection.setAttribute(
          "stroke",
          this.connectionConfigs.fadedStrokeColor
        );
      }
    });

    // start/end Dots
    document
      .querySelectorAll(".connection-start, .connection-end")
      .forEach(connection => {
        connection.setAttribute(
          "stroke",
          this.connectionConfigs.fadedStrokeColor
        );
      });

    // deactivate all checkboxes so that user can not uncheck them by accident
    document
      .querySelectorAll(".adore-attribute-selector")
      .forEach(attribute => {
        if (attribute) {
          (<HTMLInputElement>attribute).checked = false;
        }
        attribute ? attribute.setAttribute("disabled", "true") : null;
      });
  }

  // user may search/filter on Elements or Attributes, causing the positions/visibility of connectors to change
  handleSearch() {
    // find existing connections for currently visible Elements OR Attributes
    const connectionsToShow: Connection[] = [],
      connectionsToFade: Connection[] = [];
    this.connectionsList.forEach(connection => {
      this.filteredElementsList.find(element => {
        return (
          connection.elementId ===
          `${this.connectionConfigs.elementIdentifierPrefix + element.id}`
        );
      }) && // if the Element is visible and
        this.filteredAttributeList?.find(file => {
          return file.attributes.find(
            attribute =>
              connection.attributeId ===
              `${this.connectionConfigs.attributeIdentifierPrefix +
              attribute.id}`
          );
        }) // the Attribute is visible
        ? connectionsToShow.push(connection) // if element and attribute both are visible, put in toShow
        : connectionsToFade.push(connection); // else put in toFade
    });

    this.visibleConnectionsList = connectionsToShow;
    this.fadedConnectionsList = connectionsToFade;

    // hide (i.e. Remove) all connections from DOM, but DONT't remove from the State
    this.hideAllConnections();

    // plot visible connections
    this.drawVisibleConnectors();

    // plot faded connections
    this.createFadedConnectors();

    // deactivate all existing connections
    this.deactivateAllConnections();
  }

  hideAllConnections() {
    this.connectionsList.forEach(connection => {
      // hide from DOM without removing from the State
      this.removeConnector(
        connection.elementId,
        connection.attributeId,
        false
      );
    });
  }

  removeConnector(elementId: string, attributeId: string, removeFromState: boolean) {
    const connectorId = `${elementId}_${attributeId}_`;

    // [id^='someId'] will match all ids starting with someId.
    // [id$='someId'] will match all ids ending with someId.
    // [id*='someId'] will match all ids containing someId.
    document.querySelectorAll(`[id^=${connectorId}]`).forEach(svgElement => {
      svgElement?.parentNode?.removeChild(svgElement); // as childNode.remove() method does not work in IE
    });

    if (removeFromState) {
      // remove from state only when connection is removed completely, else only hide if the connector is required again after Search
      this.connectionsList.splice(
        this.connectionsList.findIndex(
          connection =>
            connection.elementId === elementId &&
            connection.attributeId === attributeId
        ),
        1
      );
    }
  }

  // redraw Faded path as per visibility of Element or Attribute
  createFadedConnectors() {
    // attach the connection to the container
    this.fadedConnectionsList.forEach(connector => {
      const startDot = connector.connectorSVG.startDot;
      const endDot = connector.connectorSVG.endDot;
      const path = connector.connectorSVG.path;
      const element = document.getElementById(connector.elementId);
      const attribute = document.getElementById(connector.attributeId);
      const dottedLineLength = this.connectionsContainerWidth / 4;
      let dot;

      // truncate the path based on visibility of Element or Attribute from right or from left resp
      if (element) {
        // need latest Top1 value as the Element may have moved up/down due to filtering
        const top1 =
          element.offsetTop + this.connectionConfigs.paddingTopElements;
        const d = `M ${this.connectionConfigs.connectorDotRadius +
          this.connectionConfigs.connectorPaddingLeft} ${top1}
                            l ${dottedLineLength} 0`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "url(#fadeFromLeft)");

        dot = startDot;
        dot.setAttribute("cy", top1);
      } else if (attribute) {
        const top2 =
          (<HTMLElement>attribute.offsetParent).offsetTop +
          this.connectionConfigs.paddingTopAttributes;
        const d = `M ${this.connectionsContainerWidth -
          this.connectionConfigs.connectorDotRadius -
          this.connectionConfigs.connectorPaddingLeft} ${top2}
                                   l -${dottedLineLength} 0`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "url(#fadeFromRight)");

        dot = endDot;
        dot.setAttribute("cy", top2);
      }

      if (dot) {
        // create faded connection only when either of the element/attribute is visible
        dot.setAttribute("stroke", this.connectionConfigs.fadedStrokeColor); // its possible that none of the element and attribute is visible as per filters
        this.connectionsContainer.appendChild(dot);
        this.connectionsContainer.appendChild(path);
      }
    });
  }



}
