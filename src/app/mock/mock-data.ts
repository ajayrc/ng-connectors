import { linkageData } from "../model/connection";

const mockApiData: linkageData = { data : {
    "Files": [
        {
            "attributes": [
                {
                    "file": "PERSONAL_INFO",
                    "description": "",
                    "system": "bcdb",
                    "id": 11,
                    "attribute_name": "CITY"
                },
                {
                    "file": "PERSONAL_INFO",
                    "description": "",
                    "system": "bcdb",
                    "id": 12,
                    "attribute_name": "FIRST NAME"
                },
                {
                    "file": "PERSONAL_INFO",
                    "description": "",
                    "system": "bcdb",
                    "id": 13,
                    "attribute_name": "LAST NAME"
                },
                {
                    "file": "PERSONAL_INFO",
                    "description": "",
                    "system": "bcdb",
                    "id": 14,
                    "attribute_name": "ZIP CODE"
                },
                {
                    "file": "PERSONAL_INFO",
                    "description": "",
                    "system": "bcdb",
                    "id": 15,
                    "attribute_name": "HOUSE NUMBER"
                }
            ],
            "description": "",
            "title": "PERSONAL_INFO",
            "id": 1
        },
        {
            "attributes": [
                {
                    "file": "bcdb_measurements",
                    "description": "",
                    "system": "bcdb",
                    "id": 21,
                    "attribute_name": "CITY"
                },
                {
                    "file": "bcdb_measurements",
                    "description": "",
                    "system": "bcdb",
                    "id": 22,
                    "attribute_name": "REGISTRATION NUMBER"
                },
                {
                    "file": "bcdb_measurements",
                    "description": "",
                    "system": "bcdb",
                    "id": 24,
                    "attribute_name": "ZIP CODE"
                },
                {
                    "file": "bcdb_measurements",
                    "description": "",
                    "system": "bcdb",
                    "id": 25,
                    "attribute_name": "BUILDING NUMBER"
                }
            ],
            "description": "",
            "title": "COMPANY_PROFILE",
            "id": 2
        }
    ],
    "GDSName": "LHS Entities",
    "GDSElements": [
        {
            "criticality": "",
            "description": "",
            "title": "Postal Address",
            "id": 48,
            "linking": []
        },
        {
            "criticality": "",
            "description": "",
            "title": "Full Name",
            "id": 49,
            "linking": []
        }
    ],
    "GDSId": 40000001
}
};

export default mockApiData;
