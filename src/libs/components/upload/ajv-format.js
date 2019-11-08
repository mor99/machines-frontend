export default {
  uploadReturnData: {
    type: "object",
    properties: {
      fileName: {
        type: "string",
      },
      fileUrl: {
        type: "string",
      },
      fileSuffix: {
        type: "string",
      },
      thumbUrl: {
        type: "string",
      },
      id: {
        type: "number",
      },
    },
    "required": [ "fileName","fileUrl", "fileSuffix"],
  },
  initImgListData: {
    type: "array",
    items: {
      oneOf: [
        {
          type: "string",
        },
        {
          type: "object",
          properties: {
            fileName: {
              type: "string",
            },
            fileUrl: {
              type: "string",
            },
            fileSuffix: {
              type: "string",
            },
            thumbUrl: {
              type: "string",
            },
            id: {
              type: ["string", "number", "null"],
            },
          },
          "required": [ "fileName","fileUrl", "fileSuffix"],
        },
      ],
    }
  },
  initFileListData: {
    type: "array",
    items: [
      {
        type: "object",
        properties: {
          fileName: {
            type: "string",
          },
          fileUrl: {
            type: "string",
          },
          fileSuffix: {
            type: "string",
          },
          thumbUrl: {
            type: "string",
          },
          id: {
            type: ["string", "number", "null"],
          },
        },
        "required": [ "fileName","fileUrl", "fileSuffix"],
      },
    ],
  },
}
