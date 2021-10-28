type Attribute = {
    file?: string,
    description?: string,
    system?:  string,
    id?: number,
    attribute_name?: string,
    data_attr_id?: number
}

type fileDetail = {
    description: string,
    title: string,
    id: number,
    attributes: Attribute[]
}

// type Linkage = {
//     data_attr_id: number
// }

type ConnectorElement = {
    criticality: string ,
    description: string,
    title: string,
    id: number,
    linking: Attribute[]
}

type Connection = {
    elementId: string,
    attributeId: string,
    coordinates?: any,
    connectorSVG?: any
}

type linkageData = { 
    data : {
        Files: fileDetail[]
        GDSName: string,
        GDSElements: ConnectorElement[],
        GDSId: number
    }
}

export {
    linkageData,
    ConnectorElement,
    fileDetail,
    Attribute,
    Connection
}