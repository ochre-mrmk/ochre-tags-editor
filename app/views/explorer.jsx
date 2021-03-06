import React from 'react';
import { Link } from 'react-router';
import request from 'superagent';
import Modal from 'react-modal';
import TagsInput from 'react-tagsinput';

export default class Explorer extends React.Component {
    static propTypes = {
        setFiles: React.PropTypes.func,
        files: React.PropTypes.array
    }
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            tags: []
        };
        this.statPath = this.statPath.bind(this);
        this.editTags = this.editTags.bind(this);
        this.setTags = this.setTags.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    closeModal() {
        this.setState({
            isEdit: false
        });
    }
    tagsChanged(tags) {
        this.setState({
            tags
        });
    }
    statPath(path) {
        request.get(path).end((err, res) => {
            if (!err) {
                this.props.setFiles(JSON.parse(res.text));
            } else {
                this.props.setFiles([]);
            }
        });
    }
    editTags(path) {
        request.get(path).end((err, res) => {
            if (!err) {
                this.setState({
                    isEdit: true,
                    path,
                    tags: JSON.parse(res.text).tags
                });
            }
        });
    }
    setTags(path) {
        debugger;
        console.log('hi');
        request.post(path).send({tags: this.state.tags}).end((err, res) => {
            this.setState({
                isEdit: false
            });
        });
    }
    componentWillMount() {
        this.statPath('/api' + this.props.location.pathname);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            let path = '/api' + nextProps.location.pathname;
            this.statPath(path);
        }
    }
    render() {
        let path = this.props.location.pathname;
        if (path[path.length - 1] === '/')
            path = path.substr(0, path.length - 1);
        return (
            <div>
                <h1>{path.split("/").reduce((currLink, sublink, index) => {
                        if (index !== 0 && sublink === "")
                            return currLink;
                        currLink.location += `${sublink}/`;
                        currLink.links.push(<Link key={currLink.location} to={currLink.location}>{sublink}/</Link>);
                        return currLink;
                    }, {
                        location: "",
                        links: []
                    }).links}</h1>
                    <hr />
                    { this.props.files ?
                        <ul style={{
                                listStyle: 'none'
                            }}>
                            { this.props.files.map(file => (
                                <li key={file} style={{
                                    float: 'left',
                                    marginRight: '60px',
                                    marginTop: '60px',
                                    fontSize: '20px'
                                }}>
                                    { file.length - 1 !== file.lastIndexOf('/') && file.length - 1 !== file.lastIndexOf('\\')
                                        ? <a onClick={this.editTags.bind(this, `/api${path}/${file}`)}>
                                            <img src="/assets/images/file.png" height="100" style={{
                                        display: 'block',
                                        margin: '0 auto'
                                    }}/>
                                    <div style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        width: '200px',
                                        wordWrap: 'break-word'
                                    }}>{file}</div></a>
                                    : <Link to={`${path}/${file}`}><img src="/assets/images/folder.png" height="100" style={{
                                        display: 'block',
                                        margin: '0 auto'
                                    }}/>
                                    <div style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        width: '200px',
                                        wordWrap: 'break-word'
                                    }}>{file}</div></Link> }
                                </li>
                            ))}
                        </ul>
                        : undefined }
                        <Modal
                            isOpen={this.state.isEdit}
                            onRequestClose={this.closeModal}>
                            <h2>Add Tags</h2>
                            <TagsInput value={this.state.tags} onChange={this.tagsChanged.bind(this)} style={{
                                marginTop: '50px'
                            }} />
                            <button onClick={this.setTags.bind(this, this.state.path)} className="tags-button">Save Tags</button>
                        </Modal>
                    <div style={{
                        height: '100px',
                        clear: 'both'
                    }}></div>
                    </div>
                );
            }
        }
