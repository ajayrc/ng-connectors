import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-collab-connector'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ng-collab-connector');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('ng-collab-connector app is running!');
  });
});

/*

import {createLocalVue, mount} from "@vue/test-utils";
import {factory} from "../../src/service";
import mockApiData from "./mock/technical-mapping";
import MockElement from "./mock/dom-mock";

const localVue = createLocalVue();

describe("Technical Mapping component:", () => {
    let wrapper;
    const $getConst = () => {
    };
    const routes = [

    ];
    const router = new VueRouter({routes});

    let store, actions, mutations;

    beforeEach(() => {
        actions = {
            updateUserName: jest.fn(),
        };
        mutations = {
            saveDataLinkageMapping: jest.fn()
        };
        store = new Vuex.Store({
            actions,
            mutations
        });
        window.localStorage.setItem("userName", "test");
        window.localStorage.setItem("accessToken", "randomValue");
    });

    afterEach(() => {
        wrapper.destroy();
    });

    describe('connections related:', function () {

        beforeEach(() => {
            router.push({
                name: "TechnicalMapping"
            });
        });

        it("should get data from api on successful page load and handle error scenario", async () => {
            const spyOnFetchTechnicalMappingData = await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.reject({error: "api down"})
            );

            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            const spyOnCreateConnector = await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnDrawVisibleConnectors = await jest.spyOn(
                wrapper.vm,
                "drawVisibleConnectors"
            );

            const spyOnDeactivateAllConnections = await jest.spyOn(
                wrapper.vm,
                "deactivateAllConnections"
            );

            await wrapper.vm.$nextTick();

            expect(spyOnFetchTechnicalMappingData).toHaveBeenCalled();
            expect(spyOnDrawVisibleConnectors).not.toHaveBeenCalled();
            expect(spyOnCreateConnector).not.toHaveBeenCalled();
            expect(spyOnDeactivateAllConnections).not.toHaveBeenCalled();

            expect(wrapper.text()).not.toContain("Former Commercial Banking clients transferred to Deutsche Bank or RBS");
        });

        it("should get data from api on successful page load and draw initial connections", async () => {
            const spyOnFetchTechnicalMappingData = await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            const spyOnCreateConnector = await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnDrawVisibleConnectors = await jest.spyOn(
                wrapper.vm,
                "drawVisibleConnectors"
            );

            const spyOnDeactivateAllConnections = await jest.spyOn(
                wrapper.vm,
                "deactivateAllConnections"
            );

            await wrapper.vm.$nextTick();

            const connector = wrapper.find(".element-connector");
            const attrs = wrapper.find(".adore-file-attributes");
            const ele_ref_49 = wrapper.find({ref: "element_49"});

            expect(spyOnFetchTechnicalMappingData).toHaveBeenCalled();
            expect(spyOnDrawVisibleConnectors).toHaveBeenCalled();
            expect(spyOnCreateConnector).toHaveBeenCalled();
            expect(spyOnDeactivateAllConnections).toHaveBeenCalled();

            expect(wrapper.text()).toContain("Former Commercial Banking clients transferred to Deutsche Bank or RBS");
            expect(connector.text()).toContain("Segment type 48"); // all elements
            expect(attrs.text()).toContain("WS_MEASURE_DATA11"); // all attributes
            expect(ele_ref_49.text()).toContain("date of birth 49"); // specific element
            expect(ele_ref_49.text()).toContain("WS_MEASURE_DATA13"); // element should have name of connected attribute
        });

        it("should handle search - Elements", async () => {
            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            const spyOnKeySearched = await jest.spyOn(
                wrapper.vm,
                "keySearched"
            );

            const spyOnHandleSearch= await jest.spyOn(
                wrapper.vm,
                "handleSearch"
            );

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            const elementInput = wrapper.find({ref: "data-element-search"});
            elementInput.setValue("date"); // set filter value for Elements

            elementInput.trigger('keyup');

            await wrapper.vm.$nextTick();
            const connector = wrapper.find(".element-connector");
            expect(connector.text()).not.toContain("Segment type 48");
            expect(connector.text()).toContain("date of birth 49");

            expect(spyOnKeySearched).toHaveBeenCalled();
            expect(spyOnHandleSearch).toHaveBeenCalled();
        });

        it("should handle search - Attributes", async () => {
            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            const attributeInput = wrapper.find({ref: "data-attribute-search-key"});
            attributeInput.setValue("DATA11"); // set filter value for Attributes
            await wrapper.vm.$nextTick();
            const attributes = wrapper.find(".adore-file-attributes");
            expect(attributes.text()).not.toContain("WS_MEASURE_DATA15");
            expect(attributes.text()).toContain("WS_MEASURE_DATA11");
        });

        it("should handle element selection", async () => {
            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            const spyOnDeactivateAllConnections = await jest.spyOn(
                wrapper.vm,
                "deactivateAllConnections"
            );

            const spyOnActivateConnectionsForLastSelectedElement = await jest.spyOn(
                wrapper.vm,
                "activateConnectionsForLastSelectedElement"
            );

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.find({ref: "element_49"}).trigger("click");

            await wrapper.vm.$nextTick();

            expect(spyOnDeactivateAllConnections).toHaveBeenCalled();
            expect(spyOnActivateConnectionsForLastSelectedElement).toHaveBeenCalled();
        });

        it("should go back to File Selection page", async () => {
            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnEditSelectedFiles = jest.spyOn(
                wrapper.vm,
                "editSelectedFiles"
            );

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.find({ref: "editSelectedFilesBtn"}).trigger("click");
            await wrapper.vm.$nextTick();

            expect(spyOnEditSelectedFiles).toHaveBeenCalled();
            expect(wrapper.vm.$route.path).toBe("/file-selection");
        });

        it("should submit the form", async () => {
            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const spyOnSubmitElementAndAttributeLinking = await jest.spyOn(
                factory,
                "submitElementAndAttributeLinking"
            ).mockResolvedValue({data: {}});

            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnSubmitForReview = jest.spyOn(
                wrapper.vm,
                "submitForReview"
            );

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            // wrapper.find({ref: "submitButton"}).trigger("click");
            await wrapper.vm.submitForReview();
            await wrapper.vm.$nextTick();

            expect(spyOnSubmitForReview).toHaveBeenCalled();
            expect(spyOnSubmitElementAndAttributeLinking).toHaveBeenCalled();
        });
    });

    describe('functions:', function () {

        beforeEach(() => {
            router.push({
                name: "TechnicalMapping"
            });
        });

        it("createConnector():", async () => {
            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            const wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst},
                computed: {
                    connectionsContainer: () => new MockElement("connectionsContainer", false)
                }
            });

            const spyOnCreateConnector = await jest.spyOn(
                wrapper.vm,
                "createConnector"
            );

            const spyOnDrawConnectorPath = await jest.spyOn(
                wrapper.vm,
                "drawConnectorPath"
            );

            const spyOnActivateConnectionsForLastSelectedElement = await jest.spyOn(
                wrapper.vm,
                "activateConnectionsForLastSelectedElement"
            );

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.vm.currentSelectedElementConnector = new MockElement("element_49", true);
            wrapper.vm.currentSelectedAttribute = new MockElement("attribute_13", true);

            await wrapper.vm.$nextTick();

            await wrapper.vm.createConnector(); // explicit call to avoid complex mock triggers on ui

            expect(spyOnCreateConnector).toHaveBeenCalled();
            expect(spyOnDrawConnectorPath).toHaveBeenCalled();
            expect(spyOnActivateConnectionsForLastSelectedElement).toHaveBeenCalled();
        });

        it("handleSearch():", async () => {
            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            const wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst},
                computed: {
                    connectionsContainer: () => new MockElement("connectionsContainer", false)
                }
            });

            const spyOnDrawVisibleConnectors = await jest.spyOn(
                wrapper.vm,
                "drawVisibleConnectors"
            ).mockImplementation(() => {});

            await jest.spyOn(
                wrapper.vm,
                "deactivateAllConnections"
            ).mockImplementation(() => {});

            await jest.spyOn(
                wrapper.vm,
                "activateConnectionsForLastSelectedElement"
            ).mockImplementation(() => {});

            const spyOnHandleSearch= await jest.spyOn(
                wrapper.vm,
                "handleSearch"
            );

            const spyOnHideAllConnections= await jest.spyOn(
                wrapper.vm,
                "hideAllConnections"
            );

            const spyOnRemoveConnector= await jest.spyOn(
                wrapper.vm,
                "removeConnector"
            );

            const spyOnCreateFadedConnectors= await jest.spyOn(
                wrapper.vm,
                "createFadedConnectors"
            );
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.vm.currentSelectedElementConnector = new MockElement("element_49", true);
            wrapper.vm.currentSelectedAttribute = new MockElement("attribute_13", true);

            await wrapper.vm.$nextTick();

            await wrapper.vm.createConnector(); // explicit call to avoid complex mock triggers on ui
            await wrapper.vm.handleSearch();

            expect(spyOnHandleSearch).toHaveBeenCalled();
            expect(spyOnHideAllConnections).toHaveBeenCalled();
            expect(spyOnRemoveConnector).toHaveBeenCalled();
            expect(spyOnCreateFadedConnectors).toHaveBeenCalled();
            expect(spyOnDrawVisibleConnectors).toHaveBeenCalled();
        });

        it("attributeSelected(): deselected", async () => {
            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            const spyOnAttributeSelected = await jest.spyOn(
                wrapper.vm,
                "attributeSelected"
            );

            const spyOnRemoveConnector = await jest.spyOn(
                wrapper.vm,
                "removeConnector"
            );

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnSavedAgoSetInterval = await jest.spyOn(
                wrapper.vm,
                "savedAgoSetInterval"
            );

            const spyOnUpdateElementAndAttributeLinking = await jest.spyOn(
                factory,
                "updateElementAndAttributeLinking"
            ).mockImplementation(() => {
            });

            const spyOnRemoveElementAndAttributeLinking = await jest.spyOn(
                factory,
                "removeElementAndAttributeLinking"
            ).mockResolvedValue({
                data: {
                    status: "passed"
                }
            });

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.vm.currentSelectedElementConnector = new MockElement("element_48", true);

            const attributeSelected = mockApiData.data.Files[0].attributes[0];
            const file = mockApiData.data.Files[0];

            await wrapper.vm.attributeSelected(attributeSelected, file);

            await wrapper.vm.$nextTick();

            expect(spyOnAttributeSelected).toHaveBeenCalled();
            expect(spyOnRemoveElementAndAttributeLinking).toHaveBeenCalledWith({
                el_id: 48,
                atr_id: 11
            });
            expect(spyOnRemoveConnector).toHaveBeenCalled();
            expect(spyOnSavedAgoSetInterval).toHaveBeenCalled();

            expect(spyOnUpdateElementAndAttributeLinking).not.toHaveBeenCalled();
        });

        it("attributeSelected(): selected", async () => {
            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst}
            });

            const spyOnCreateConnector = await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnAttributeSelected = await jest.spyOn(
                wrapper.vm,
                "attributeSelected"
            );

            const spyOnRemoveConnector = await jest.spyOn(
                wrapper.vm,
                "removeConnector"
            );

            const spyOnSavedAgoSetInterval = await jest.spyOn(
                wrapper.vm,
                "savedAgoSetInterval"
            );

            const spyOnUpdateElementAndAttributeLinking = await jest.spyOn(
                factory,
                "updateElementAndAttributeLinking"
            ).mockImplementation( () => {
                return {
                    data: {
                        status: "passed"
                    }
                }
            });

            const currentSelectedAttribute = new MockElement("attribute_11", true);

            await jest.spyOn(
                document,
                "querySelector"
            ).mockImplementationOnce(() => {
                return currentSelectedAttribute
            });

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.vm.currentSelectedElementConnector = new MockElement("element_48", true);

            const attributeSelected = mockApiData.data.Files[0].attributes[0];

            const file = mockApiData.data.Files[0];

            await wrapper.vm.attributeSelected(attributeSelected, file);

            await wrapper.vm.$nextTick();

            expect(spyOnAttributeSelected).toHaveBeenCalled();
            expect(spyOnCreateConnector).toHaveBeenCalled();
            expect(spyOnUpdateElementAndAttributeLinking).toHaveBeenCalled();
            expect(spyOnSavedAgoSetInterval).toHaveBeenCalled();

            expect(spyOnRemoveConnector).not.toHaveBeenCalled();
        });

        it("createFadedConnectors(): element", async() => {
            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const spyOnDocumentGetElementById = await jest.spyOn(
                document,
                "getElementById"
            ).mockImplementation( (id) => {
                if(id=== "element_49") {
                  return  new MockElement("element_49", true)
                } else {
                    return null;
                }
            });

            const wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst},
                computed: {
                    connectionsContainer: () => new MockElement("connectionsContainer", false)
                }
            });

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnConnectionsContainer = await jest.spyOn(
                wrapper.vm.connectionsContainer,
                "appendChild"
            );

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.vm.fadedConnectionsList = [{
                elementId: "element_49",
                attributeId: "attribute_11",
                connectorSVG: {
                    startDot: new MockElement("element_49_attribute_11_start", true),
                    endDot: new MockElement("element_49_attribute_11_end", true),
                    path: new MockElement("element_49_attribute_11_path", true)
                },
                coordinates: {
                    connectorId: "element_49_attribute_11",
                    top1: 100,
                    top2: 200,
                    x1: 100,
                    x2: 500,
                    y1: 0,
                    y2: 100
                }
            }];

            wrapper.vm.createFadedConnectors();

            expect(spyOnConnectionsContainer).toHaveBeenCalled();
            expect(spyOnDocumentGetElementById).toHaveBeenCalled();
            expect(wrapper.vm.fadedConnectionsList[0].connectorSVG.path.stroke).toContain("url(#fadeFromLeft)");
        });

        it("createFadedConnectors(): attribute", async() => {
            const data = () => {
                return {
                    overlayDisplay: false
                };
            };

            await jest.spyOn(
                factory,
                "fetchTechnicalMappingData"
            ).mockImplementation(() =>
                Promise.resolve(mockApiData)
            );

            const spyOnDocumentGetElementById = await jest.spyOn(
                document,
                "getElementById"
            ).mockImplementation( (id) => {
                if(id === "attribute_11") {
                    return  new MockElement("attribute_11", true)
                } else {
                    return null;
                }
            });

            const wrapper = mount(TechnicalMapping, {
                localVue,
                router,
                store,
                data,
                mixins: [adoreMixins],
                mocks: {$getConst},
                computed: {
                    connectionsContainer: () => new MockElement("connectionsContainer", false)
                }
            });

            await jest.spyOn(
                wrapper.vm,
                "createConnector"
            ).mockImplementation(() => {
            });

            const spyOnConnectionsContainer = await jest.spyOn(
                wrapper.vm.connectionsContainer,
                "appendChild"
            );

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            wrapper.vm.fadedConnectionsList = [{
                elementId: "element_49",
                attributeId: "attribute_11",
                connectorSVG: {
                    startDot: new MockElement("element_49_attribute_11_start", true),
                    endDot: new MockElement("element_49_attribute_11_end", true),
                    path: new MockElement("element_49_attribute_11_path", true)
                },
                coordinates: {
                    connectorId: "element_49_attribute_11",
                    top1: 100,
                    top2: 200,
                    x1: 100,
                    x2: 500,
                    y1: 0,
                    y2: 100
                }
            }];

            wrapper.vm.createFadedConnectors();

            expect(spyOnConnectionsContainer).toHaveBeenCalled();
            expect(spyOnDocumentGetElementById).toHaveBeenCalled();
            expect(wrapper.vm.fadedConnectionsList[0].connectorSVG.path.stroke).toContain("url(#fadeFromRight)");
        });
    });
})

*/
