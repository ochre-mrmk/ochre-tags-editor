import React from 'react';
require('font-awesome-webpack');

export default class Icon extends React.Component {
    static propTypes = {
        ext: React.PropTypes.string.isRequired,
        height: React.PropTypes.string
    }
    fileType (ext) {
        const types = {
            ["pdf"]: ["pdf"],
            ["excel"]: ["xls", "xlsx"],
            ["word"]: ["doc", "docx", "rtf"],
            ["text"]: ["txt", "log"],
            ["image"]: ["jpg", "png", "bmp", "jpeg", "gif", "tif", "tiff", "svg"],
            ["powerpoint"]: ["ppt", "pptx"],
            ["video"]: ["mp4", "avi", "mkv", "mpeg"],
            ["audio"]: ["mp3", "wav"]
        }
        return (Object.keys(types).find(t => (types[t].indexOf(ext) !== -1)));
    }
    render () {
        let classType = this.fileType(this.props.ext);
        classType = classType ? classType + '-' : '';
        return (
            <i className={`fa fa-file-${classType}o`} style={{
                fontSize: '100px',
                margin: '0 auto 10px auto',
                display: 'block',
                textAlign: 'center'
            }}></i>
        );
    }
}
