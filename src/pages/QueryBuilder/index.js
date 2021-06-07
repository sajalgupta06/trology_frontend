
import React, {Component} from 'react';
import {Query, Builder, BasicConfig, Utils} from 'react-awesome-query-builder';
import config from "./config_simple"; // <- you can try './config_complex' for more complex examples
// For AntDesign widgets only:
import AntdConfig from 'react-awesome-query-builder/lib/config/antd';
import 'react-awesome-query-builder/css/antd.less'; // or import "antd/dist/antd.css";
// For Material-UI widgets only:
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css'; //optional, for more compact styles
const {jsonLogicFormat, queryString, mongodbFormat, sqlFormat, getTree, checkTree, loadTree, uuid, loadFromJsonLogic} = Utils;
const emptyInitValue = {"id": uuid(), "type": "group"};

let loadedInitValue = {
  "type": "group",
  "id": "9a99988a-0123-4456-b89a-b1607f326fd8",
  "children1": {
    "a98ab9b9-cdef-4012-b456-71607f326fd9": {
      "type": "rule",
      "properties": {
        "field": "user.login",
        "operator": "equal",
        "value": [
          "batman"
        ],
        "valueSrc": [
          "value"
        ],
        "valueType": [
          "text"
        ]
      }
    },
    "98a8a9ba-0123-4456-b89a-b16e721c8cd0": {
      "type": "rule",
      "properties": {
        "field": "stock",
        "operator": "equal",
        "value": [
          false
        ],
        "valueSrc": [
          "value"
        ],
        "valueType": [
          "boolean"
        ]
      }
    },
    "aabbab8a-cdef-4012-b456-716e85c65e9c": {
      "type": "rule",
      "properties": {
        "field": "slider",
        "operator": "equal",
        "value": [
          35
        ],
        "valueSrc": [
          "value"
        ],
        "valueType": [
          "number"
        ]
      }
    }
  },
  "properties": {
    "conjunction": "AND",
    "not": false
  }
}
const initValue = loadedInitValue && Object.keys(loadedInitValue).length > 0 ? loadedInitValue : emptyInitValue;

// Choose your skin (ant/material/vanilla):
const InitialConfig = MaterialConfig //AntdConfig; // or MaterialConfig or BasicConfig


// You need to provide your own config. See below 'Config format'
// const config = {
//   ...InitialConfig,
//   fields: {
//     // qty: {
//     //     label: 'Qty',
//     //     type: 'number',
//     //     fieldSettings: {
//     //         min: 0,
//     //     },
//     //     valueSources: ['value'],
//     //     preferWidgets: ['number'],
//     // },
//     // price: {
//     //     label: 'Price',
//     //     type: 'number',
//     //     valueSources: ['value'],
//     //     fieldSettings: {
//     //         min: 10,
//     //         max: 100,
//     //     },
//     //     preferWidgets: ['slider', 'rangeslider'],
//     // },
//     // color: {
//     //     label: 'Color',
//     //     type: 'select',
//     //     valueSources: ['value'],
//     //     fieldSettings: {
//     //       listValues: [
//     //         { value: 'yellow', title: 'Yellow' },
//     //         { value: 'green', title: 'Green' },
//     //         { value: 'orange', title: 'Orange' }
//     //       ],
//     //     }
//     // },
//     // is_promotion: {
//     //     label: 'Promo?',
//     //     type: 'boolean',
//     //     operators: ['equal'],
//     //     valueSources: ['value'],
//     // },
//     // is_promotion: {
//     //     label: 'Test',
//     //     type: 'text',
//     //     operators: ['equal', 'proximity']
//     // },
//   }
// };
const initTree = checkTree(loadTree(initValue), config);
// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = {"id": uuid(), "type": "group"};


class DemoQueryBuilder extends Component {
    state = {
      tree: checkTree(loadTree(queryValue), config),
      config: config
    };
    
    render = () => (
      <div>
        {/* <Query
            {...config} 
            value={this.state.tree}
            onChange={this.onChange}
            renderBuilder={this.renderBuilder}
        /> */}
        <Query 
          {...config} 
          value={this.state.tree}
          onChange={this.onChange}
          renderBuilder={this.renderBuilder}
        />
        {this.renderResult(this.state)}
      </div>
    )

    renderBuilder = (props) => (
      <div className="query-builder-container" style={{padding: '10px'}}>
        <div className="query-builder qb-lite">
            <Builder {...props} />
        </div>
      </div>
    )

    renderResult = ({tree: immutableTree, config}) => (
      <div className="query-builder-result">
          {/* <div>Query string: <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre></div>
          <div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
          <div>SQL where: <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre></div>
          <div>JsonLogic: <pre>{JSON.stringify(QbUtils.jsonLogicFormat(immutableTree, config))}</pre></div> */}
      </div>
    )
    
    onChange = (immutableTree, config) => {
      // Tip: for better performance you can apply `throttle` - see `examples/demo`
      this.setState({tree: immutableTree, config: config});

      const jsonTree = getTree(immutableTree);
      console.log(jsonTree);
      // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    }
}
export default DemoQueryBuilder