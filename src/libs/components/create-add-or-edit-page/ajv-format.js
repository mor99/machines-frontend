export default {
  treeSelect: {
    "$id": "treeSelect",
    type: "array",
    items: [
      {
        type: "object",
        properties:{
          title: {
            type: ["string","number",],
          },
          value: {
            type: ["string", "number",],
          },
          children: {
            '$ref': "treeSelect",
          }
        },
      }
    ],
  },
  tree: {
    type: "array",
    items: {
      oneOf: [
        {
          type: "string",
        },
        {
          type: "object",
          properties: {
            title: {
              type: ["string","number",],
            },
            value: {
              type: ["string","number",],
            },
          },
        },
      ],
    },
  },
}
