import React, {PureComponent} from "react";
import PropTypes from "prop-types";

class FileDownList extends PureComponent {

  render() {
    const {fileList,} = this.props;
    return (
      <div
        className="common-file-list"
      >
        {
          fileList.map(z => {
            return (
              <div key={z.id}>
                <p>{z.fileName}</p>
                <a
                  href={`${z.fileUrl}?name=${z.fileName}`}
                >
                  下载
                </a>
              </div>
            );
          })
        }
        {
          fileList.length === 0 && <span>--</span>
        }
      </div>
    );
  }
}

FileDownList.propTypes = {
  fileList: PropTypes.array.isRequired,
};

FileDownList.defaultProps = {
  fileList: [],
};

export default FileDownList;
